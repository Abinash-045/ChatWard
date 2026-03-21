import { useState, useRef } from "react";
import { useAuthStore } from "../store/useAuthStore";
import AuthImagePattern from "../components/AuthImagePattern";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Loader2, Lock, Mail, MessageCircle, ScanFace } from "lucide-react";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [facePin, setFacePin] = useState("");
  const [showPinInput, setShowPinInput] = useState(false);
  const [pendingFaceImage, setPendingFaceImage] = useState(null);
  const faceInputRef = useRef(null);
  const { login, faceLogin, isLoggingIn } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    login(formData);
  };

  const handleFaceSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setPendingFaceImage(reader.result);
      setShowPinInput(true);
    };
    reader.readAsDataURL(file);
  };

  const handleFaceLogin = async () => {
    if (!pendingFaceImage || facePin.length !== 4) return;
    await faceLogin(pendingFaceImage, facePin);
    setShowPinInput(false);
    setFacePin("");
    setPendingFaceImage(null);
  };

  const handleCancel = () => {
    setShowPinInput(false);
    setFacePin("");
    setPendingFaceImage(null);
  };

  return (
    <div className="h-screen grid lg:grid-cols-2">
      {/* Left Side - Form */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">

          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <MessageCircle className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Welcome Back</h1>
              <p className="text-base-content/60">Sign in to your account</p>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-base-content/40" />
                </div>
                <input
                  type="email"
                  className="input input-bordered w-full pl-10"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-base-content/40" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="input input-bordered w-full pl-10"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-base-content/40" />
                  ) : (
                    <Eye className="h-5 w-5 text-base-content/40" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <><Loader2 className="h-5 w-5 animate-spin" />Loading...</>
              ) : "Sign in"}
            </button>
          </form>

          <div className="divider text-xs text-base-content/40">OR</div>

          {/* Face Login Section */}
          {!showPinInput ? (
            <button
              type="button"
              className="btn btn-outline w-full gap-2"
              onClick={() => faceInputRef.current.click()}
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <><Loader2 className="h-5 w-5 animate-spin" />Scanning face...</>
              ) : (
                <><ScanFace className="h-5 w-5" />Login with Face + PIN</>
              )}
            </button>
          ) : (
            /* PIN Input - shows after photo selected */
            <div className="space-y-4 p-4 bg-base-200 rounded-xl border border-base-300">
              {/* Face preview + status */}
              <div className="flex items-center gap-3">
                <img
                  src={pendingFaceImage}
                  className="w-12 h-12 rounded-full object-cover border-2 border-primary"
                  alt="Face preview"
                />
                <div>
                  <p className="text-sm font-medium">Face captured ✓</p>
                  <p className="text-xs text-base-content/60">Now enter your 4-digit PIN</p>
                </div>
              </div>

              {/* PIN Input */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">4-digit PIN</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-base-content/40" />
                  </div>
                  <input
                    type="password"
                    className="input input-bordered w-full pl-10 tracking-widest text-center text-lg"
                    placeholder="• • • •"
                    maxLength={4}
                    value={facePin}
                    onChange={(e) => setFacePin(e.target.value.replace(/\D/g, ""))}
                    autoFocus
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-2">
                <button
                  className="btn btn-primary flex-1 gap-2"
                  onClick={handleFaceLogin}
                  disabled={isLoggingIn || facePin.length !== 4}
                >
                  {isLoggingIn ? (
                    <><Loader2 className="h-5 w-5 animate-spin" />Verifying...</>
                  ) : (
                    <><ScanFace className="h-5 w-5" />Verify & Login</>
                  )}
                </button>
                <button
                  className="btn btn-ghost"
                  onClick={handleCancel}
                  disabled={isLoggingIn}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Hidden file input */}
          <input
            ref={faceInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFaceSelect}
          />

          {/* Sign up link */}
          <div className="text-center">
            <p className="text-base-content/60">
              Don&apos;t have an account?{" "}
              <Link to="/signup" className="link link-primary">
                Create account
              </Link>
            </p>
          </div>

        </div>
      </div>

      {/* Right Side */}
      <AuthImagePattern
        title={"Welcome back!"}
        subtitle={"Sign in to continue your conversations and catch up with your messages."}
      />
    </div>
  );
};

export default LoginPage;