// import { useState } from "react";
// import { db, auth } from "../firebase";
// import { collection, addDoc } from "firebase/firestore";
// import { useNavigate } from "react-router-dom";

// export default function Test() {
//   const [answer, setAnswer] = useState("");
//   const navigate = useNavigate();

//   const handleSubmit = async () => {
//     try {
//       await addDoc(collection(db, "testResults"), {
//         user: auth.currentUser.email,
//         answer,
//         timestamp: new Date()
//       });
//       alert("Test submitted successfully!");
//       navigate("/dashboard");
//     } catch (err) {
//       alert("Error submitting test: " + err.message);
//     }
//   };

//   return (
//     <div>
//       <h2>Simple Test</h2>
//       <p>What is 2 + 2?</p>
//       <input value={answer} onChange={(e) => setAnswer(e.target.value)} />
//       <button onClick={handleSubmit}>Submit Answer</button>
//     </div>
//   );
// }

import { useState } from "react";
import { dbInstance, authInstance } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const questionsList = [
  { id: 1, question: "What is 2 + 2?", correct: "4" },
  { id: 2, question: "What is the capital of France?", correct: "Paris" },
  {
    id: 3,
    question: "What color do you get by mixing red and blue?",
    correct: "Purple",
  },
];

export default function TestPage() {
  const [answers, setAnswers] = useState({});
  const navigate = useNavigate();

  const handleChange = (id, value) => {
    setAnswers({ ...answers, [id]: value });
  };

  const handleSubmit = async () => {
    try {
      await addDoc(collection(dbInstance, "testResults"), {
        user: authInstance.currentUser?.email,
        answers,
        timestamp: new Date(),
      });
      alert("Test submitted successfully!");
      navigate("/dashboard");
    } catch (err) {
      alert("Error submitting test: " + err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-r from-blue-400 to-purple-400">
      <div className="bg-white p-8 rounded shadow-lg w-full max-w-md">
        <h2 className="text-xl mb-4">Multi-Question Test</h2>
        {questionsList.map((q) => (
          <div key={q.id} className="mb-4">
            <p className="mb-1">{q.question}</p>
            <input
              className="border p-2 w-full"
              value={answers[q.id] || ""}
              onChange={(e) => handleChange(q.id, e.target.value)}
            />
          </div>
        ))}
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded w-full"
          onClick={handleSubmit}
        >
          Submit Test
        </button>
      </div>
    </div>
  );
}
