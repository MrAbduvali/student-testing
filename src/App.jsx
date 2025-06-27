import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import HtmlTest from "./pages/HtmlTest";
import CssTest from "./pages/CssTest";
import EditorSubmit from "./pages/Editor";
import AdminPage from "./pages/Admin";
import Details from "./pages/Details";
import CssDetails from "./pages/CssDetails";
import EditorDetails from "./pages/EditorDetails";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/html" element={<HtmlTest />} />
        <Route path="/css" element={<CssTest />} />
        <Route path="/editor" element={<EditorSubmit />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/details/:id" element={<Details />} />
        <Route path="/cssdetails/:id" element={<CssDetails />} />
        <Route path="/editordetails/:id" element={<EditorDetails />} />
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
