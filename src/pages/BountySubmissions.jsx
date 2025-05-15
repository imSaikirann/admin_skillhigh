import React, { useEffect, useState } from 'react';
import { fetchBountySubmissions,verifyBounty } from '../services/bountiesServices';
import { useParams } from 'react-router-dom';

export default function BountySubmissions() {
  const { bountyId } = useParams();
  const [submissions, setSubmissions] = useState([]);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVisible, setAlertVisible] = useState(false);

  const STATUS_OPTIONS = ["REVIEWING","SUCCESSFUL","FAILED"];

  useEffect(() => {
    const fetchBounties = async () => {
      try {
        const response = await fetchBountySubmissions(bountyId);
        setAlertMessage(response.message);
        setAlertVisible(true);
        setSubmissions(response.additional || []);
      } catch (error) {
        console.error('Error fetching bounties:', error);
      }
    };

    fetchBounties();
  }, [bountyId]);



const handleStatusChange = async (newStatus, submissionId,applicationId) => {
  try {
    await verifyBounty({ status: newStatus }, submissionId,applicationId);

    const response = await fetchBountySubmissions(bountyId);
    setSubmissions(response.additional || []);
    setAlertMessage(response.message);
    setAlertVisible(true);
  } catch (error) {
    console.error('Error updating status or fetching submissions:', error);
  }
};

  return (
    <div className="bg-white dark:bg-darkColor font-poppins text-black dark:text-white min-h-screen py-10 px-6 sm:pl-72">
      <header className="flex justify-between items-center mb-8 border-b pb-4 border-gray-200 dark:border-gray-700">
        <h1 className="text-3xl font-bold">Bounty Submissions</h1>
      </header>

      {submissions.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">No submissions found.</p>
      ) : (
        <div className="space-y-6">
          {submissions.map((submission, index) => (
            <div
              key={submission.id || index}
              className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm"
            >
              {/* Header Row */}
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
                <div className="flex flex-col gap-1">
                  <div className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                    Submitted by: <span className="font-semibold">{submission.user.name}</span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Submitted: {new Date(submission.createdAt).toLocaleString()}
                  </div>
                </div>

                <a
                  href={submission.submittedLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm bg-primary text-white px-4 py-2 rounded-md hover:brightness-110 transition self-start"
                >
                  View Submission
                </a>
              </div>

              {/* Notes */}
              <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300 mb-4">
                <p>
                  <span className="font-semibold">Notes:</span> {submission.notes}
                </p>
      
              </div>

              {/* Status Controls */}
              <div className="flex flex-wrap gap-4 items-center mt-2">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    Status:
                  </label>
                  <select
                    value={submission.status}
                    onChange={(e) => handleStatusChange(e.target.value, submission.id,submission.applicationId)}
                    className="text-xs px-2 py-1 rounded-md bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-white"
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>

                <div
                  className={`text-xs px-2 py-1 rounded-full font-medium ${
                    submission.isBountyAwarded
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  Awarded: {submission.isBountyAwarded ? 'Yes' : 'No'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
