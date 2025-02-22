import React, { useState, useContext, useEffect } from "react";
import { EditIcon, BinIcon } from "../assets/icons/icons";
import { AppContext } from '../store/StoreContext';
import axios from '../auth/axiosConfig';
import Alert from '../components/Alert';

export default function MentorsManagement() {
  const [showForm, setShowForm] = useState(false);
  const [projectMentors, setProjectMentors] = useState([]);
  const [formData, setFormData] = useState({ email: "", password: "", courseId: "", mentorName: "" });
  const { loading, courses, fetchCourses, mentors, fetchMentors } = useContext(AppContext);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [editingMentor, setEditingMentor] = useState(null);
  const [showPassword,setShowPassword] = useState(false)

  useEffect(() => {
    fetchCourses();
    fetchMentors();
    fetchMentorsData();
  }, []);

  // FETCH PROJECT MENTORS
  const fetchMentorsData = async () => {
    try {
      const response = await axios.get('/api/v1/admin/allProjectMentors', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setProjectMentors(response.data.additional);
    } catch (error) {
      setAlertMessage(error.response?.data?.message || "Error while adding course.");
      setAlertVisible(true);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

   // SUBMIT FORM (ADD OR UPDATE MENTOR)
   const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (editingMentor) {
        // Update Mentor
        response = await axios.put(`/api/v1/admin/changePassword/${editingMentor.id}`, formData, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
      } else {
        // Add New Mentor
        response = await axios.post('/api/v1/admin/createMentor', formData, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
      }

      if (response.data) {
        setFormData({ email: "", mentorName: "", courseId: "", password: "" });
        fetchMentorsData();
        setShowForm(false);
        setEditingMentor(null); // Reset editing state
      }
    } catch (error) {
      setAlertMessage(error.response?.data?.errors?.[0]?.message || error.response?.data?.message || 'Error while processing request.');
      setAlertVisible(true);
    }
  };


  //DELETEING A PROJECT MENTOR BY SENDING ID
  const handleDeleteProjectMentor = async (id) => {
    try {
      const response = await axios.delete(`/api/v1/admin/deleteMentor/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      if (response.data) {
        console.log(response.data)
        setAlertMessage(response.data.message);
        setAlertVisible(true);
        fetchMentorsData()
      }
    } catch (error) {
      setAlertMessage(error.response?.data?.message || "Error while adding course.");
      setAlertVisible(true);
    }
  }

  // HANDLE EDIT BUTTON CLICK
  const handleEditProjectMentor = (mentor) => {
    setEditingMentor(mentor);
    setFormData({
      email: mentor.email,
      mentorName: mentor.mentorName,
      courseId: mentor.courseId,
      password: "", 
    });
    setShowForm(true);
  };

  const handleAlertClose = () => {
    setAlertVisible(false);
  };
  return (
    <div className="bg-white dark:bg-darkColor text-black dark:text-white min-h-screen py-10 px-6 sm:pl-72">
      <Alert
        message={alertMessage}
        isVisible={alertVisible}
        onClose={handleAlertClose}
      />
      {/* Header */}
      <header className="flex justify-between items-center mb-8 border-b pb-4 border-darkColor/20">
        <h1 className="text-3xl font-bold">Mentor Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-main text-white px-6 py-3 rounded-full flex items-center gap-2 hover:bg-main transition"
        >
          <EditIcon className="w-5 h-5" /> Add Mentor
        </button>
      </header>

      {/* Add Mentor Modal */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <div className="bg-white dark:bg-darkColor shadow-lg rounded-lg p-6 w-96 border border-darkColor relative">
            <h2 className="text-xl font-semibold mb-4">Assign Mentor to Course</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="p-3 border border-darkColor rounded-lg bg-white dark:bg-darkColor"
              />
              <input
                type= {!showPassword? 'text':'password'}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="p-3 border border-darkColor rounded-lg bg-white dark:bg-darkColor"
              />

              <label htmlFor="course" className="text-base font-medium">
                Select Course
              </label>
              <select
                id="course"
                name="courseId"
                value={formData.courseId}
                onChange={handleChange}
                required
                className="w-full p-3 border border-darkColor/40 rounded-lg bg-white dark:bg-darkColor focus:ring-2 focus:ring-main focus:outline-none"
              >
                <option value="" disabled>{!loading ? "Loading courses..." : "Select a course"}</option>
                {courses.length > 0 ? courses.map((course) => (
                  <option key={course.id} value={course.id}>{course.courseName}</option>
                )) : <option disabled>No courses available</option>}
              </select>


              <label htmlFor="mentor" className="text-base font-medium">
                Assign Mentor
              </label>
              <select
                id="mentor"
                name="mentorName"
                value={formData.mentorName}
                onChange={handleChange}
                required
                className="w-full p-3 border border-darkColor/40 rounded-lg bg-white dark:bg-darkColor focus:ring-2 focus:ring-main focus:outline-none"
              >
                <option value="" disabled>{!loading ? "Loading mentors..." : "Select a mentor"}</option>
                {mentors.length > 0 ? mentors.map((mentor) => (
                  <option key={mentor.id} value={mentor.name}>{mentor.name}</option>
                )) : <option disabled>No mentors available</option>}
              </select>

              <button type="submit" className="bg-main text-white px-5 py-2 rounded-lg hover:bg-main transition">
                Add Mentor
              </button>
            </form>
            <button onClick={() => setShowForm(false)} className="absolute top-2 right-4 text-gray-500 hover:text-red-500 transition">
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Mentors Table */}
      <section className="overflow-x-auto bg-white dark:bg-darkColor shadow-md rounded-lg p-6">
        <table className="w-full border border-darkColor text-left">
          <thead className="bg-main text-white">
            <tr>
              <th className="border border-darkColor px-6 py-3">Email</th>
              <th className="border border-darkColor px-6 py-3">Course</th>
              <th className="border border-darkColor px-6 py-3">Mentor Name</th>
              <th className="border border-darkColor px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projectMentors.length > 0 ? (
              projectMentors.map((mentor) => (
                <tr key={mentor.email} className="border-b border-darkColor hover:bg-darkColor/10 transition">
                  <td className="border border-darkColor px-6 py-4">{mentor.email}</td>
                  <td className="border border-darkColor px-6 py-4">{mentor.coureName}</td>
                  <td className="border border-darkColor px-6 py-4">{mentor.mentorName}</td>
                  <td className="border border-darkColor px-6 py-4 flex items-center gap-3">
                    <button onClick={() => handleEditProjectMentor(mentor)} className="bg-blue-400 text-white px-3 py-2 rounded-md flex items-center gap-2 hover:bg-blue-200 transition">
                      <EditIcon className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleDeleteProjectMentor(mentor.id)} className="bg-red-100 text-white px-3 py-2 rounded-md flex items-center gap-2 hover:bg-red-200 transition">
                      <BinIcon className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-4">No mentors assigned yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
