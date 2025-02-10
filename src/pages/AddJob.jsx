import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AddJob({ jobToEdit, onJobSubmitted }) {
  const [formData, setFormData] = useState({
    roleName: '',
    jobDescription: '',
    location: '',
    type: '',
    experience: '',
    responsibilities: '',
    requirements: '',
    applicationLink: '',
  });

  const jobTypes = ['Full-time', 'Part-time', 'Internship', 'Freelance', 'Contract'];

  // Populate form when editing
  useEffect(() => {
    if (jobToEdit) {
      setFormData({
        roleName: jobToEdit.roleName || '',
        jobDescription: jobToEdit.jobDescription || '',
        location: jobToEdit.location || '',
        type: jobToEdit.type || '',
        experience: jobToEdit.experience || '',
        responsibilities: jobToEdit.responsibilities || '',
        requirements: jobToEdit.requirements || '',
        applicationLink: jobToEdit.applicationLink || '',
      });
    }
  }, [jobToEdit]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
      };

      if (jobToEdit) {
        // Edit job logic
        await axios.put(`/api/v1/careers/updateOpportunity/${jobToEdit.id}`, payload, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        alert('Job updated successfully!');
      } else {
        // Add new job logic
        await axios.post(`/api/v1/careers/addNewOpportunity`, payload, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        alert('Job added successfully!');
      }

      // Clear form and trigger callback
      setFormData({
        roleName: '',
        jobDescription: '',
        location: '',
        type: '',
        experience: '',
        responsibilities: '',
        requirements: '',
        applicationLink: '',
      });

      if (onJobSubmitted) onJobSubmitted();

    } catch (error) {
      if (error.response) {
        console.error('Error Response:', error.response.data);
      } else {
        console.error('Error:', error.message);
      }
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto mt-6 font-poppins bg-white text-darkBg dark:bg-darkColor dark:text-white rounded-lg shadow-xl">
      <h1 className="text-3xl font-bold mb-8 text-center">
        {jobToEdit ? 'Edit Job Posting' : 'Add Job Posting'}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-1 font-medium">Role Name</label>
            <input
              type="text"
              name="roleName"
              value={formData.roleName}
              onChange={handleChange}
              className="w-full p-3 border rounded-md border-gray-300 bg-white dark:bg-darkBg dark:text-white"
              placeholder="Enter the role name"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full p-3 border rounded-md border-gray-300 bg-white dark:bg-darkBg dark:text-white"
              placeholder="Enter job location"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Job Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full p-3 border rounded-md border-gray-300 bg-white dark:bg-darkBg dark:text-white"
            >
              <option value="" disabled>Select job type</option>
              {jobTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Experience</label>
            <input
              type="text"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              className="w-full p-3 border rounded-md border-gray-300 bg-white dark:bg-darkBg dark:text-white"
              placeholder="Enter required experience"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-1 font-medium">Job Description</label>
            <textarea
              name="jobDescription"
              value={formData.jobDescription}
              onChange={handleChange}
              className="w-full p-3 border rounded-md border-gray-300 bg-white dark:bg-darkBg dark:text-white"
              placeholder="Enter job description"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Responsibilities</label>
            <textarea
              name="responsibilities"
              value={formData.responsibilities}
              onChange={handleChange}
              className="w-full p-3 border rounded-md border-gray-300 bg-white dark:bg-darkBg dark:text-white"
              placeholder="List job responsibilities"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-1 font-medium">Requirements</label>
            <textarea
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              className="w-full p-3 border rounded-md border-gray-300 bg-white dark:bg-darkBg dark:text-white"
              placeholder="List job requirements"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Application Link</label>
            <input
              type="url"
              name="applicationLink"
              value={formData.applicationLink}
              onChange={handleChange}
              className="w-full p-3 border rounded-md border-gray-300 bg-white dark:bg-darkBg dark:text-white"
              placeholder="Enter application link"
            />
          </div>
        </div>

        <button
          type="submit"
          className="bg-main text-white py-3 px-6 rounded-md mt-4 w-full md:w-auto hover:bg-darkColor transition-all"
        >
          {jobToEdit ? 'Update Job' : 'Submit Job'}
        </button>
      </form>
    </div>
  );
}
