import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  
  const testCards = [
    { title: "HTML Test", color: "bg-blue-500", path: "/html" },
    { title: "CSS Test", color: "bg-green-500", path: "/css" },
    { title: "Html Code Editor", color: "bg-purple-500", path: "/htmleditor" },
    { title: "Css Code Editor", color: "bg-purple-500", path: "/csseditor" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Welcome to Your Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testCards.map((card, index) => (
            <div 
              key={index}
              onClick={() => navigate(card.path)}
              className={`${card.color} text-white rounded-xl p-6 shadow-lg cursor-pointer transform hover:-translate-y-1 transition-all duration-300 hover:shadow-xl`}
            >
              <h2 className="text-xl font-semibold mb-2">{card.title}</h2>
              <p className="opacity-90">Click to start</p>
              <div className="mt-4 text-right">
                <span className="inline-block bg-white bg-opacity-20 rounded-full p-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}