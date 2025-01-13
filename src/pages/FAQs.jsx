import React, { useState, useEffect } from "react";
import axios from "../auth/axiosConfig";
import Alert from '../components/Alert';

export default function FAQs() {
  const [faqs, setFaqs] = useState([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [selectedFAQ, setSelectedFAQ] = useState(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  // Retrieve token from localStorage
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const response = await axios.get("/api/v1/faqs/allFAQs", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(response)
        setFaqs(response.data.allFAQs);
      } catch (error) {
        console.error("Error fetching FAQs:", error);
      }
    };

    fetchFAQs();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!question.endsWith("?")) {
      setAlertMessage("Question must end with a question mark.");
      setAlertVisible(true);
      return;
    }

    try {
      if (editMode) {
        const res = await axios.put(
          `/api/v1/faqs/updateFAQ/${selectedFAQ.id}`,
          { question, answer },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setFaqs(
          faqs.map((faq) =>
            faq.id === selectedFAQ.id ? { ...faq, question, answer } : faq
          )
        );
        setAlertMessage(res.data.message);
        setAlertVisible(true);
        setEditMode(false);
      } else {
        const res = await axios.post(
          "/api/v1/faqs/createFAQ",
          { question, answer },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setFaqs([...faqs, { id: res.data.id, question, answer }]); // Add the returned FAQ ID
        setAlertMessage(res.data.message);
        setAlertVisible(true);
      }

      setQuestion("");
      setAnswer("");
    } catch (error) {
      console.error("Error saving FAQ:", error);
      if (error.response) {
        setAlertMessage(error.response.data.message || "Something went wrong.");
        setAlertVisible(true);
      }
    }
  };

  const handleAlertClose = () => {
    setAlertVisible(false);
  };

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(`/api/v1/faqs/deleteFAQ/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFaqs(faqs.filter((faq) => faq.id !== id));
      setAlertMessage(res.data.message);
      setAlertVisible(true);
    } catch (error) {
      console.error("Error deleting FAQ:", error);
    }
  };

  const handleEdit = (faq) => {
    setEditMode(true);
    setSelectedFAQ(faq);
    setQuestion(faq.question);
    setAnswer(faq.answer);
  };

  return (
    <div className="container mx-auto p-4 sm:pl-80 font-poppins">
      <Alert message={alertMessage} isVisible={alertVisible} onClose={handleAlertClose} />
      <h2 className="text-2xl font-bold mb-4">FAQs</h2>

      <form onSubmit={handleSubmit} className="mb-6">
        <input
          type="text"
          placeholder="Question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="border p-2 w-full mb-4"
        />
        <textarea
          placeholder="Answer"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className="border p-2 w-full mb-4"
        />
        <button type="submit" className="bg-main text-white p-2 rounded">
          {editMode ? "Update FAQ" : "Add FAQ"}
        </button>
      </form>

      <div className="faq-list">
        {faqs.length === 0 ? (
          <p>No FAQs available</p>
        ) : (
          faqs.map((faq) => (
            <div key={faq.id} className="faq-item border-b py-4">
              <h3 className="text-xl">{faq.question}</h3>
              <p>{faq.answer}</p>
              <div className="actions mt-2">
                <button
                  onClick={() => handleEdit(faq)}
                  className="bg-yellow-400 text-white p-2 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(faq.id)}
                  className="bg-red-500 text-white p-2 rounded"
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
