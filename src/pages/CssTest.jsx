import { useState, useEffect } from "react";
import { dbInstance, authInstance } from "../firebase";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { cssQuestions } from "./CssQuestions";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function CssTest() {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const user = authInstance.currentUser?.email || "unknown";

  useEffect(() => {
    const verifyAccess = async () => {
      if (!user) return;
      const qSnap = await getDocs(
        query(
          collection(dbInstance, "cssTestResults"),
          where("user", "==", user)
        )
      );
      if (!qSnap.empty) setSubmitted(true);
    };
    verifyAccess();
  }, [user]);

  const submit = async () => {
    setIsSubmitting(true);
    try {
      await addDoc(collection(dbInstance, "cssTestResults"), {
        user,
        answers,
        timestamp: new Date(),
        score: calculateScore(),
      });
      navigate("/dashboard", { state: { testCompleted: true } });
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    cssQuestions.forEach((q) => {
      if (answers[q.id] && q.correctAnswer === answers[q.id]) correct++;
    });
    return correct;
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-green-500"
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
            Test Submitted!
          </h2>
          <p className="text-gray-600 mb-6">
            Your CSS knowledge test has been completed.
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">CSS Knowledge Test</h1>
              <p className="opacity-90">{cssQuestions.length} questions</p>
            </div>
            <div className="bg-white/20 px-3 py-1 rounded-full text-sm">
              Time: 15:00
            </div>
          </div>
        </div>

        <div className="p-6">
          {cssQuestions.map((q, index) => (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="mb-8 last:mb-0"
            >
              <div className="flex items-start mb-3">
                <span className="bg-green-100 text-green-800 font-medium rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                  {index + 1}
                </span>
                <h3 className="text-lg font-medium text-gray-800">
                  {q.question}
                </h3>
              </div>

              {q.type === "select" ? (
                <select
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  onChange={(e) =>
                    setAnswers({ ...answers, [q.id]: e.target.value })
                  }
                  value={answers[q.id] || ""}
                >
                  <option value="">Select an option</option>
                  {q.options.map((opt, i) => (
                    <option key={i} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  onChange={(e) =>
                    setAnswers({ ...answers, [q.id]: e.target.value })
                  }
                  value={answers[q.id] || ""}
                  placeholder="Type your answer here..."
                />
              )}
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: cssQuestions.length * 0.05 + 0.1 }}
            className="mt-10"
          >
            <button
              onClick={submit}
              disabled={
                isSubmitting ||
                Object.keys(answers).length < cssQuestions.length
              }
              className={`w-full py-3 px-4 rounded-lg font-medium shadow-md transition-all flex items-center justify-center ${
                isSubmitting
                  ? "bg-green-400 cursor-not-allowed"
                  : Object.keys(answers).length < cssQuestions.length
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 hover:shadow-lg"
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                "Submit Test"
              )}
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
