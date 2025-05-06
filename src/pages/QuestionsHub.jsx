import React, { useEffect } from 'react';
import Alert from '../components/Alert';
import { getAllUserQuestions, verifyUserQuestion, deleteUserQuestion } from '../services/userQuestionServices';

export default function QuestionsHub() {
  const [questions, setQuestions] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    const fetchUserQuestions = async () => {
      try {
        const response = await getAllUserQuestions();
        setQuestions(response.additional); // Assuming response.additional contains the array of questions
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user questions:", error);
        setLoading(false);
      }
    };
    fetchUserQuestions();
  }, []);

  const handleVerify = async (questionsId) => {
    try {
      await verifyUserQuestion(questionsId);
    
    } catch (error) {
      console.error("Error verifying question:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteUserQuestion(id);
      setQuestions((prevQuestions) => prevQuestions.filter((q) => q.id !== id));
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };

  return (
    <div className="bg-white dark:bg-darkColor text-black dark:text-white min-h-screen py-10 px-6 sm:pl-72">
      <Alert />
      {/* Header */}
      <header className="flex justify-between items-center mb-8 border-b pb-4 border-darkColor/20">
        <h1 className="text-3xl font-bold">Questions Hub</h1>
      </header>

      {/* Questions List */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <div className="col-span-full text-center text-lg">Loading questions...</div>
        ) : questions.length === 0 ? (
          <div className="col-span-full text-center text-lg">No questions found.</div>
        ) : (
          questions.map((question) => (
            <div
              key={question.id}
              className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold mb-2">{question.question}</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                <span className="font-medium">Answer: </span>
                {question.answer || 'No answer yet'}
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                <span className="font-medium">Asked by: </span>
                {question.studentName || 'Unknown'}
              </p>
              <div className="flex gap-2 mb-2">
                <span
                  className={`px-2 py-1 rounded text-sm ${
                    question.isAnswered
                      ? 'bg-green-200 text-green-800'
                      : 'bg-yellow-200 text-yellow-800'
                  }`}
                >
                  {question.isAnswered ? 'Answered' : 'Unanswered'}
                </span>
                <span
                  className={`px-2 py-1 rounded text-sm ${
                    question.isVerified
                      ? 'bg-blue-200 text-blue-800'
                      : 'bg-red-200 text-red-800'
                  }`}
                >
                  {question.isVerified ? 'Verified' : 'Not Verified'}
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                <span className="font-medium">Created: </span>
                {new Date(question.createdAt).toLocaleDateString()}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleVerify(question.id)}
                  className={`px-4 py-2 rounded text-sm font-medium ${
                    question.isVerified
                      ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  {question.isVerified ? 'Unverify' : 'Verify'}
                </button>
                <button
                  onClick={() => handleDelete(question.id)}
                  className="px-4 py-2 rounded text-sm font-medium bg-red-500 text-white hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}