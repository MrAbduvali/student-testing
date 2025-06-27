// AdminPanel.jsx
import { useEffect, useState } from "react";
import { dbInstance } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";

export default function AdminPanel() {
  const [testResults, setTestResults] = useState([]);
  const [cssResults, setCssResults] = useState([]);
  const [editorResults, setEditorResults] = useState([]);
  const [currentTab, setCurrentTab] = useState("html");

  useEffect(() => {
    getDocs(collection(dbInstance, "htmlTestResults")).then(snapshot => {
      setTestResults(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    getDocs(collection(dbInstance, "cssTestResults")).then(snapshot => {
      setCssResults(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    getDocs(collection(dbInstance, "editorSubmissions")).then(snapshot => {
      setEditorResults(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  }, []);

  const renderTable = (data, type) => (
    <table className="min-w-full text-left">
      <thead>
        <tr>
          <th className="border px-4 py-2">#</th>
          <th className="border px-4 py-2">User</th>
          <th className="border px-4 py-2">Date</th>
          <th className="border px-4 py-2">Score</th>
        </tr>
      </thead>
      <tbody>
        {data.map((res, i) => (
          <tr key={res.id} className="hover:bg-gray-50">
            <td className="border px-4 py-2">{i + 1}</td>
            <td className="border px-4 py-2">
              <Link to={`/${type}/${res.id}`} className="text-blue-600 underline">
                {res.user}
              </Link>
            </td>
            <td className="border px-4 py-2">
              {new Date(res.timestamp?.toDate?.() || Date.now()).toLocaleString()}
            </td>
            <td className="border px-4 py-2">{res.score || "-"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>

        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setCurrentTab("html")}
            className={`px-4 py-2 rounded ${currentTab === "html" ? "bg-purple-600 text-white" : "bg-gray-200"}`}
          >HTML Test</button>

          <button
            onClick={() => setCurrentTab("css")}
            className={`px-4 py-2 rounded ${currentTab === "css" ? "bg-purple-600 text-white" : "bg-gray-200"}`}
          >CSS Test</button>

          <button
            onClick={() => setCurrentTab("editor")}
            className={`px-4 py-2 rounded ${currentTab === "editor" ? "bg-purple-600 text-white" : "bg-gray-200"}`}
          >Editor Submissions</button>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          {currentTab === "html" && renderTable(testResults, "details")}
          {currentTab === "css" && renderTable(cssResults, "cssdetails")}
          {currentTab === "editor" && renderTable(editorResults, "editordetails")}
        </div>
      </div>
    </div>
  );
}

// Albatta /details/:id, /cssdetails/:id va /editordetails/:id sahifalari alohida ko'rinish uchun kerak.
// Xohlasangiz ularni ham yozib beraman.

