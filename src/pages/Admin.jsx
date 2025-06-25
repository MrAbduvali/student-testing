// student-test-app/src/pages/Admin.js
import { useEffect, useState } from "react";
import { dbInstance } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

export default function AdminPage() {
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      const snapshot = await getDocs(collection(dbInstance, "testResults"));
      setResults(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    fetchResults();
  }, []);

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
                    <p key={qid}><strong>Q{qid}:</strong> {ans}</p>
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
