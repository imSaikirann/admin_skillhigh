import { useEffect, useState } from 'react';
import { fetchBountyApplications } from '../services/bountiesServices';
import { useParams } from 'react-router-dom';
import Alert from '../components/Alert';

export default function BountyApplication() {
  const { bountyId } = useParams();
  const [applications, setApplications] = useState([]);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetchBountyApplications(bountyId);
        setAlertMessage(response.message);
        setAlertVisible(true);
        setApplications(response.additional || []);
      } catch (error) {
        console.error('Error fetching bounty applications:', error);
      }
    };

    fetchApplications();
  }, [bountyId]);

  const handleAlertClose = () => {
    setAlertVisible(false);
  };

  return (
    <div className="bg-white dark:bg-darkColor font-poppins text-black dark:text-white min-h-screen py-10 px-6 sm:pl-72">
      <header className="flex justify-between items-center mb-8 border-b pb-4 border-gray-200 dark:border-gray-700">
        <h1 className="text-3xl font-bold">Bounty Applications</h1>
      </header>

      <Alert
        message={alertMessage}
        isVisible={alertVisible}
        onClose={handleAlertClose}
      />

      {applications.length === 0 ? (
        <p className="text-gray-500 text-center">No applications found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-gray-200 dark:border-gray-600">
            <thead className="bg-gray-100 dark:bg-darkBg2 text-left">
              <tr>
                <th className="px-4 py-3 border-b">#</th>
                <th className="px-4 py-3 border-b">Name</th>
                <th className="px-4 py-3 border-b">Email</th>

              </tr>
            </thead>
            <tbody>
              {applications.map((application, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-darkBg2 transition">
                  <td className="px-4 py-3 border-b">{index + 1}</td>
                  <td className="px-4 py-3 border-b">{application.user?.name || 'N/A'}</td>
                  <td className="px-4 py-3 border-b">{application.user?.email || 'N/A'}</td>
                 
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
