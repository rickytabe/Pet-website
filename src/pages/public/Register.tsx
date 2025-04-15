import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaPaw,
  FaEye,
  FaEyeSlash,
  FaExclamationTriangle,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
// import { getAuthErrorMessage } from "../../utils/FirebaseErrors";
import zxcvbn from "zxcvbn";

export const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { register, user } = useAuth();
  const navigate = useNavigate();

  const passwordStrength = zxcvbn(password);
  const strengthColors = [
    "#ff0000",
    "#ff4000",
    "#ff8000",
    "#00ff00",
    "#008000",
  ];

  if (user) navigate("/");

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Name validation
    if (name.trim() === "") {
      newErrors.name = "Name is required";
    } else if (/[0-9]/.test(name)) {
      newErrors.name = "Name should not contain numbers";
    } else if (!/^[a-zA-Z\s'-]+$/.test(name)) {
      newErrors.name = "Name contains invalid characters";
    } else if (name.length < 2) {
      newErrors.name = "Name is too short";
    } else if (name.length > 50) {
      newErrors.name = "Name is too long";
    }
  

    // Email validation
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email format";
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (passwordStrength.score < 1) {
      newErrors.password = "Password is too weak";
    }

    // Confirm password validation
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      await register(name, email, password);
      toast.success("Account created successfully!");
      navigate("/");
    } catch (error: any) {
      if (error.message === 'Firebase: Error (auth/email-already-in-use).') {
        setErrors({ general: "Email already in use. Please try another one." });
        toast.error('Email already in use. Please try another one.');
      } else if (error.message === 'Firebase: Error (auth/invalid-email).') {
        setErrors({ general: "Invalid email address. Please check your email." });
        toast.error('Invalid email address.');
      } else if (error.message === 'Firebase: Error (auth/weak-password).') {
        setErrors({ general: "Password should be at least 6 characters." });
        toast.error('Password too weak.');
      } else {
        setErrors({ general: "Registration failed. Please try again." });
        toast.error('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
        <div className="flex flex-col items-center mb-8">
          <FaPaw className="text-4xl text-blue-600 mb-2" />
          <h1 className="text-2xl font-bold text-gray-800">Happy Paws</h1>
          <h2 className="text-xl text-gray-600 mt-2">Create Account</h2>
        </div>
        {errors.general && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            <p className="flex items-center">
              <FaExclamationTriangle className="mr-2" />
              {errors.general}
            </p>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors({ ...errors, name: "" });
              }}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.name ? "border-red-500" : "border-gray-300"
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              required
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <FaExclamationTriangle className="mr-1" /> {errors.name}
              </p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: "" });
              }}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              required
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <FaExclamationTriangle className="mr-1" /> {errors.email}
              </p>
            )}
          </div>

          <div className="relative">
            <label className="block text-gray-700 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors({ ...errors, password: "" });
                }}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10`}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <div className="mt-2">
              <div className="flex gap-1 h-2">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-full"
                    style={{
                      backgroundColor:
                        i < passwordStrength.score + 1
                          ? strengthColors[passwordStrength.score]
                          : "#e5e7eb",
                    }}
                  />
                ))}
              </div>
              <p className="text-sm mt-1 text-gray-500">
                Password strength:{" "}
                {
                  ["Very Weak", "Weak", "Fair", "Strong", "Very Strong"][
                    passwordStrength.score
                  ]
                }
              </p>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <FaExclamationTriangle className="mr-1" /> {errors.password}
                </p>
              )}
            </div>
          </div>

          <div className="relative">
            <label className="block text-gray-700 mb-2">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword)
                    setErrors({ ...errors, confirmPassword: "" });
                }}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10`}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <FaExclamationTriangle className="mr-1" />{" "}
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Your Account...
              </span>
            ) : "Create Account"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
