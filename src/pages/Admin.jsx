import { useEffect, useState } from "react";
import { dbInstance } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

// Savollar ro'yxati admin panelda ham kerak
const questionsList = [
  { id: 1, question: "What is 2 + 2?" },
  { id: 2, question: "What is the capital of France?" },
  { id: 3, question: "What color do you get by mixing red and blue?" }
];

export default function AdminPage() {
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      const snapshot = await getDocs(collection(dbInstance, "testResults"));
      setResults(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    fetchResults();
  }, []);

  const getQuestionText = (id) => {
    const found = questionsList.find(q => q.id.toString() === id.toString());
    return found ? found.question : `Question ${id}`;
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-r from-purple-500 to-green-500">
      <div className="bg-white p-8 rounded shadow-lg max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Admin Panel - Test Results</h2>
        {results.length === 0 ? (
          <p>No results submitted yet.</p>
        ) : (
          results.map((res) => (
            <div key={res.id} className="border p-4 mb-4 rounded">
              <p><strong>User:</strong> {res.user}</p>
              <p><strong>Submitted:</strong> {res.timestamp?.toDate?.().toString?.() || ""}</p>
              <div className="mt-2">
                {res.answers ? (
                  Object.entries(res.answers).map(([qid, ans]) => (
                    <div key={qid} className="mb-1">
                      <p><strong>{getQuestionText(qid)}</strong></p>
                      <p>Answer: {ans}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-red-500">No answers submitted.</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
