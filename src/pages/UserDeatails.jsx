import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { dbInstance } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

export default function UserDetailsPage() {
  const { id } = useParams();
  const [userResult, setUserResult] = useState(null);

  useEffect(() => {
    const fetchResult = async () => {
      const ref = doc(dbInstance, "testResults", id);
      const snapshot = await getDoc(ref);
      if (snapshot.exists()) {
        setUserResult(snapshot.data());
      }
    };

    fetchResult();
  }, [id]);

  return (
    <div className="min-h-screen p-6 bg-gradient-to-r from-purple-500 to-green-500">
      <div className="bg-white p-6 rounded shadow-lg max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">User Test Details</h2>
        {userResult ? (
          <div>
            <p>
              <strong>User:</strong> {userResult.user}
            </p>
            <p>
              <strong>Submitted:</strong>{" "}
              {userResult.timestamp?.toDate?.().toString?.() || ""}
            </p>
            <h3 className="font-semibold mt-4 mb-2">Answers:</h3>
            {userResult.answers ? (
              Object.entries(userResult.answers).map(([qid, ans]) => (
                <p key={qid}>
                  <strong>Q{qid}:</strong> {ans}
                </p>
              ))
            ) : (
              <p>No answers submitted.</p>
            )}
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}
