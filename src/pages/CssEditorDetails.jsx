import { useEffect, useState } from "react";
import { dbInstance } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";

export default function CssEditorDetails() {
  const { id } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTask, setActiveTask] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResult = async () => {
      try {
        setLoading(true);
        const docRef = doc(dbInstance, "cssEditorSubmissions", id);
        const snapshot = await getDoc(docRef);
        
        if (!snapshot.exists()) {
          throw new Error("Submission not found");
        }
        
        const data = snapshot.data();
        setResult({
          id: snapshot.id,
          ...data,
          // Ensure tasks exist and have proper structure
          tasks: data.tasks || {
            task1: { html: "", css: "" },
            task2: { html: "", css: "" },
            task3: { html: "", css: "" },
            task4: { html: "", css: "" },
            task5: { html: "", css: "" }
          }
        });
      } catch (error) {
        console.error("Error fetching submission:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-yellow-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-yellow-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-xl shadow-md max-w-md text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Submission Not Found</h2>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700"
          >
            Back to Results
          </button>
        </div>
      </div>
    );
  }

  const currentTask = result.tasks[`task${activeTask}`] || { html: "", css: "" };
  const combinedCode = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>${currentTask.css}</style>
    </head>
    <body>${currentTask.html}</body>
    </html>
  `;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-yellow-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-pink-600 hover:text-pink-800"
          >
            <ChevronLeftIcon className="h-5 w-5 mr-1" />
            Back to Results
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-2xl font-bold text-gray-900">Editor Submission Details</h2>
            <div className="flex flex-wrap gap-4 mt-2">
              <div>
                <p className="text-sm text-gray-500">User</p>
                <p className="font-medium">{result.user || "Anonymous"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Submitted</p>
                <p className="font-medium">
                  {new Date(result.timestamp?.toDate?.() || Date.now()).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Task Navigation */}
        <div className="flex overflow-x-auto gap-2 mb-6 pb-2">
          {[1, 2, 3, 4, 5].map((taskNum) => (
            <button
              key={taskNum}
              onClick={() => setActiveTask(taskNum)}
              className={`px-4 py-2 rounded-md font-medium whitespace-nowrap ${
                activeTask === taskNum
                  ? "bg-pink-600 text-white"
                  : "bg-white text-pink-600 hover:bg-pink-50"
              }`}
            >
              Task {taskNum}
            </button>
          ))}
        </div>

        {/* Code and Preview Tabs */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          <div className="flex border-b border-gray-200">
            <button
              className={`px-6 py-3 font-medium ${
                "text-pink-600 border-b-2 border-pink-500"
              }`}
            >
              Task {activeTask} Submission
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
            {/* HTML Code */}
            <div className="h-full">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-700">
                  <span className="bg-pink-100 text-pink-800 px-2 py-1 rounded-md text-sm">HTML</span>
                </h3>
                <span className="text-xs text-gray-500">
                  {currentTask.html?.length || 0} characters
                </span>
              </div>
              <pre className="w-full h-64 font-mono text-sm p-4 bg-gray-50 border border-gray-200 rounded-lg overflow-auto">
                {currentTask.html || "No HTML code submitted for this task"}
              </pre>
            </div>

            {/* CSS Code */}
            <div className="h-full">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-700">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm">CSS</span>
                </h3>
                <span className="text-xs text-gray-500">
                  {currentTask.css?.length || 0} characters
                </span>
              </div>
              <pre className="w-full h-64 font-mono text-sm p-4 bg-gray-50 border border-gray-200 rounded-lg overflow-auto">
                {currentTask.css || "No CSS code submitted for this task"}
              </pre>
            </div>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h3 className="font-medium text-gray-700">Task {activeTask} Preview</h3>
          </div>
          <div className="p-4">
            <iframe
              title={`Task ${activeTask} Preview`}
              srcDoc={combinedCode}
              sandbox="allow-same-origin allow-scripts"
              className="w-full h-96 border rounded-lg bg-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
}