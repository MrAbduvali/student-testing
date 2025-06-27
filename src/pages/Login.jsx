import { useState } from "react";
import { authInstance } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(authInstance, email, password);
      if (email === "admin@admin.com") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      alert("Login Failed: " + error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-800 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-6 text-white">
          <h1 className="text-3xl font-bold text-center">Examify</h1>
          <p className="text-center opacity-90 mt-1">Student Testing Portal</p>
        </div>
        
        <div className="p-8">
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2">Email</label>
            <input
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              placeholder="student@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div className="mb-8">
            <label className="block text-gray-700 text-sm font-medium mb-2">Password</label>
            <input
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <button 
            onClick={handleLogin}
            className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:from-purple-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}