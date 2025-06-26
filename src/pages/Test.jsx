import { useState } from "react";
import { dbInstance, authInstance } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const questionsList = [
  {
    id: 1,
    question: "HTML nimani anglatadi?",
    options: ["Hyperlinks and Text Markup Language", "Hyper Text Markup Language", "Home Tool Markup Language", "Hyperlink Text Management Language"],
    correct: "Hyper Text Markup Language"
  },
  {
    id: 2,
    question: "Havola (ssilka) yaratish uchun qaysi teg ishlatiladi?",
    options: ["<link>", "<href>", "<a>", "<hyperlink>"],
    correct: "<a>"
  },
  {
    id: 3,
    question: "Rasm chiqarish uchun qaysi HTML tegi ishlatiladi?",
    options: ["<img>", "<image>", "<src>", "<pic>"],
    correct: "<img>"
  },
  {
    id: 4,
    question: "HTML hujjatida yangi qatorga o‘tish uchun qaysi teg ishlatiladi?",
    options: ["<break>", "<lb>", "<br>", "<newline>"],
    correct: "<br>"
  },
  {
    id: 5,
    question: "Matnni qalin qilish uchun qaysi teg ishlatiladi?",
    options: ["<i>", "<em>", "<strong>", "<b>"],
    correct: "<b>"
  },
  {
    id: 6,
    question: "Raqamlangan ro‘yxat yaratish uchun qaysi teg ishlatiladi?",
    options: ["<ol>", "<ul>", "<li>", "<dl>"],
    correct: "<ol>"
  },
  {
    id: 7,
    question: "Eng katta sarlavha qaysi teg bilan belgilanadi?",
    options: ["<heading>", "<h6>", "<h1>", "<head>"],
    correct: "<h1>"
  },
  {
    id: 8,
    question: "HTML da orqa fon rangini to‘g‘ri qo‘shish usuli qaysi?",
    options: ["<body color=\"yellow\">", "<background color=\"yellow\">", "<body style=\"background-color: yellow;\">", "<bg color=\"yellow\">"],
    correct: "<body style=\"background-color: yellow;\">"
  },
  {
    id: 9,
    question: "Jadval satrini yaratish uchun qaysi teg ishlatiladi?",
    options: ["<tr>", "<td>", "<th>", "<table>"],
    correct: "<tr>"
  },
  {
    id: 10,
    question: "<title> tegi qayerda joylashadi?",
    options: ["<body> ichida", "<footer> ichida", "<head> ichida", "<header> ichida"],
    correct: "<head> ichida"
  },
  {
    id: 11,
    question: "Rasm uchun muqobil matn qaysi atribut orqali belgilanadi?",
    options: ["title", "alt", "src", "href"],
    correct: "alt"
  },
  {
    id: 12,
    question: "Quyidagilardan qaysi biri o‘z-o‘zini yopuvchi teg hisoblanadi?",
    options: ["<div>", "<span>", "<br>", "<p>"],
    correct: "<br>"
  },
  {
    id: 13,
    question: "Gorizontal chiziq chizish uchun qaysi teg ishlatiladi?",
    options: ["<hr>", "<line>", "<hline>", "<hl>"],
    correct: "<hr>"
  },
  {
    id: 14,
    question: "Havolani yangi oynada ochish uchun qaysi atribut ishlatiladi?",
    options: ["open=\"new\"", "target=\"_blank\"", "newtab=\"yes\"", "target=\"new\""],
    correct: "target=\"_blank\""
  },
  {
    id: 15,
    question: "HTML izoh qanday yoziladi?",
    options: ["<!-- va --> bilan", "// bilan", "/* va */ bilan", "** bilan"],
    correct: "<!-- va --> bilan"
  },
  {
    id: 16,
    question: "<form> tegi nima uchun ishlatiladi?",
    options: ["Sarlavhalarni joylash uchun", "Multimedia qo‘shish uchun", "Foydalanuvchi ma'lumotlarini kiritish shakli yaratish uchun", "Jadval yaratish uchun"],
    correct: "Foydalanuvchi ma'lumotlarini kiritish shakli yaratish uchun"
  },
  {
    id: 17,
    question: "Ro‘yxat elementi uchun qaysi teg ishlatiladi?",
    options: ["<list>", "<li>", "<ul>", "<item>"],
    correct: "<li>"
  },
  {
    id: 18,
    question: "Kursiv yoki urg‘uli matn yaratish uchun qaysi teg ishlatiladi?",
    options: ["<i>", "<em>", "<b>", "Ikkalasi ham (<i> va <em>)"],
    correct: "Ikkalasi ham (<i> va <em>)"
  },
  {
    id: 19,
    question: "HTML hujjatining asosiy qismi qaysi teg orqali belgilanadi?",
    options: ["<section>", "<main>", "<body>", "<content>"],
    correct: "<main>"
  },
  {
    id: 20,
    question: "Quyidagilardan to‘g‘ri HTML tuzilmasini tanlang:",
    options: [
      "<html><head><title>Sarlavha</title><body>Kontent</body></head></html>",
      "<html><title>Sarlavha</title><head><body>Kontent</body></head></html>",
      "<html><head><title>Sarlavha</title></head><body>Kontent</body></html>",
      "<html><body>Kontent<title>Sarlavha</title></body></html>"
    ],
    correct: "<html><head><title>Sarlavha</title></head><body>Kontent</body></html>"
  }
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
        timestamp: new Date()
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
            <p className="mb-1 font-semibold">{q.question}</p>
            {q.options.map((opt) => (
              <label key={opt} className="block">
                <input
                  type="radio"
                  name={`question-${q.id}`}
                  value={opt}
                  checked={answers[q.id] === opt}
                  onChange={(e) => handleChange(q.id, e.target.value)}
                  className="mr-2"
                />
                {opt}
              </label>
            ))}
          </div>
        ))}
        <button className="bg-blue-500 text-white px-4 py-2 rounded w-full" onClick={handleSubmit}>Submit Test</button>
      </div>
    </div>
  );
}
