import { authInstance } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut(authInstance);
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4 bg-gradient-to-r from-green-400 to-blue-400">
      <div className="bg-white p-8 rounded shadow-lg">
        <h2 className="text-xl mb-4">Welcome, {authInstance.currentUser?.email}</h2>
        <button className="bg-green-500 text-white px-4 py-2 rounded mb-2 w-full" onClick={() => navigate("/test")}>Start Test</button>
        <button className="bg-red-500 text-white px-4 py-2 rounded w-full" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}


// import { authInstance } from "../firebase";
// import { signOut } from "firebase/auth";
// import { useNavigate } from "react-router-dom";

// export default function DashboardPage() {
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     signOut(authInstance);
//     navigate("/");
//   };

//   return (
//     <div className="flex flex-col items-center justify-center h-screen gap-4 bg-gradient-to-r from-green-400 to-blue-400">
//       <div className="bg-white p-8 rounded shadow-lg">
//         <h2 className="text-xl mb-4">
//           Welcome, {authInstance.currentUser?.email}
//         </h2>
//         <button
//           className="bg-green-500 text-white px-4 py-2 rounded mb-2 w-full"
//           onClick={() => navigate("/test")}
//         >
//           Start Test
//         </button>
//         <button
//           className="bg-red-500 text-white px-4 py-2 rounded w-full"
//           onClick={handleLogout}
//         >
//           Logout
//         </button>
//       </div>
//     </div>
//   );
// }
