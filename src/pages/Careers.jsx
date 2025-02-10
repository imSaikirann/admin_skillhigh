import React, { useEffect, useState } from 'react';
import AddJob from './AddJob';
import axios from 'axios';
import { EditIcon, BinIcon } from '../assets/icons/icons';

export default function Careers() {
  const [showAddJob, setShowAddJob] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingJob, setEditingJob] = useState(null); 

  // Fetch job data on component mount
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/api/v1/careers/allOpportunites');
        setJobs(response.data.additional || []);
        setError(null);
      } catch (err) {
        setError('Failed to fetch job postings.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleEditJob = (job) => {
    setEditingJob(job); // Set the job to edit
    setShowAddJob(true);
  };

  const handleDeleteJob = async (id) => {
    try {
      await axios.delete(`/api/v1/careers/deleteOpportunity/${id}`,{
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
      setJobs(jobs.filter((job) => job.id !== id)); // Update job list after deletion
      alert('Job deleted successfully!');
    } catch (err) {
      console.log(err)
      alert('Failed to delete job.');
    }
  };

  const handleGoBack = () => {
    setShowAddJob(false);
    setEditingJob(null); // Reset editing state
  };

  return (
    <div className="p-8 max-w-4xl mx-auto font-poppins bg-white dark:bg-darkColor dark:text-white rounded-lg shadow-lg mt-6">
      {!showAddJob ? (
        <>
          <h1 className="text-3xl font-bold text-center mb-8">Careers</h1>

          <div className="flex justify-between mb-6">
            <button
              onClick={() => window.history.back()}
              className="bg-gray-200 text-darkBg dark:bg-darkBg dark:text-white py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
            >
              Back
            </button>

            <button
              onClick={() => setShowAddJob(true)}
              className="bg-main text-white py-2 px-6 rounded-lg hover:bg-darkColor transition-all"
            >
              Add New Job
            </button>
          </div>

          <div className="bg-gray-100 dark:bg-darkBg p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Current Job Openings</h2>

            {loading ? (
              <p className="text-gray-600 dark:text-gray-300">Loading...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : jobs.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-300">
                No job postings available yet.
              </p>
            ) : (
              <ul className="space-y-4">
                {jobs.map((job) => (
                  <li
                    key={job.id}
                    className="p-4 bg-white dark:bg-darkColor border border-gray-300 rounded-md flex justify-between items-center"
                  >
                    <div>
                      <h3 className="text-xl font-semibold">{job.roleName}</h3>
                      <p className="text-gray-700 dark:text-gray-400">
                        {job.jobDescription}
                      </p>
                      <p className="text-sm text-gray-500">
                        Location: {job.location} | Type: {job.type}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditJob(job)}

                      >
                        <EditIcon />
                      </button>
                      <button
                        onClick={() => handleDeleteJob(job.id)}

                      >
                        <BinIcon />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      ) : (
        <div>
          <button
            onClick={handleGoBack}
            className="bg-gray-200 text-darkBg dark:bg-darkBg dark:text-white py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 mb-4"
          >
            Back
          </button>
          <AddJob jobToEdit={editingJob} />
        </div>
      )}
    </div>
  );
}
