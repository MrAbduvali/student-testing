import { useEffect, useState } from "react";
import { dbInstance } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";
import { CheckCircleIcon, XCircleIcon, ChevronLeftIcon, ClipboardDocumentIcon } from "@heroicons/react/24/outline";

export default function CssDetails() {
  const { id } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [correctAnswers, setCorrectAnswers] = useState({});
  const [totalScore, setTotalScore] = useState(0);
  const navigate = useNavigate();

  // Sample correct answers (replace with your actual correct answers)
  const correctAnswersData = {
    "q1": "font-size",
  "q2": "font-style",
  "q3": "margin",
  "q4": "padding",
  "q5": "margin",
  "q6": "background-color",
  "q7": "background-image",
  "q8": "border",
  "q9": "outline",
  "q10": "element:hover",
  "q11": "box-shadow",
  "q12": "text-shadow",
  "q13": "opacity",
  "q14": "display: flex;",
  "q15": "flex-direction",
  "q16": "justify-content: center;",
  "q17": "flex-wrap: wrap;",
  "q18": "text-transform: uppercase;",
  "q19": "display: none;",
  "q20": "justify-content: center; align-items: center;"
  };

  useEffect(() => {
    const fetchResult = async () => {
      try {
        setLoading(true);
        const docRef = doc(dbInstance, "cssTestResults", id);
        const snapshot = await getDoc(docRef);
        
        if (!snapshot.exists()) {
          throw new Error("Natija topilmadi");
        }
        
        const data = {
          id: snapshot.id,
          ...snapshot.data()
        };
        
        setResult(data);
        
        // Automatically check answers
        if (data.answers) {
          const checkedAnswers = {};
          let score = 0;
          
          Object.entries(data.answers).forEach(([q, ans]) => {
            const isCorrect = correctAnswersData[q]?.trim().toLowerCase() === ans?.trim().toLowerCase();
            checkedAnswers[q] = isCorrect;
            if (isCorrect) score++;
          });
          
          setCorrectAnswers(checkedAnswers);
          setTotalScore(score);
        }
      } catch (err) {
        console.error("Xatolik yuz berdi:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [id]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md text-center">
          <XCircleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Xatolik yuz berdi</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center justify-center mx-auto"
          >
            <ChevronLeftIcon className="h-5 w-5 mr-1" />
            Orqaga qaytish
          </button>
        </div>
      </div>
    );
  }

  if (!result) return null;

  const totalQuestions = Object.keys(correctAnswersData).length;
  const scorePercentage = Math.round((totalScore / totalQuestions) * 100);
  const scoreColor = scorePercentage >= 70 ? 'green' : scorePercentage >= 40 ? 'yellow' : 'red';

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <ChevronLeftIcon className="h-5 w-5 mr-1" />
            Orqaga qaytish
          </button>
        </div>

        <div className="bg-white shadow overflow-hidden rounded-lg">
          {/* Header Section */}
          <div className="px-6 py-5 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">CSS Test Natijalari</h2>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              ID: {id}
            </span>
          </div>

          {/* User and Score Info */}
          <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-gray-500">Foydalanuvchi</h3>
              <p className="text-lg font-semibold text-gray-900">{result.user || "Anonim"}</p>
            </div>
            
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-gray-500">Topshirilgan sana</h3>
              <p className="text-lg text-gray-900">
                {new Date(result.timestamp?.toDate?.() || Date.now()).toLocaleString()}
              </p>
            </div>
            
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-gray-500">Natija</h3>
              <div className="flex items-center">
                <div className="w-full bg-gray-200 rounded-full h-2.5 mr-3">
                  <div 
                    className={`h-2.5 rounded-full ${
                      scoreColor === 'green' ? 'bg-green-500' : 
                      scoreColor === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${scorePercentage}%` }}
                  ></div>
                </div>
                <span className="text-lg font-semibold">
                  {totalScore}/{totalQuestions} ({scorePercentage}%)
                </span>
              </div>
            </div>
          </div>

          {/* Answers Section */}
          <div className="border-t border-gray-200 px-6 py-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Savol javoblari</h3>
            
            {result.answers ? (
              <div className="space-y-4">
                {Object.entries(result.answers).map(([questionId, answer]) => (
                  <div key={questionId} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900">Savol {questionId}</h4>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        correctAnswers[questionId] ? 
                          'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {correctAnswers[questionId] ? (
                          <>
                            <CheckCircleIcon className="h-3 w-3 mr-1" />
                            To'g'ri
                          </>
                        ) : (
                          <>
                            <XCircleIcon className="h-3 w-3 mr-1" />
                            Noto'g'ri
                          </>
                        )}
                      </span>
                    </div>
                    
                    <div className="mt-2 space-y-3">
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Foydalanuvchi javobi:</p>
                        <div className="bg-gray-50 p-3 rounded-md relative">
                          <code className="text-sm text-gray-800 break-all">{answer}</code>
                          <button 
                            onClick={() => copyToClipboard(answer)}
                            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                            title="Copy to clipboard"
                          >
                            <ClipboardDocumentIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      
                      {!correctAnswers[questionId] && (
                        <div>
                          <p className="text-sm font-medium text-gray-500 mb-1">To'g'ri javob:</p>
                          <div className="bg-green-50 p-3 rounded-md relative">
                            <code className="text-sm text-green-800 break-all">
                              {correctAnswersData[questionId]}
                            </code>
                            <button 
                              onClick={() => copyToClipboard(correctAnswersData[questionId])}
                              className="absolute top-2 right-2 text-green-400 hover:text-green-600"
                              title="Copy to clipboard"
                            >
                              <ClipboardDocumentIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Test javoblari topilmadi</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}