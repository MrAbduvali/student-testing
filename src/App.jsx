import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/Login";
import DashboardPage from "./pages/Dashboard";
import TestPage from "./pages/Test";
import AdminPage from "./pages/Admin";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  );
}

// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import LoginPage from "./pages/Login";
// import DashboardPage from "./pages/Dashboard";
// import TestPage from "./pages/Test";
// import AdminPage from "./pages/Admin";

// export default function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<LoginPage />} />
//         <Route path="/dashboard" element={<DashboardPage />} />
//         <Route path="/test" element={<TestPage />} />
//         <Route path="/admin" element={<AdminPage />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

