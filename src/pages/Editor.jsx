import { useState, useEffect } from "react";
import { dbInstance, authInstance } from "../firebase";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function EditorSubmit() {
  const [htmlCode, setHtmlCode] = useState("");
  const [cssCode, setCssCode] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTask, setActiveTask] = useState(1);
  const [tasks, setTasks] = useState({
    task1: { html: "", css: "" },
    task2: { html: "", css: "" },
    task3: { html: "", css: "" },
    task4: { html: "", css: "" },
    task5: { html: "", css: "" },
  });
  const navigate = useNavigate();
  const user = authInstance.currentUser?.email || "unknown";

  // Task descriptions with example images (replace with your actual image paths)
  const taskDescriptions = [
    {
      id: 1,
      title: "Task 1: Create a Header",
      description: "Build a responsive header with navigation",
      image:
        "https://drive.google.com/file/d/1Cf5-qTIGwGhuP7U-SxZEuJopsLEGxOYT/view?usp=sharing",
    },
    {
      id: 2,
      title: "Task 2: Style Buttons",
      description: "Create styled buttons with hover effects",
      image:
        "https://drive.google.com/file/d/12zyjhNiHYiL1TSnPTcKeeNnOxL7U9mww/view?usp=sharing",
    },
    {
      id: 3,
      title: "Task 3: Build a Card",
      description: "Design a product card with image and details",
      image: "https://drive.google.com/file/d/1KKzABX-lLcTpgYuygK-NSsXKxLOfLv4V/view?usp=sharing",
    },
    {
      id: 4,
      title: "Task 4: Create a Form",
      description: "Implement a contact form with validation",
      image: "https://drive.google.com/file/d/1VT8sk2TbS2XHZ7OuIkK_zFpPFV8bo1Wb/view?usp=sharing",
    },
    {
      id: 5,
      title: "Task 5: Final Layout",
      description: "Combine all elements into a complete layout",
      image: "https://drive.google.com/file/d/1vBs18p6U3vouAwKCcuLUcZ9DyMMIrlWx/view?usp=sharing",
    },
  ];

  useEffect(() => {
    const check = async () => {
      const qSnap = await getDocs(
        query(
          collection(dbInstance, "editorSubmissions"),
          where("user", "==", user)
        )
      );
      if (!qSnap.empty) setSubmitted(true);
    };
    check();
  }, [user]);

  useEffect(() => {
    // Update current code when task changes
    setHtmlCode(tasks[`task${activeTask}`]?.html || "");
    setCssCode(tasks[`task${activeTask}`]?.css || "");
  }, [activeTask, tasks]);

  const handleTaskChange = (taskNumber) => {
    // Save current code before switching tasks
    setTasks((prev) => ({
      ...prev,
      [`task${activeTask}`]: { html: htmlCode, css: cssCode },
    }));
    setActiveTask(taskNumber);
  };

  const submit = async () => {
    if (submitted) return;
    setIsSubmitting(true);
    try {
      // Combine all tasks before submission
      const finalSubmission = {
        user,
        tasks: {
          ...tasks,
          [`task${activeTask}`]: { html: htmlCode, css: cssCode }, // Save current task
        },
        timestamp: new Date(),
      };

      await addDoc(
        collection(dbInstance, "editorSubmissions"),
        finalSubmission
      );
      navigate("/dashboard", { state: { editorCompleted: true } });
    } finally {
      setIsSubmitting(false);
    }
  };

  const combinedCode = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>${cssCode}</style>
    </head>
    <body>${htmlCode}</body>
    </html>
  `;

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-50">
        <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-purple-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Submission Complete!
          </h2>
          <p className="text-gray-600 mb-6">
            Your code has been successfully submitted.
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Code Editor Challenge
          </h1>
          <p className="text-gray-600">
            Complete all 5 tasks to finish the challenge
          </p>
        </div>

        {/* Task Navigation */}
        <div className="flex justify-center gap-2 mb-8">
          {[1, 2, 3, 4, 5].map((taskNum) => (
            <button
              key={taskNum}
              onClick={() => handleTaskChange(taskNum)}
              className={`px-4 py-2 rounded-md font-medium ${
                activeTask === taskNum
                  ? "bg-purple-600 text-white"
                  : "bg-white text-purple-600 hover:bg-purple-50"
              }`}
            >
              Task {taskNum}
            </button>
          ))}
        </div>

        {/* Task Description */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              {taskDescriptions[activeTask - 1].title}
            </h2>
            <p className="text-gray-600 mb-4">
              {taskDescriptions[activeTask - 1].description}
            </p>
            <div className="bg-gray-100 p-4 rounded-lg">
              <img
                src={taskDescriptions[activeTask - 1].image}
                alt={`Task ${activeTask} Example`}
                className="max-w-full h-auto rounded border border-gray-200"
              />
            </div>
          </div>
        </div>

        {/* Editor Layout */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Editor Tabs */}
          <div className="flex border-b border-gray-200">
            <button className="px-6 py-3 font-medium text-gray-700 border-b-2 border-purple-500">
              HTML
            </button>
            <button className="px-6 py-3 font-medium text-gray-500 hover:text-gray-700">
              CSS
            </button>
          </div>

          {/* Code Areas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
            {/* HTML Editor */}
            <div className="h-full">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-700">
                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-md text-sm">
                    HTML
                  </span>
                </h3>
                <span className="text-xs text-gray-500">
                  {htmlCode.length} characters
                </span>
              </div>
              <textarea
                value={htmlCode}
                onChange={(e) => setHtmlCode(e.target.value)}
                placeholder="<!DOCTYPE html>..."
                className="w-full h-64 font-mono text-sm p-4 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                spellCheck="false"
              />
            </div>

            {/* CSS Editor */}
            <div className="h-full">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-700">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm">
                    CSS
                  </span>
                </h3>
                <span className="text-xs text-gray-500">
                  {cssCode.length} characters
                </span>
              </div>
              <textarea
                value={cssCode}
                onChange={(e) => setCssCode(e.target.value)}
                placeholder="body { ... }"
                className="w-full h-64 font-mono text-sm p-4 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                spellCheck="false"
              />
            </div>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="mt-8 bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h3 className="font-medium text-gray-700">Live Preview</h3>
          </div>
          <div className="p-4">
            <iframe
              title="Live Preview"
              srcDoc={combinedCode}
              sandbox="allow-same-origin"
              className="w-full h-96 border rounded-lg bg-white"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-8 text-center">
          <button
            onClick={submit}
            disabled={isSubmitting}
            className={`px-8 py-3 rounded-lg font-medium shadow-md transition-all ${
              isSubmitting
                ? "bg-purple-400 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 hover:shadow-lg"
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white inline-block mr-2"></div>
                Submitting...
              </>
            ) : (
              "Submit All Tasks"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
