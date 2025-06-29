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
import CssEditorSubmit from "./pages/CssEditor";
import CssEditorDetails from './pages/CssEditorDetails'
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/html" element={<HtmlTest />} />
        <Route path="/css" element={<CssTest />} />
        <Route path="/htmleditor" element={<EditorSubmit />} />
        <Route path="/csseditor" element={<CssEditorSubmit />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/details/:id" element={<Details />} />
        <Route path="/cssdetails/:id" element={<CssDetails />} />
        <Route path="/editordetails/:id" element={<EditorDetails />} />
        <Route path="/csseditordetails/:id" element={<CssEditorDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

