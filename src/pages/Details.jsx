import { useEffect, useState } from "react";
import { dbInstance } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";

export default function Details() {
  const { id } = useParams();
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getDoc(doc(dbInstance, "testResults", id)).then(snapshot => {
      setResult(snapshot.data());
    });
  }, [id]);

  if (!result) return <div className="p-6">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-6">
        <h2 className="text-2xl font-bold mb-4">HTML Test Result</h2>
        <p><strong>User:</strong> {result.user}</p>
        <p><strong>Submitted:</strong> {new Date(result.timestamp?.toDate?.() || Date.now()).toLocaleString()}</p>
        <p><strong>Score:</strong> {result.score}</p>

        <div className="mt-4">
          <h3 className="font-medium mb-2">Answers:</h3>
          {result.answers ? (
            Object.entries(result.answers).map(([q, ans]) => (
              <p key={q}><strong>Q{q}:</strong> {ans}</p>
            ))
          ) : (
            <p>No answers found.</p>
          )}
        </div>

        <button
          onClick={() => navigate(-1)}
          className="mt-6 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          Back
        </button>
      </div>
    </div>
  );
}
