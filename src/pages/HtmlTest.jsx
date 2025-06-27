import { useState, useEffect } from "react";
import { dbInstance, authInstance } from "../firebase";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { htmlQuestions } from "./HtmlQuestions";
import { useNavigate } from "react-router-dom";

export default function HtmlTest() {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const user = authInstance.currentUser?.email || "unknown";

  useEffect(() => {
    const check = async () => {
      const qSnap = await getDocs(query(collection(dbInstance, "htmlTestResults"), where("user", "==", user)));
      if (!qSnap.empty) setSubmitted(true);
    };
    check();
  }, [user]);

  const submit = async () => {
    setIsSubmitting(true);
    try {
      await addDoc(collection(dbInstance, "htmlTestResults"), { 
        user, 
        answers, 
        timestamp: new Date(),
        score: calculateScore()
      });
      navigate("/dashboard", { state: { testCompleted: true } });
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    htmlQuestions.forEach(q => {
      if (answers[q.id] && q.correctAnswer === answers[q.id]) correct++;
    });
    return correct;
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Test Submitted!</h2>
          <p className="text-gray-600 mb-6">Your HTML knowledge test has been completed.</p>
          <button 
            onClick={() => navigate("/dashboard")}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">HTML Knowledge Test</h1>
              <p className="opacity-90">{htmlQuestions.length} questions</p>
            </div>
            <div className="bg-white/20 px-3 py-1 rounded-full text-sm">
              Time: 15:00
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="p-6">
          {htmlQuestions.map((q, index) => (
            <div 
              key={q.id}
              className="mb-8 last:mb-0 transition-opacity duration-200"
            >
              <div className="flex items-start mb-3">
                <span className="bg-blue-100 text-blue-800 font-medium rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                  {index + 1}
                </span>
                <h3 className="text-lg font-medium text-gray-800">{q.question}</h3>
              </div>
              
              {q.type === "select" ? (
                <select
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                  value={answers[q.id] || ""}
                >
                  <option value="">Select an option</option>
                  {q.options.map((opt, i) => (
                    <option key={i} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : (
                <input
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                  value={answers[q.id] || ""}
                  placeholder="Type your answer here..."
                />
              )}
            </div>
          ))}

          {/* Submit Button */}
          <div className="mt-10">
            <button
              onClick={submit}
              disabled={isSubmitting || Object.keys(answers).length < htmlQuestions.length}
              className={`w-full py-3 px-4 rounded-lg font-medium shadow-md transition-all flex items-center justify-center ${
                isSubmitting 
                  ? "bg-blue-400 cursor-not-allowed" 
                  : Object.keys(answers).length < htmlQuestions.length 
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                    : "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 hover:shadow-lg"
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : "Submit Test"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}