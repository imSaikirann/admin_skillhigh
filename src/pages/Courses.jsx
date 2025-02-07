import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../auth/axiosConfig";
import {useNavigateToBack} from '../utils/navigateUtils'
import Alert from '../components/Alert';
import EditCourseModal from "../pages/EditCourseModal"; 


export default function Courses() {
  const { departmentId } = useParams();
  const navigate = useNavigate();
  const redirectToBack = useNavigateToBack()
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(null); 

  // Fetch courses by department ID
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        console.log(departmentId);
        const response = await axios.get(`/api/v1/courses/getCoursesByDeptId/${departmentId}`);
        setCourses(response.data.departmentCourses.courses);
        setAlertMessage(response.data.message);
        setAlertVisible(true);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    fetchCourses();
  }, [departmentId]);

  // Open modal for editing a course
  const handleEdit = (course) => {
    setSelectedCourse(course); // Load course data into modal
    setShowModal(true); // Show the modal
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedCourse(null);
  };

  // Save course changes
  const handleSaveChanges = async (updatedCourse) => {
    try {
      const formData = new FormData();
      formData.append("courseName", updatedCourse.courseName);
      formData.append("courseDescription", updatedCourse.courseDescription);
      formData.append("courseCount", updatedCourse.courseCount);
      if (updatedCourse.departmentId) formData.append("departmentId", updatedCourse.departmentId);
      if (updatedCourse.file) formData.append("courseThumbnail", updatedCourse.file);
      formData.append("hide", updatedCourse.hide); // Include hide value

      const res = await axios.put(`/api/v1/courses/updateCourse/${updatedCourse.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data","Authorization": `Bearer ${localStorage.getItem('token')}`, },
        
      });

      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          course.id === updatedCourse.id ? { ...course, ...updatedCourse } : course
        )
      );

      setAlertMessage(res.data.message);
      setAlertVisible(true);
      closeModal();
    } catch (error) {
      console.error("Error updating course:", error);
      alert("Failed to update course. Please try again.");
    }
  };

  const handleAlertClose = () => {
    setAlertVisible(false);
  };

  const toggleDropdown = (courseId) => {
    // Toggle the dropdown menu for the course
    setDropdownOpen(dropdownOpen === courseId ? null : courseId);
  };

  const handleOpenTopics = (courseId,courseName)=>{
    navigate(`/dashboard/topics/${courseId}`, { state: { courseName } })
  }

  return (
    <div>
      <div className="absolute z-50">
        <Alert 
          message={alertMessage} 
          isVisible={alertVisible} 
          onClose={handleAlertClose} 
        />
      </div>

      <div className="p-8 sm:pl-72 font-poppins">
         {/* Header Section */}
         <div className="flex items-center justify-between mb-6">
                <button
                    className="bg-main px-6 py-3 text-white rounded-md font-medium hover:underline flex items-center"
                    onClick={() => redirectToBack()} 
                >
                     Back
                </button>
               
            </div>
            
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-semibold text-darkColor dark:text-white ">Courses</h1>
          <button
            className="bg-main text-white font-semibold py-2 px-4 rounded"
            onClick={() => navigate(`/dashboard/addcourses/${departmentId}`)}
          >
            Add New Course
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-6">
          {courses.length > 0 ? (
            courses.map((course) => (
              <div key={course.id} className="max-w-md  rounded overflow-hidden shadow-sm bg-white dark:bg-darkColor text-white  border-2 dark:border-darkColor relative">
                <img
                  className="w-full h-auto object-cover"
                  src={course.courseThumbnail}
                  alt={course.courseName}
                />
                <div className="px-6 py-4">
                  <div className="font-bold text-xl mb-2">{course.courseName}</div>
                  <p className="text-dark dark:text-white text-base">
                    {course.courseDescription.length > 100
                      ? `${course.courseDescription.slice(0, 97)}...`
                      : course.courseDescription}
                  </p>
                </div>

                {/* Three-dot button for actions */}
                <div className="absolute top-2 right-2">
                  <button
                    onClick={() => toggleDropdown(course.id)}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    <EditIcon/>
                  </button>
                  
                  {dropdownOpen === course.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white text-darkColor dark:bg-darkBg dark:text-whiteshadow-lg rounded-lg z-10">
                      <ul className="py-2">
                        <li>
                          <button
                            className="block px-4 py-2 bg-white text-darkColor dark:bg-darkBg dark:text-white"
                            onClick={() => handleEdit(course)}
                          >
                            Edit
                          </button>
                        </li>
                        {/* Add more options here (e.g., Delete) */}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="px-6 pt-4 pb-2 space-x-2">
                  <button
                    className="bg-main text-white font-semibold py-2 px-4 rounded"
                    onClick={() => handleOpenTopics(course.id,course.courseName) }
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600">No courses found for this department.</p>
          )}
        </div>

        {showModal && (
          <EditCourseModal
            course={selectedCourse}
            onClose={closeModal}
            onSave={handleSaveChanges}
          />
        )}
      </div>
    </div>
  );
}


export const  EditIcon = ()=>{
  return (
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
</svg>

  )
}