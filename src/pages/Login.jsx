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
    <div className="flex flex-col items-center justify-center h-screen gap-4 bg-gradient-to-r from-purple-500 to-green-500">
      <div className="bg-white p-8 rounded shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">Student Login</h2>
        <input
          className="border p-2 mb-2 w-full"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="border p-2 mb-4 w-full"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded w-full" onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
}

// import { useState } from "react";
// import { authInstance } from "../firebase";
// import { signInWithEmailAndPassword } from "firebase/auth";
// import { useNavigate } from "react-router-dom";

// export default function LoginPage() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   const handleLogin = async () => {
//     try {
//       await signInWithEmailAndPassword(authInstance, email, password);
//       if (email === "admin@admin.com") {
//         navigate("/admin");
//       } else {
//         navigate("/dashboard");
//       }
//     } catch (error) {
//       alert("Login Failed: " + error.message);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center h-screen gap-4 bg-gradient-to-r from-purple-500 to-green-500">
//       <div className="bg-white p-8 rounded shadow-lg">
//         <h2 className="text-2xl font-bold mb-4 text-center">Student Login</h2>
//         <input
//           className="border p-2 mb-2 w-full"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />
//         <input
//           className="border p-2 mb-4 w-full"
//           placeholder="Password"
//           type="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />
//         <button className="bg-blue-500 text-white px-4 py-2 rounded w-full" onClick={handleLogin}>Login</button>
//       </div>
//     </div>
//   );
// }

