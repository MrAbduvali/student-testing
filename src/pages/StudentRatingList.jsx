import { useState, useEffect } from "react";
import { dbInstance } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import {
  FiUserPlus,
  FiFilter,
  FiAward,
  FiStar,
  FiCode,
  FiMic,
} from "react-icons/fi";
import { FaHtml5, FaCss3Alt } from "react-icons/fa";

export default function StudentRatingSystem() {
  const [students, setStudents] = useState([]);
  const [newStudent, setNewStudent] = useState({
    name: "",
    htmlScore: "",
    cssScore: "",
    editorScore: "",
    speakingScore: "",
  });
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([
    {
      id: "html",
      name: "HTML",
      active: true,
      icon: <FaHtml5 className="text-orange-500" />,
    },
    {
      id: "css",
      name: "CSS",
      active: true,
      icon: <FaCss3Alt className="text-blue-500" />,
    },
    {
      id: "editor",
      name: "Editor",
      active: true,
      icon: <FiCode className="text-purple-500" />,
    },
    {
      id: "speaking",
      name: "Speaking",
      active: true,
      icon: <FiMic className="text-green-500" />,
    },
  ]);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(dbInstance, "studentRatings"),
        orderBy("totalScore", "desc")
      );
      const querySnapshot = await getDocs(q);
      const studentsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStudents(studentsData);
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStudent((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleCategory = (id) => {
    setCategories(
      categories.map((cat) =>
        cat.id === id ? { ...cat, active: !cat.active } : cat
      )
    );
  };

  const calculateTotal = (student) => {
    return categories.reduce((total, category) => {
      return category.active
        ? total + (parseInt(student[`${category.id}Score`]) || 0)
        : total;
    }, 0);
  };

  const addStudent = async () => {
    if (!newStudent.name.trim()) return;

    const studentToAdd = {
      ...newStudent,
      htmlScore: parseInt(newStudent.htmlScore) || 0,
      cssScore: parseInt(newStudent.cssScore) || 0,
      editorScore: parseInt(newStudent.editorScore) || 0,
      speakingScore: parseInt(newStudent.speakingScore) || 0,
      totalScore: calculateTotal(newStudent),
      createdAt: new Date(),
    };

    try {
      await addDoc(collection(dbInstance, "studentRatings"), studentToAdd);
      setNewStudent({
        name: "",
        htmlScore: "",
        cssScore: "",
        editorScore: "",
        speakingScore: "",
      });
      fetchStudents();
    } catch (error) {
      console.error("Error adding student:", error);
    }
  };

  // Calculate width percentage based on category and score
  const calculateWidthPercentage = (categoryId, score) => {
    const maxScores = {
      html: 20,
      css: 20,
      editor: 40,
      speaking: 20,
    };
    const maxScore = maxScores[categoryId] || 100;
    return Math.min((score / maxScore) * 100, 100);
  };

  // Calculate total score percentage
  const calculateTotalPercentage = (student) => {
    const maxPossible = categories.reduce((total, category) => {
      const maxScores = {
        html: 20,
        css: 20,
        editor: 40,
        speaking: 20,
      };
      return category.active ? total + (maxScores[category.id] || 0) : total;
    }, 0);

    const actualScore = calculateTotal(student);
    return (actualScore / maxPossible) * 100;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Student Performance Dashboard
            </h1>
            <p className="text-gray-600">
              Track and compare student scores across different assessments
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm">
            <FiAward className="text-yellow-500" />
            <span className="font-medium">
              {students.length} Students Ranked
            </span>
          </div>
        </div>

        {/* Category Filters */}
        <div className="mb-8 p-6 bg-white rounded-xl shadow-sm">
          <div className="flex items-center mb-4">
            <FiFilter className="text-gray-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-700">
              Filter Categories
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => toggleCategory(category.id)}
                className={`flex items-center px-4 py-2 rounded-full transition-all ${
                  category.active
                    ? "bg-blue-100 text-blue-700 shadow-inner"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Add New Student Form */}
        <div className="mb-8 p-6 bg-white rounded-xl shadow-sm">
          <div className="flex items-center mb-4">
            <FiUserPlus className="text-gray-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-700">
              Add New Student
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Student Name
              </label>
              <input
                type="text"
                name="name"
                value={newStudent.name}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter student name"
              />
            </div>
            {categories.map((category) => (
              <div key={category.id}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {category.name} Score
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name={`${category.id}Score`}
                    value={newStudent[`${category.id}Score`]}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                    max="100"
                  />
                  <span className="absolute right-3 top-3 text-gray-400">
                    %
                  </span>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={addStudent}
            className="mt-4 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center"
          >
            <FiUserPlus className="mr-2" />
            Add Student Record
          </button>
        </div>

        {/* Students Rating Table */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rank
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    {categories.map(
                      (category) =>
                        category.active && (
                          <th
                            key={category.id}
                            className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            <div className="flex items-center">
                              <span className="mr-2">{category.icon}</span>
                              {category.name}
                            </div>
                          </th>
                        )
                    )}
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center">
                        <FiStar className="text-yellow-500 mr-2" />
                        Total
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {students.map((student, index) => {
                    const totalScore = calculateTotal(student);
                    const totalPercentage = calculateTotalPercentage(student);
                    return (
                      <tr
                        key={student.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div
                            className={`flex items-center justify-center w-8 h-8 rounded-full ${
                              index === 0
                                ? "bg-yellow-100 text-yellow-800"
                                : index === 1
                                ? "bg-gray-100 text-gray-800"
                                : index === 2
                                ? "bg-amber-100 text-amber-800"
                                : "bg-blue-50 text-blue-800"
                            }`}
                          >
                            {index + 1}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                              {student.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {student.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        {categories.map(
                          (category) =>
                            category.active && (
                              <td
                                key={category.id}
                                className="px-6 py-4 whitespace-nowrap"
                              >
                                <div className="flex items-center">
                                  <div className="w-full bg-gray-200 rounded-full h-2.5 mr-3">
                                    <div
                                      className={`h-2.5 rounded-full ${
                                        student[`${category.id}Score`] >=
                                        (category.id === "editor" ? 28 : 14)
                                          ? "bg-green-500"
                                          : student[`${category.id}Score`] >=
                                            (category.id === "editor" ? 16 : 8)
                                          ? "bg-yellow-500"
                                          : "bg-red-500"
                                      }`}
                                      style={{
                                        width: `${calculateWidthPercentage(
                                          category.id,
                                          student[`${category.id}Score`] || 0
                                        )}%`,
                                      }}
                                    ></div>
                                  </div>
                                  <span className="text-sm font-medium">
                                    {student[`${category.id}Score`]}
                                  </span>
                                </div>
                              </td>
                            )
                        )}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mr-3">
                              <div
                                className={`h-2.5 rounded-full ${
                                  totalPercentage >= 70
                                    ? "bg-green-500"
                                    : totalPercentage >= 40
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                                }`}
                                style={{
                                  width: `${totalPercentage}%`,
                                }}
                              ></div>
                            </div>
                            <span className="text-sm font-semibold">
                              {totalScore}
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
