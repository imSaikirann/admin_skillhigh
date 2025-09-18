import React, { useState, useEffect } from "react";
import axios from "../auth/axiosConfig";
import { useParams } from 'react-router-dom';

export default function CourseTools() {
  const [tools, setTools] = useState([]);
  const [showAddTool, setShowAddTool] = useState(false);
  const [newTool, setNewTool] = useState({ name: "", imageFile: null });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
 const { courseId } = useParams();
  // ✅ Fetch tools on mount or when courseId changes
  useEffect(() => {
    const fetchTools = async () => {
      try {
        setFetching(true);
        const res = await axios.get(`/api/v2/course-tools/tools/${courseId}`);
      
        setTools(res.data.additional || []); // depends on API response shape
      } catch (err) {
        console.error("Error fetching tools:", err);
      } finally {
        setFetching(false);
      }
    };

    if (courseId) fetchTools();
  }, [courseId]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewTool((prev) => ({ ...prev, imageFile: file }));
    }
  };

  const handleAddTool = async () => {
    if (!newTool.name || !newTool.imageFile) return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("toolName", newTool.name);
      formData.append("courseId", courseId);
      formData.append("toolImage", newTool.imageFile);

      const res = await axios.post(
        "/api/v2/course-tools/tools/",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      // ✅ Append new tool to local state
      setTools((prev) => [...prev, res.data.additional]);
      setNewTool({ name: "", imageFile: null });
      setShowAddTool(false);
    } catch (err) {
      console.error("Error adding tool:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto font-poppins bg-white dark:bg-darkColor dark:text-white rounded-lg shadow-lg mt-6">
      {!showAddTool ? (
        <>
          <h1 className="text-3xl font-bold text-center mb-8">Course Tools</h1>

          <div className="flex justify-between mb-6">
            <button
              onClick={() => window.history.back()}
              className="bg-gray-200 text-darkBg dark:bg-darkBg dark:text-white py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
            >
              Back
            </button>

            <button
              onClick={() => setShowAddTool(true)}
              className="bg-main text-white py-2 px-6 rounded-lg hover:bg-darkColor transition-all"
            >
              Add New Tool
            </button>
          </div>

          <div className="bg-gray-100 dark:bg-darkBg p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Available Tools</h2>

            {fetching ? (
              <p className="text-gray-500">Loading tools...</p>
            ) : tools.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-300">
                No tools added yet.
              </p>
            ) : (
              <ul className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {tools.map((tool) => (
                  <li
                    key={tool.id}
                    className="p-4 bg-white dark:bg-darkColor border border-gray-300 rounded-md flex flex-col items-center"
                  >
                    <img
                      src={tool.toolImage}
                      alt={tool.toolName}
                      className="w-20 h-20 object-contain mb-2"
                    />
                    <h3 className="text-lg font-medium">{tool.toolName}</h3>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      ) : (
        <div>
          <button
            onClick={() => setShowAddTool(false)}
            className="bg-gray-200 text-darkBg dark:bg-darkBg dark:text-white py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 mb-4"
          >
            Back
          </button>

          {/* Add Tool Form */}
          <div className="bg-gray-100 dark:bg-darkBg p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Add New Tool</h2>

            <input
              type="text"
              placeholder="Tool Name"
              value={newTool.name}
              onChange={(e) =>
                setNewTool((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full border p-2 rounded mb-3 text-black"
            />

            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mb-3"
            />

            <button
              onClick={handleAddTool}
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              {loading ? "Adding..." : "Add Tool"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
