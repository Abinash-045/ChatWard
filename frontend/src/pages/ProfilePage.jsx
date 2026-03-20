import { useState, useRef } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User, ScanFace, Loader2, CheckCircle } from "lucide-react";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile, faceRegister } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const [facePreview, setFacePreview] = useState(null);
  const faceInputRef = useRef(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  const handleFaceRegister = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = reader.result;
      setFacePreview(base64Image);
      await faceRegister(base64Image);
    };
  };

  return (
    <div className="h-screen pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold">Profile</h1>
            <p className="mt-2">Your profile information</p>
          </div>

          {/* Profile Photo Upload */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={selectedImg || authUser.profilePic || "/avatar.png"}
                alt="Profile"
                className="size-32 rounded-full object-cover border-4"
              />
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                `}
              >
                <Camera className="w-5 h-5 text-base-200" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-sm text-zinc-400">
              {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
            </p>
          </div>

          {/* User Info */}
          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.fullName}</p>
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.email}</p>
            </div>
          </div>

          {/* ───── FACE RECOGNITION SECTION ───── */}
          <div className="bg-base-200 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2">
              <ScanFace className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-medium">Face Recognition Login</h2>
            </div>
            <p className="text-sm text-zinc-400">
              Register your face to enable quick biometric login. 
              Make sure your face is clearly visible in the photo.
            </p>

            {/* Face Status */}
            <div className="flex items-center justify-between py-2 px-4 bg-base-300 rounded-lg">
              <span className="text-sm">Face Login Status</span>
              {authUser?.rekognitionId ? (
                <span className="flex items-center gap-1.5 text-green-500 text-sm font-medium">
                  <CheckCircle className="w-4 h-4" />
                  Registered
                </span>
              ) : (
                <span className="text-sm text-zinc-400">Not registered</span>
              )}
            </div>

            {/* Face Preview */}
            {facePreview && (
              <div className="flex justify-center">
                <img
                  src={facePreview}
                  alt="Face preview"
                  className="w-24 h-24 rounded-full object-cover border-4 border-primary"
                />
              </div>
            )}

            {/* Register Face Button */}
            <button
              onClick={() => faceInputRef.current.click()}
              disabled={isUpdatingProfile}
              className="btn btn-primary w-full gap-2"
            >
              {isUpdatingProfile ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Registering face...
                </>
              ) : (
                <>
                  <ScanFace className="w-5 h-5" />
                  {authUser?.rekognitionId ? "Update Face" : "Register Face"}
                </>
              )}
            </button>

            {/* Hidden file input */}
            <input
              ref={faceInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFaceRegister}
            />

            <p className="text-xs text-zinc-500 text-center">
              Your face data is securely stored using AWS Rekognition
            </p>
          </div>
          {/* ───── END FACE RECOGNITION SECTION ───── */}

          {/* Account Information */}
          <div className="mt-6 bg-base-300 rounded-xl p-6">
            <h2 className="text-lg font-medium mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span>{authUser.createdAt?.split("T")[0]}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;