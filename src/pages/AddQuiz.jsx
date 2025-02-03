import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation,useParams ,useNavigate} from "react-router-dom";
import {useNavigateToBack} from '../utils/navigateUtils'


export default function AddQuiz() {
  const [questionText, setQuestionText] = useState("");
  const [answers, setAnswers] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [questionToEditId, setQuestionToEditId] = useState(null);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const courseId = queryParams.get('courseId');
  const {topicId} =useParams()
const navigate = useNavigate();
const redirectToBack = useNavigateToBack()

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await axios.get(`/api/v1/quiz/getquiz/${topicId}`);
        const quizData = response.data.quizzes[0];
        setQuestions(quizData?.questions || []);
      } catch (error) {
        console.error("Error fetching quiz data:", error);
      }
    };
    fetchQuiz();
  }, [topicId]);

  const handleQuestionChange = (e) => setQuestionText(e.target.value);

  const handleAnswerChange = (index, field, value) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index][field] = value;
    setAnswers(updatedAnswers);
  };

  const handleAddAnswer = () => setAnswers([...answers, { text: "", isCorrect: false }]);

  const handleRemoveAnswer = (index) => setAnswers(answers.filter((_, i) => i !== index));

  const handleUpdateQuestion = async (questionId) => {
    try {
      await axios.put(`/api/v1/quiz/updateQuestion/${questionId}`, {
        text: questionText,
        answers,
      });
      alert("Quiz question updated successfully!");
      const updatedQuestions = questions.map((q) =>
        q.id === questionId ? { ...q, text: questionText, answers } : q
      );
      setQuestions(updatedQuestions);
      resetForm();
    } catch (error) {
      console.error("Error updating quiz:", error);
      alert("Failed to update quiz question.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editMode && questionToEditId) {
      await handleUpdateQuestion(questionToEditId);
    } else {
      try {
        const response = await axios.post(`/api/v1/quiz/addquiz/${topicId}`, {
          text: questionText,
          answers,
          courseId
        });
        const newQuestion = response.data.question;
        setQuestions([...questions, newQuestion]);
        resetForm();
        alert("Quiz question added successfully!");
      } catch (error) {
        console.error("Error adding quiz:", error);
        alert("Failed to add quiz question.");
      }
    }
  };

  const handleEditQuestion = (question) => {
    setQuestionText(question.text);
    setAnswers(question.answers);
    setEditMode(true);
    setQuestionToEditId(question.id);
  };

  const handleDeleteQuestion = async (questionId) => {
    try {
      await axios.delete(`/api/v1/quiz/deleteQuestion/${questionId}`);
      setQuestions(questions.filter((question) => question.id !== questionId));
      alert("Question deleted successfully");
    } catch (error) {
      console.error("Error deleting question:", error);
      alert("Failed to delete question.");
    }
  };

  const handleAddNewQuestion = () => {
    resetForm();
    setEditMode(true);
  };

  const resetForm = () => {
    setEditMode(false);
    setQuestionText("");
    setAnswers([]);
    setQuestionToEditId(null);
  };

  return (
    <div className="p-6 md:pl-72 font-poppins bg-darkColor text-white">
      <div className="flex items-center justify-between mb-6">
                <button
                    className="bg-main px-6 py-3 text-white rounded-md font-medium hover:underline flex items-center"
                    onClick={() => redirectToBack()} 
                >
                     Back
                </button>
               
            </div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-extrabold ">Quiz Management</h1>
        <button
          onClick={handleAddNewQuestion}
          className="px-6 py-2 bg-main text-white rounded-lg shadow-md transition"
        >
          Add New Question
        </button>
      </div>

      <div className="grid gap-6">
        {/* Quiz Questions Section */}
        <div className=" shadow-lg rounded-lg p-6 ">
          <h2 className="text-2xl font-semibold ">Quiz Questions</h2>
          {questions.length === 0 ? (
            <div className="text-center text-gray-500 py-4">No questions available</div>
          ) : (
            questions.map((question) => (
              <div
                key={question.id}
                className="border-b py-4 flex justify-between items-start"
              >
                <div>
                  <p className="text-lg font-medium  mb-2">
                    {question.text}
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    {question.answers.map((answer, i) => (
                      <li
                        key={i}
                        className={` ${answer.isCorrect ? "font-bold" : ""}`}
                      >
                        {answer.text}
                        {answer.isCorrect && (
                          <span className="text-green-500 ml-2">(Correct)</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditQuestion(question)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteQuestion(question.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}

        </div>

        {/* Add/Edit Question Form */}
        {editMode && (
          <div className="bg-darkColor text-black shadow-lg rounded-lg p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">
                {questionToEditId ? "Edit Question" : "Add Question"}
              </h2>
              <div>
                <label className="block text-white  mb-2">Question:</label>
                <textarea
                  value={questionText}
                  onChange={handleQuestionChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-blue-300"
                  rows="3"
                ></textarea>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Answers:</h3>
                {answers.map((answer, index) => (
                  <div key={index} className="flex gap-4 items-center mb-3">
                    <textarea
                      placeholder="Answer text"
                      value={answer.text}
                      onChange={(e) =>
                        handleAnswerChange(index, "text", e.target.value)
                      }
                      required
                      className="flex-grow px-3 py-2 border rounded-lg shadow-sm"
                      rows="2"
                    ></textarea>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={answer.isCorrect}
                        onChange={(e) =>
                          handleAnswerChange(index, "isCorrect", e.target.checked)
                        }
                      />
                      <span className="text-main">Correct</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => handleRemoveAnswer(index)}
                      className="text-red-500 hover:text-red-600"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddAnswer}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  Add Answer
                </button>
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-main text-white rounded-lg hover:bg-green-800"
              >
                {questionToEditId ? "Update Question" : "Add Question"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
