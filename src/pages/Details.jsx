import { useEffect, useState } from "react";
import { dbInstance } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";
import {
  CheckCircleIcon,
  XCircleIcon,
  ChevronLeftIcon,
} from "@heroicons/react/24/outline";

// Define correct answers for CSS test
const correctAnswersData = {
  q1: "Hyper Text Markup Language",
  q2: "<a>",
  q3: "<img>",
  q4: "<br>",
  q5: "<b>",
  q6: "<ol>",
  q7: "<h1>",
  q8: '<body style="background-color: yellow;">',
  q9: "<tr>",
  q10: "<head> ichida",
  q11: "alt",
  q12: "<br>",
  q13: "<hr>",
  q14: 'target="_blank"',
  q15: "<!-- va --> bilan",
  q16: "Foydalanuvchi ma'lumotlarini kiritish shakli yaratish uchun",
  q17: "<li>",
  q18: "Ikkalasi ham (<i> va <em>)",
  q19: "<main>",
  q20: "<html><head><title>Sarlavha</title></head><body>Kontent</body></html>",
};

export default function Details() {
  const { id } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResult = async () => {
      try {
        setLoading(true);
        const docRef = doc(dbInstance, "htmlTestResults", id);
        const snapshot = await getDoc(docRef);

        if (!snapshot.exists()) {
          throw new Error("Result not found");
        }

        setResult({
          id: snapshot.id,
          ...snapshot.data(),
        });
      } catch (err) {
        console.error("Error fetching result:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [id]);

  // Function to check if answer is correct
  const isAnswerCorrect = (questionId, userAnswer) => {
    const correctAnswer = correctAnswersData[questionId];
    if (!correctAnswer) return null;

    // Normalize answers for comparison
    const normalizedUserAnswer = userAnswer.trim().toLowerCase();
    const normalizedCorrectAnswer = correctAnswer.trim().toLowerCase();

    return normalizedUserAnswer === normalizedCorrectAnswer;
  };

  // Calculate score based on correct answers
  const calculateScore = () => {
    if (!result?.answers) return result?.score || 0;

    const totalQuestions = Object.keys(correctAnswersData).length;
    let correctCount = 0;

    Object.entries(result.answers).forEach(([qId, answer]) => {
      if (isAnswerCorrect(qId, answer)) {
        correctCount++;
      }
    });

    return Math.round((correctCount / totalQuestions) * 100);
  };

  const scorePercentage = calculateScore();
  const scoreColor =
    scorePercentage >= 70 ? "green" : scorePercentage >= 40 ? "yellow" : "red";

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md text-center">
          <XCircleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Error Loading Result
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 flex items-center justify-center mx-auto"
          >
            <ChevronLeftIcon className="h-5 w-5 mr-1" />
            Back to Results
          </button>
        </div>
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-purple-600 hover:text-purple-800"
          >
            <ChevronLeftIcon className="h-5 w-5 mr-1" />
            Back to Results
          </button>
        </div>

        <div className="bg-white shadow overflow-hidden rounded-lg">
          {/* Header Section */}
          <div className="px-6 py-5 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">
              HTML Test Result Details
            </h2>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
              ID: {id}
            </span>
          </div>

          {/* User and Score Info */}
          <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-gray-500">User</h3>
              <p className="text-lg font-semibold text-gray-900">
                {result.user || "Anonymous"}
              </p>
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-medium text-gray-500">Submitted</h3>
              <p className="text-lg text-gray-900">
                {new Date(
                  result.timestamp?.toDate?.() || Date.now()
                ).toLocaleString()}
              </p>
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-medium text-gray-500">Score</h3>
              <div className="flex items-center">
                <div className="w-full bg-gray-200 rounded-full h-2.5 mr-3">
                  <div
                    className={`h-2.5 rounded-full ${
                      scoreColor === "green"
                        ? "bg-green-500"
                        : scoreColor === "yellow"
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                    style={{ width: `${scorePercentage}%` }}
                  ></div>
                </div>
                <span className="text-lg font-semibold">
                  {scorePercentage}%
                </span>
              </div>
            </div>
          </div>

          {/* Answers Section */}
          <div className="border-t border-gray-200 px-6 py-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Question Answers
            </h3>

            {result.answers ? (
              <div className="space-y-4">
                {Object.entries(result.answers).map(([questionId, answer]) => {
                  const isCorrect = isAnswerCorrect(questionId, answer);

                  return (
                    <div
                      key={questionId}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-gray-900">
                          Question {questionId}
                        </h4>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            isCorrect
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {isCorrect ? (
                            <>
                              <CheckCircleIcon className="h-3 w-3 mr-1" />
                              Correct
                            </>
                          ) : (
                            <>
                              <XCircleIcon className="h-3 w-3 mr-1" />
                              Incorrect
                            </>
                          )}
                        </span>
                      </div>
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="text-sm font-medium text-gray-500 mb-2">
                            User's Answer:
                          </h5>
                          <div className="bg-gray-50 p-3 rounded-md">
                            <code className="text-sm text-gray-800 break-all">
                              {answer}
                            </code>
                          </div>
                        </div>
                        {!isCorrect && (
                          <div>
                            <h5 className="text-sm font-medium text-gray-500 mb-2">
                              Correct Answer:
                            </h5>
                            <div className="bg-green-50 p-3 rounded-md">
                              <code className="text-sm text-green-800 break-all">
                                {correctAnswersData[questionId]}
                              </code>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No answers found for this test.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
