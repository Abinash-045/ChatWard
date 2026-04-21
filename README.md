# 💬 ChatWard - Full Stack Realtime Chat Application

A modern, real-time chat application built with the MERN stack, featuring instant messaging, user authentication, and a beautiful UI.

## 🚀 Tech Stack

### Frontend
- ⚛️ **React** - UI library
- ⚡ **Vite** - Build tool and dev server
- 🎨 **TailwindCSS** - Utility-first CSS framework
- 🌸 **DaisyUI** - Component library for TailwindCSS
- 🔄 **Zustand** - Lightweight state management
- 🔌 **Socket.io Client** - Real-time communication
- 🧭 **React Router DOM** - Client-side routing
- 🎯 **Axios** - HTTP client
- 🔔 **React Hot Toast** - Toast notifications
- 🎨 **Lucide React** - Icon library

### Backend
- 🟢 **Node.js** - Runtime environment
- 🚂 **Express.js** - Web framework
- 🍃 **MongoDB** - NoSQL database
- 🍃 **Mongoose** - MongoDB object modeling
- 🔌 **Socket.io** - Real-time bidirectional communication
- 🔐 **JWT** - Authentication tokens
- 🔒 **bcryptjs** - Password hashing
- ☁️ **Cloudinary** - Image upload and management
- 🍪 **Cookie Parser** - Cookie handling
- 🌐 **CORS** - Cross-origin resource sharing

## ✨ Features

- 🔐 **Authentication & Authorization** - Secure JWT-based authentication with protected routes
- 💬 **Real-time Messaging** - Instant message delivery using Socket.io
- 👥 **Online User Status** - See who's online in real-time
- 👤 **User Profiles** - View and manage user profiles
- ⚙️ **Settings Page** - Customize your experience
- 🎨 **Theme Support** - Beautiful UI with theme customization
- 🖼️ **Image Upload** - Upload and share images via Cloudinary
- 📱 **Responsive Design** - Works seamlessly on all devices
- 🔄 **Global State Management** - Efficient state management with Zustand
- 🛡️ **Error Handling** - Comprehensive error handling on both client and server
- 🚀 **Production Ready** - Optimized for deployment

## 📋 Project Details

ChatWard is a full-stack real-time chat application that allows users to:
- Create accounts and authenticate securely
- Send and receive messages in real-time
- See online/offline status of other users
- Upload and share images
- Customize their profile and settings
- Enjoy a smooth, modern user experience

The application uses a RESTful API for authentication and message management, combined with WebSocket connections for real-time messaging capabilities.

## 🔑 Environment Variables

### Backend (.env)

Create a `.env` file in the `backend` directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=your_mongodb_connection_string

# JWT Secret
JWT_SECRET=your_jwt_secret_key

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### Environment Variables Explanation

- **PORT** - Port number for the backend server (default: 5000)
- **NODE_ENV** - Environment mode (development/production)
- **MONGODB_URI** - MongoDB database connection string
- **JWT_SECRET** - Secret key for signing JWT tokens
- **CLOUDINARY_CLOUD_NAME** - Your Cloudinary cloud name
- **CLOUDINARY_API_KEY** - Your Cloudinary API key
- **CLOUDINARY_API_SECRET** - Your Cloudinary API secret

## 🛠️ Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB database (local or cloud)
- Cloudinary account (for image uploads)

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd ChatWard
```

### Step 2: Install Dependencies

Install dependencies for both frontend and backend:

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Step 3: Configure Environment Variables

1. Navigate to the `backend` directory
2. Create a `.env` file
3. Add all the required environment variables as shown above

### Step 4: Start the Development Servers

#### Start Backend Server

```bash
cd backend
npm run dev
```

The backend server will run on `http://localhost:5000` (or your specified PORT)

#### Start Frontend Server

Open a new terminal and run:

```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:5173`

### Step 5: Build for Production

To build the frontend for production:

```bash
cd frontend
npm run build
```

To start the production server:

```bash
cd backend
npm start
```



## 🎯 Usage

1. **Sign Up**: Create a new account
2. **Login**: Authenticate with your credentials
3. **Start Chatting**: Select a user from the sidebar and start messaging
4. **Upload Images**: Share images in your conversations
5. **Customize**: Update your profile and settings

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 📝 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Abinash Behera**

---

## ⭐ Star this Repository

If you find this project helpful or interesting, please consider giving it a ⭐ star on GitHub! Your support means a lot and helps others discover this project.

---

Made with ❤️ by Abinash Behera.
