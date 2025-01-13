import React, { useState, useEffect } from 'react';
import axios from '../auth/axiosConfig';
import Alert from '../components/Alert';
import Spinner from '../components/Spinner';

export default function Mentors() {
  const [mentors, setMentors] = useState([]);
  const [form, setForm] = useState({
    id: null,
    name: '',
    qualification: '',
    company: '',
    photo: null,
  });
  const [isEdit, setIsEdit] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  // Fetch Mentors
  const fetchMentors = async () => {
    try {
      const response = await axios.get('/api/v1/mentors/getAllMentors');
      setMentors(response.data.mentors);
    } catch (error) {
      console.error('Error fetching mentors:', error);
    }
  };

  useEffect(() => {
    fetchMentors();
  }, []);

  // Handle Form Input Change
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setForm({
      ...form,
      [name]: files ? files[0] : value,
    });
  };

  // Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('name', form.name || '');
    formData.append('qualification', form.qualification || '');
    formData.append('company', form.company || '');
    if (form.photo) formData.append('photo', form.photo);

    console.log('Form State:', form);
    console.log('FormData Content:');
    for (let pair of formData.entries()) {
      console.log(pair[0] + ':', pair[1]);
    }

    try {
      if (isEdit) {
        const res = await axios.put(
          `/api/v1/mentors/updateMentor/${form.id}`,
          formData,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
          }
        );
        console.log('Update Response:', res);
        setAlertMessage(res.data.message);
      } else {
        const res = await axios.post('/api/v1/mentors/addNewMentor', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        console.log('Add Response:', res);
        setAlertMessage(res.data.message);
      }
      setAlertVisible(true);
      fetchMentors();
      resetForm();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  // Reset Form
  const resetForm = () => {
    setForm({ id: null, name: '', qualification: '', company: '', photo: null });
    setIsEdit(false);
    setIsFormOpen(false);
  };

  const handleAlertClose = () => {
    setAlertVisible(false);
  };

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(`/api/v1/mentors/deleteMentor/${id}`);
      setAlertMessage(res.data.message);
      setAlertVisible(true);
      fetchMentors();
    } catch (error) {
      console.error('Error deleting mentor:', error);
    }
  };

  // Edit Mentor
  const handleEdit = (mentor) => {
    setForm({
      id: mentor.id,
      name: mentor.name,
      qualification: mentor.qualification,
      company: mentor.company,
      photo: null,
    });
    setIsEdit(true);
    setIsFormOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 sm:pl-80">
      <Alert message={alertMessage} isVisible={alertVisible} onClose={handleAlertClose} />
      <div className="max-w-6xl mx-auto relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Mentors</h1>
          <button
            className="bg-main text-white py-2 px-4 rounded-lg shadow-md"
            onClick={() => setIsFormOpen(true)}
          >
            Add New Mentor
          </button>
        </div>

        {/* Mentors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {mentors.map((mentor) => (
            <div
              key={mentor.id}
              className="bg-white shadow-lg rounded-lg overflow-hidden transform transition duration-300 hover:scale-105 "
            >
              <img
                src={mentor.photo || 'https://via.placeholder.com/150'}
                alt={mentor.name}
                className="w-80 h-80 object-cover"
              />
              <div className="p-4">
                <h2 className="text-lg font-bold text-gray-800">{mentor.name}</h2>
                <p className="text-gray-600">{mentor.qualification}</p>
                <p className="text-gray-500 text-sm">{mentor.company}</p>
                <div className="mt-4 flex justify-between">
                  <button
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => handleEdit(mentor)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800"
                    onClick={() => handleDelete(mentor.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add/Edit Mentor Modal */}
        {isFormOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                onClick={resetForm}
              >
                ✕
              </button>
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                {isEdit ? 'Edit Mentor' : 'Add Mentor'}
              </h2>
              <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 p-2 rounded-lg"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Qualification</label>
                  <input
                    type="text"
                    name="qualification"
                    value={form.qualification}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 p-2 rounded-lg"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Company</label>
                  <input
                    type="text"
                    name="company"
                    value={form.company}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 p-2 rounded-lg"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Photo</label>
                  <input
                    type="file"
                    name="photo"
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 p-2 rounded-lg"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-main text-white py-2 rounded-lg"
                  disabled={loading}
                >
                  {isEdit ? 'Update Mentor' : loading ? 'Adding Mentor...' : 'Add Mentor'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
