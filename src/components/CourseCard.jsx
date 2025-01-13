import React from 'react';
import { useNavigate } from 'react-router-dom'; 

export default function CourseCard({ title, description, image, courseId }) {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/courses/${courseId}`);
  };

  const handleAddTopic = (id) => {
    console.log(id);  // This will now log the correct `courseId`
    navigate(`/courses/add-topic/${id}`);  // Navigate using the correct ID
  };

  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white">
      <img className="w-full h-48 object-cover" src={image} alt={title} />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{title}</div>
        <p className="text-gray-700 text-base">
          {description.length > 100 ? `${description.slice(0, 97)}...` : description}
        </p>
      </div>
      <div className="px-6 pt-4 pb-2 space-x-2">
        <button
          className="bg-main text-white font-semibold py-2 px-4 rounded"
          onClick={handleViewDetails}
        >
          View Details
        </button>
        <button
          className="bg-main text-white font-semibold py-2 px-4 rounded"
          onClick={() => handleAddTopic(courseId)}  // Pass `courseId` here
        >
          Add Topic
        </button>
      </div>
    </div>
  );
}
