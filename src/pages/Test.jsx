import { useState, useEffect } from "react";
import { dbInstance, authInstance } from "../firebase";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function TestPage() {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();
  const user = authInstance.currentUser?.email || "unknown";

  useEffect(() => {
    const checkSubmitted = async () => {
      const q = query(collection(dbInstance, "testResults"), where("user", "==", user));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        setSubmitted(true);
      }
    };
    checkSubmitted();
  }, [user]);

  const handleChange = (qid, value) => {
    setAnswers(prev => ({ ...prev, [qid]: value }));
  };

  const handleSubmit = async () => {
    if (submitted) return;
    await addDoc(collection(dbInstance, "testResults"), {
      user,
      answers,
      timestamp: new Date()
    });
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-r from-purple-500 to-green-500">
      <div className="bg-white p-6 rounded shadow-lg max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Test</h2>
        {submitted ? (
          <p className="text-green-500">You have already submitted the test.</p>
        ) : (
          <>
            <div className="mb-4">
              <p><strong>1. What is HTML?</strong></p>
              <input type="text" className="border w-full p-2" onChange={(e) => handleChange(1, e.target.value)} />
            </div>
            <div className="mb-4">
              <p><strong>2. What is CSS?</strong></p>
              <input type="text" className="border w-full p-2" onChange={(e) => handleChange(2, e.target.value)} />
            </div>
            <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleSubmit}>Submit</button>
          </>
        )}
      </div>
    </div>
  );
}
