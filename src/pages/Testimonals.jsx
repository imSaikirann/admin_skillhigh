import React, { useEffect, useState } from 'react';
import axios from '../auth/axiosConfig';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert';

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', collageName: '', review: '' });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const token = localStorage.getItem('token');
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  
  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/v1/testimonals/allTestimonals');
      console.log(response)
      setTestimonials(response.data.allTestimonals);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`/api/v1/testimonals/updateTesimonal/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
      } else {
       const res =  await axios.post('/api/v1/testimonals/createTestimonal', formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        setAlertMessage(res.data.message);
        setAlertVisible(true);
      }
      setFormData({ name: '', collageName: '', review: '' });
      setEditingId(null);
      setShowForm(false); 
      fetchTestimonials(); 
    } catch (error) {
      console.error('Error submitting testimonial:', error);
      alert('Error submitting testimonial');
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(`/api/v1/testimonals/deleteTestimonal/${id}`,{
        headers: { Authorization: `Bearer ${token}` },
      });
      setAlertMessage(res.data.message);
      setAlertVisible(true);
      fetchTestimonials(); 
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      alert('Error deleting testimonial');
    }
  };

  const handleAlertClose = () => {
    setAlertVisible(false);
  };

  const renderForm = () => (
    <div className="bg-white shadow-lg rounded-lg p-6 mb-8 w-full max-w-lg mx-auto font-poppins">
       <Alert message={alertMessage} isVisible={alertVisible} onClose={handleAlertClose} />
      <h2 className="text-2xl font-semibold text-center mb-4">{editingId ? 'Edit Testimonial' : 'Add Testimonial'}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-gray-700">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-main"
            required
          />
        </div>
        <div>
          <label htmlFor="collageName" className="block text-sm font-semibold text-gray-700">College Name</label>
          <input
            id="collageName"
            name="collageName"
            type="text"
            value={formData.collageName}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-main"
            required
          />
        </div>
        <div>
          <label htmlFor="review" className="block text-sm font-semibold text-gray-700">Review</label>
          <textarea
            id="review"
            name="review"
            value={formData.review}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-main"
            rows="4"
            required
          />
        </div>
        <div className="flex justify-end">
          <button type="submit" className="px-6 py-2 bg-main text-white rounded-lg hover:bg-main-dark">Submit</button>
        </div>
      </form>
    </div>
  );

  const renderTestimonialList = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 font-poppins sm:pl-72">
      <h2 className="text-2xl font-semibold mb-4 col-span-full">All Testimonials</h2>
      {loading ? (
        <div className="flex justify-center items-center col-span-full"><Spinner /></div>
      ) : testimonials.length === 0 ? (
        <p className="text-center text-gray-500 col-span-full">No testimonials found</p>
      ) : (
        testimonials.map((testimonial) => (
          <div key={testimonial.id} className="bg-darkColor text-white border border-gray-600
           shadow-lg rounded-lg p-6">
            <h3 className="text-xl font-semibold ">{testimonial.name}</h3>
            <p className="text-sm ">{testimonial.collageName}</p>
            <p className="mt-4 ">{testimonial.review}</p>
            <div className="mt-6 flex justify-between">
              <button
                className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
                onClick={() => {
                  setEditingId(testimonial.id);
                  setFormData({ name: testimonial.name, collageName: testimonial.collageName, review: testimonial.review });
                  setShowForm(true); // Open form when editing
                }}
              >
                Edit
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                onClick={() => handleDelete(testimonial.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );

  return (
    <div className="p-8">
      {/* Add Testimonial button */}
      <button
        className="fixed top-8 right-8 bg-main text-white p-4 rounded-full shadow-lg hover:bg-main-dark transition"
        onClick={() => setShowForm(true)} // Show form when clicked
      >
        + Add Testimonial
      </button>

      {/* Conditionally render the form */}
      {showForm && renderForm()}

      {/* Render the list of testimonials */}
      {renderTestimonialList()}
    </div>
  );
}
