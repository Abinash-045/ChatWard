import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";
import { RekognitionClient, SearchFacesByImageCommand, IndexFacesCommand } from "@aws-sdk/client-rekognition";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

const rekognition = new RekognitionClient({ region: "ap-south-1" });
const s3 = new S3Client({ region: "ap-south-1" });
const BUCKET = "face-recognition-chatward";
const COLLECTION_ID = "chatward-collection";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "Email already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      return res.status(400).json({ message: "Profile pic is required" });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("error in update profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ───── FACE LOGIN (with PIN) ─────
export const faceLogin = async (req, res) => {
  try {
    const { imageBase64, pin } = req.body;

    if (!imageBase64) return res.status(400).json({ message: "Image is required" });
    if (!pin || pin.length !== 4) return res.status(400).json({ message: "PIN must be 4 digits" });

    // ✅ Fixed image parsing
    const matches = imageBase64.match(/^data:image\/(\w+);base64,(.+)$/);
    if (!matches) return res.status(400).json({ message: "Invalid image format" });
    const imageBuffer = Buffer.from(matches[2], "base64");

    const command = new SearchFacesByImageCommand({
      CollectionId: COLLECTION_ID,
      Image: { Bytes: imageBuffer },
      MaxFaces: 1,
      FaceMatchThreshold: 90,
    });

    const response = await rekognition.send(command);

    if (!response.FaceMatches || response.FaceMatches.length === 0) {
      return res.status(401).json({ message: "Face not recognized" });
    }

    const faceId = response.FaceMatches[0].Face.FaceId;
    const user = await User.findOne({ rekognitionId: faceId });

    if (!user) {
      return res.status(401).json({ message: "No account linked to this face" });
    }

    if (!user.facePin) {
      return res.status(401).json({ message: "No PIN set. Please register face again" });
    }

    const isPinCorrect = await bcrypt.compare(pin, user.facePin);
    if (!isPinCorrect) {
      return res.status(401).json({ message: "Incorrect PIN" });
    }

    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error in faceLogin:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ───── FACE REGISTER (with PIN) ─────
export const faceRegister = async (req, res) => {
  try {
    const { imageBase64, pin } = req.body;
    const userId = req.user._id;

    if (!imageBase64) return res.status(400).json({ message: "Image is required" });
    if (!pin || pin.length !== 4) return res.status(400).json({ message: "PIN must be 4 digits" });

    // ✅ Fixed image parsing
    const matches = imageBase64.match(/^data:image\/(\w+);base64,(.+)$/);
    if (!matches) return res.status(400).json({ message: "Invalid image format" });
    const imageBuffer = Buffer.from(matches[2], "base64");

    const key = `${uuidv4()}.jpg`;

    await s3.send(new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: imageBuffer,
      ContentType: "image/jpeg",
    }));

    const indexCommand = new IndexFacesCommand({
      CollectionId: COLLECTION_ID,
      Image: { S3Object: { Bucket: BUCKET, Name: key } },
      MaxFaces: 1,
      DetectionAttributes: [],
    });

    const indexResponse = await rekognition.send(indexCommand);

    if (!indexResponse.FaceRecords || indexResponse.FaceRecords.length === 0) {
      // ✅ Clean up S3 if no face detected
      await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
      return res.status(400).json({ message: "No face detected. Please use a clear photo." });
    }

    const faceId = indexResponse.FaceRecords[0].Face.FaceId;

    const salt = await bcrypt.genSalt(10);
    const hashedPin = await bcrypt.hash(pin, salt);

    await User.findByIdAndUpdate(userId, {
      rekognitionId: faceId,
      facePin: hashedPin,
    });

    await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));

    res.status(200).json({ message: "Face and PIN registered successfully" });
  } catch (error) {
    console.log("Error in faceRegister:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};