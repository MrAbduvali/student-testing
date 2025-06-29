import { useEffect, useState } from "react";
import { dbInstance } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import StudentRatingList from "./StudentRatingList";

export default function AdminPanel() {
  const [testResults, setTestResults] = useState([]);
  const [cssResults, setCssResults] = useState([]);
  const [editorResults, setEditorResults] = useState([]);
  const [cssEditorResults, setCssEditorResults] = useState([]);
  const [currentTab, setCurrentTab] = useState("html");
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [htmlSnap, cssSnap, editorSnap, cssEditorSnap] = await Promise.all([
          getDocs(collection(dbInstance, "htmlTestResults")),
          getDocs(collection(dbInstance, "cssTestResults")),
          getDocs(collection(dbInstance, "editorSubmissions")),
          getDocs(collection(dbInstance, "cssEditorSubmissions")) // Ensure this matches your Firestore collection name exactly
        ]);

        setTestResults(htmlSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setCssResults(cssSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setEditorResults(editorSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setCssEditorResults(cssEditorSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredResults = (data) => {
    return data.filter(item => 
      item.user?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const renderTable = (data, type) => {
    const filteredData = filteredResults(data);
    const hasScore = data.some(item => item.score !== undefined);
    
    return (
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              {hasScore && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Score
                  <span className="ml-1 text-xs text-gray-400">(max {Math.max(...data.map(item => item.score || 0))})</span>
                </th>
              )}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.length > 0 ? (
              filteredData.map((res, i) => (
                <tr key={res.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{i + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                        {res.user?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{res.user || "Anonymous"}</div>
                        <div className="text-sm text-gray-500">ID: {res.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(res.timestamp?.toDate?.() || Date.now()).toLocaleString()}
                  </td>
                  {hasScore && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className={`h-2.5 rounded-full ${res.score >= 70 ? 'bg-green-500' : res.score >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                            style={{ width: `${res.score}%` }}
                          ></div>
                        </div>
                        <span className="ml-2 text-sm font-medium text-gray-700">{res.score || "0"}%</span>
                      </div>
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link 
                      to={`/${type}/${res.id}`} 
                      className="text-indigo-600 hover:text-indigo-900 hover:underline"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={hasScore ? 5 : 4} className="px-6 py-4 text-center text-sm text-gray-500">
                  No results found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };

  const getCurrentData = () => {
    switch(currentTab) {
      case "html": return testResults;
      case "css": return cssResults;
      case "editor": return editorResults;
      case "cssEditor": return cssEditorResults;
      default: return [];
    }
  };

  const getRouteType = () => {
    switch(currentTab) {
      case "html": return "details";
      case "css": return "cssdetails";
      case "editor": return "editordetails";
      case "cssEditor": return "csseditordetails"; // Changed to lowercase for consistency
      default: return "";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto mb-[100px]">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="mt-2 text-gray-600">
              Review and manage user submissions and test results
            </p>
          </div>
          <div className="mt-4 md:mt-0 relative">
            <input
              type="text"
              placeholder="Search users or IDs..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute left-3 top-2.5 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setCurrentTab("html")}
                className={`px-6 py-4 text-sm font-medium ${currentTab === "html" ? "border-b-2 border-indigo-500 text-indigo-600" : "text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
              >
                HTML Test Results
                <span className="ml-2 bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {testResults.length}
                </span>
              </button>

              <button
                onClick={() => setCurrentTab("css")}
                className={`px-6 py-4 text-sm font-medium ${currentTab === "css" ? "border-b-2 border-indigo-500 text-indigo-600" : "text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
              >
                CSS Test Results
                <span className="ml-2 bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {cssResults.length}
                </span>
              </button>

              <button
                onClick={() => setCurrentTab("editor")}
                className={`px-6 py-4 text-sm font-medium ${currentTab === "editor" ? "border-b-2 border-indigo-500 text-indigo-600" : "text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
              >
                Editor Submissions
                <span className="ml-2 bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {editorResults.length}
                </span>
              </button>

              <button
                onClick={() => setCurrentTab("cssEditor")}
                className={`px-6 py-4 text-sm font-medium ${currentTab === "cssEditor" ? "border-b-2 border-indigo-500 text-indigo-600" : "text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
              >
                Css Editor Submissions
                <span className="ml-2 bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {cssEditorResults.length}
                </span>
              </button>
            </nav>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">
                {currentTab === "html" && "HTML Test Results"}
                {currentTab === "css" && "CSS Test Results"}
                {currentTab === "editor" && "Editor Submissions"}
                {currentTab === "cssEditor" && "Css Editor Submissions"}
              </h2>
              <div className="text-sm text-gray-500">
                Showing {filteredResults(getCurrentData()).length} of {getCurrentData().length} entries
              </div>
            </div>
            {renderTable(getCurrentData(), getRouteType())}
          </div>
        )}
      </div>
      <StudentRatingList />
    </div>
  );
}
