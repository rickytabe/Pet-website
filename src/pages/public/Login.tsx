import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaPaw, FaEye, FaEyeSlash, FaExclamationTriangle } from "react-icons/fa";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const { login, user } = useAuth();
  const navigate = useNavigate();

  if (user) navigate("/");

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email format";
    }

    if (!password) {
      newErrors.password = "Password is required";
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
      await login(email, password);
      toast.success("Logged in successfully!");
      navigate("/");
    } catch (error: any) {
      console.error('Error',error.message);
      if (error.message === 'Firebase: Error (auth/user-not-found).') {
        setErrors({ general: "No account found with this email." });
        toast.error('No account found with this email.');
      } else if (error.message === 'Firebase: Error (auth/wrong-password).') {
        setErrors({ general: "Incorrect password. Please try again." });
        toast.error('Incorrect password.');
      } else if (error.message === 'Firebase: Error (auth/too-many-requests).') {
        setErrors({ general: "Too many attempts. Please try again later." });
        toast.error('Too many attempts. Please try again later.');
      }else if(error.message === 'Firebase: Error (auth/invalid-credential).'){
           setErrors({ general: "Invalid Email or Password. Please try again." });
           toast.error('Invalid Email or Password. Please try again.');
      }else if (error.message === 'Firebase: Error (auth/network-request-failed).') {
        setErrors({ general: "You are not connected to the internet. Check Your Internet Connection" });
        toast.error('You are not connected to the internet.');
      } else {
        setErrors({ general: "Login failed. Please try again." });
        toast.error('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
        <div className="flex flex-col items-center mb-8">
          <FaPaw className="text-4xl text-blue-600 mb-2" />
          <h1 className="text-2xl font-bold text-gray-800">Happy Paws</h1>
          <h2 className="text-xl text-gray-600 mt-2">Welcome Back</h2>
        </div>

        {errors.general && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded flex items-center">
            <FaExclamationTriangle className="mr-2 flex-shrink-0" />
            <span>{errors.general}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({...errors, email: ''});
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
                  if (errors.password) setErrors({...errors, password: ''});
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
            {errors.password && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <FaExclamationTriangle className="mr-1" /> {errors.password}
              </p>
            )}
            <div className="text-right mt-1">
              <Link 
                to="/forgot-password" 
                className="text-sm text-blue-600 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
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
                Signing In...
              </span>
            ) : "Sign In"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-600 hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};