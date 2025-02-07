import React, { useState } from "react";

function EditCourseModal({ course, onClose, onSave }) {
  const [formData, setFormData] = useState({
    ...course,
    file: null, // For storing file (thumbnail)
    hide: course.hide || false, // Initialize with current hide value or default to false
  });

  // Handle input field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle file input change
  const handleFileChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      file: e.target.files[0],
    }));
  };

  // Handle checkbox (Hide/Unhide) change
  const handleCheckboxChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      hide: e.target.checked, // Update the hide value based on checkbox state
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData); // Pass the form data back to the parent (onSave function)
  };

  return (
    <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white text-darkColor  dark:bg-darkColor dark:text-white border dark:border-darkColor p-6 rounded shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Edit Course</h2>
        <form onSubmit={handleSubmit}>
          {/* Course Name */}
          <div className="mb-4">
            <label
              htmlFor="courseName"
              className="block text-gray-700 font-semibold mb-2"
            >
              Course Name
            </label>
            <input
              type="text"
              id="courseName"
              name="courseName"
              value={formData.courseName}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-darkColor bg-white dark:bg-darkBg dark:text-white  rounded focus:outline-none focus:ring focus:border-main"
              required
            />
          </div>

          {/* Course Description */}
          <div className="mb-4">
            <label
              htmlFor="courseDescription"
              className="block text-gray-700 font-semibold mb-2"
            >
              Course Description
            </label>
            <textarea
              id="courseDescription"
              name="courseDescription"
              value={formData.courseDescription}
              onChange={handleInputChange}
              rows="4"
              className="w-full px-4 py-2 border border-darkColor bg-white dark:bg-darkBg dark:text-white  rounded focus:outline-none focus:ring focus:border-main"
              required
            ></textarea>
          </div>

          {/* Course Thumbnail (File Upload) */}
          <div className="mb-4">
            <label
              htmlFor="courseThumbnail"
              className="block text-gray-700 font-semibold mb-2"
            >
              Course Thumbnail
            </label>
            <input
              type="file"
              id="courseThumbnail"
              name="courseThumbnail"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-4 py-2 border border-darkColor bg-white dark:bg-darkBg dark:text-white  rounded focus:outline-none focus:ring focus:border-main"
            />
          </div>

          {/* Hide/Unhide Checkbox */}
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="hide"
              name="hide"
              checked={formData.hide}
              onChange={handleCheckboxChange}
              className="mr-2"
            />
            <label htmlFor="hide" className="text-gray-700 font-semibold">
              Hide Course
            </label>
          </div>

          {/* Actions (Cancel and Save) */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="bg-gray-300 text-gray-700 py-2 px-4 rounded"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-main text-white py-2 px-4 rounded font-semibold"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditCourseModal;
