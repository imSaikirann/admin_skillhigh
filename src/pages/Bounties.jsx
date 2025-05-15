import { useState, useEffect, useContext } from 'react';
import Input from '../components/Input';
import { getAllBounities, createBounty, deleteBounty, updateBounty } from '../services/bountiesServices';
import Alert from '../components/Alert';
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../store/StoreContext';
import { s } from 'framer-motion/client';

export default function Bounties() {
  const [form, setForm] = useState({
    name: '',
    description: '',
    link: '',
    courseId:'',
    amount: '',
    slots:'',
    type: '',
    expiryDate: ''
  });
  const { courses, fetchCourses } = useContext(AppContext);
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false);
  const [isFormOpend, setIsFormOpend] = useState(false);
  const [bounties, setBounties] = useState([]);
  const [isEditBounty, setIsEditBounty] = useState(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    const fetchBounties = async () => {
      try {
        const response = await getAllBounities();
        console.log(response)
        setAlertMessage(response.message);
        setAlertVisible(true);
        setBounties(response.additional || []);
      } catch (error) {
        console.error('Error fetching bounties:', error);
      }
    };

    fetchBounties();
  }, []);

  useEffect(() => {
    fetchCourses()

  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = (bounty) => {
    setForm({
      name: bounty.name,
      description: bounty.description,
      link: bounty.link,
      amount: bounty.amount,
      slots: bounty.slots,
      type: bounty.type,
      expiryDate: bounty.expiryDate ? bounty.expiryDate.slice(0, 16) : '', // Ensure proper format for datetime-local
    });
    setIsEditBounty(bounty.id || bounty._id);  // Set the bounty id for later use
    setIsFormOpend(true); // Open the form for editing
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Ensure the expiryDate is in the correct ISO format
    let formattedExpiryDate = form.expiryDate;

    if (formattedExpiryDate) {
      // Append seconds and milliseconds to make it a valid ISO string
      formattedExpiryDate = new Date(formattedExpiryDate).toISOString();
    }

    const bountyData = {
      name: form.name,
      description: form.description,
      courseId:form.courseId,
      link: form.link,
      slots: parseInt(form.slots), // Ensure slots is an integer
      amount: parseInt(form.amount), // Ensure amount is an integer
      type: form.type,
      expiryDate: formattedExpiryDate // Use the formatted expiry date
    };

    const createOrUpdateBountyData = async () => {
      try {
        let response;
        if (isEditBounty) {
          // If we're editing, call the update function
          response = await updateBounty(isEditBounty, bountyData);
          setAlertMessage(response.message);
          setAlertVisible(true);
          setBounties(response.additional || []);
          setBounties(bounties.map(bounty => bounty.id === isEditBounty ? response : bounty)); // Update the bounty in the list
        } else {
          // Otherwise, create a new bounty
          response = await createBounty(bountyData);
          setAlertMessage(response.message);
          setAlertVisible(true);
          setBounties(response.additional || []);
          setBounties([...bounties, response]);
        }
        setIsFormOpend(false); // Close the form
        setForm({
          name: '',
          description: '',
          link: '',
          amount: '',
          type: '',
          expiryDate: ''
        });
      } catch (error) {
        console.error('Error creating or updating bounty:', error);
      } finally {
        setIsLoading(false);
      }
    };

    createOrUpdateBountyData(); // Create or update based on form state
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this bounty?')) {
      try {
        const response = await deleteBounty(id);
        setAlertMessage(response.message);
        setAlertVisible(true);
        setBounties(response.additional || []);

        setBounties(bounties.filter((bounty) => bounty.id !== id));
      } catch (error) {
        console.error('Error deleting bounty:', error);
      }
    }
  };

  const handleCancel = () => {
    setIsFormOpend(false);
    setForm({
      name: '',
      description: '',
      link: '',
      amount: '',
      slots: '',
      type: '',
      expiryDate: ''
    });
  };

  const handleAlertClose = () => {
    setAlertVisible(false);
  };

  const handleViewSubmissions = (bountyId) => {
    navigate(`/control_center/bounty_submissions/${bountyId}`)
  }

    const handleBountyApplications = (bountyId) => {
    navigate(`/control_center/applications/${bountyId}`)
  }
  return (
    <div className="bg-white dark:bg-darkColor font-poppins text-black dark:text-white min-h-screen py-10 px-6 sm:pl-72">
      {/* Header */}
      <header className="flex justify-between items-center mb-8 border-b pb-4 border-darkColor/20">
        <Alert
          message={alertMessage}
          isVisible={alertVisible}
          onClose={handleAlertClose}
        />
        <h1 className="text-3xl font-bold">Bounties</h1>
        <button
          onClick={() => setIsFormOpend(true)}
          className={`bg-primary ${isFormOpend ? 'hidden' : 'flex'} text-white px-4 py-2 rounded-md text-sm`}
        >
          Create New Bounty
        </button>
      </header>

      {/* Form */}
      {isFormOpend && (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
          <Input label="Bounty Name" name="name" placeholder="Enter bounty title" value={form.name} onChange={handleChange} />
          <Input
            label="Description"
            name="description"
            placeholder="Enter description"
            value={form.description}
            onChange={handleChange}
            isTextArea={true} // Treats description as textarea
          />
          <Input label="Link" name="link" placeholder="Provide drive link" value={form.link} onChange={handleChange} />
          <Input label="Amount" name="amount" type="number" placeholder="Enter reward amount" value={form.amount} onChange={handleChange} />
          <Input label="Slots" name="slots" type="number" placeholder="Enter number of  Slots" value={form.slots} onChange={handleChange} />
        <Input label="Type" name="type" placeholder="Enter Type of Bounty" value={form.type} onChange={handleChange} />
          
          <Input
            label="Course"
            name="courseId" 
            type="select"
            placeholder="Select course"
            value={form.courseId}
            onChange={handleChange}
            options={courses.map(course => ({
        
              label: course.courseName,
              value: course.id
            }))}
          />

          <Input label="Expiry Date" name="expiryDate" type="datetime-local" value={form.expiryDate} onChange={handleChange} />
          <div className="flex gap-4 justify-end">
            <button type="button" onClick={handleCancel} className="bg-gray-300 text-black px-4 py-2 rounded-md text-sm">
              Cancel
            </button>
            <button type="submit" className="bg-primary text-white px-4 py-2 rounded-md text-sm" disabled={isLoading}>
              {isLoading ? 'Creating...' : isEditBounty ? 'Update Bounty' : 'Create Bounty'}
            </button>
          </div>
        </form>
      )}

      {/* Bounty List */}
      {!isFormOpend && (
        <section className="mt-10">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">🎯 Bounty List</h2>

          {bounties && bounties.length === 0 ? (
            <p className="text-gray-500 text-center">No bounties available.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {bounties && bounties.map((bounty, index) => (
                <div
                  key={index}
                  className="relative border border-gray-50 dark:border-darkColor rounded-xl shadow-sm p-6 bg-white dark:bg-darkBg space-y-3 hover:shadow-md transition"
                >
                  {/* Submissions Count Badge */}
                  <span className="absolute top-4 right-4 bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full">
                 {(bounty.submissions?.length || 0)} Submissions

                  </span>

                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                      {bounty.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{bounty.description}</p>
                  </div>

                  <div className="text-sm space-y-1 text-gray-700 dark:text-gray-300">
                    <p>💰 <span className="font-medium">{bounty.amount}</span></p>
                    <p>
                      🔗{" "}
                      <a
                        href={bounty.link}
                        className="text-blue-500 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Link
                      </a>
                    </p>
                    <p>📌 Type: <span className="capitalize">{bounty.type}</span></p>
                    <p>📌 Status: <span className="capitalize">{bounty.status}</span></p>
                    <p>📅 Expires: {new Date(bounty.expiryDate).toLocaleDateString()}</p>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-3">
                    <button
                      onClick={() => handleEdit(bounty)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(bounty.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm"
                    >
                      Delete
                    </button>
                        <button onClick={() => handleBountyApplications(bounty.id)} className="bg-primary hover:brightness-110 text-white px-4 py-2 rounded-md text-sm">
                      View Applications ( {(bounty.applications?.length || 0)} )
                    </button>


                    <button onClick={() => handleViewSubmissions(bounty.id)} className="bg-primary hover:brightness-110 text-white px-4 py-2 rounded-md text-sm">
                      View Submissions
                    </button>

                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

    </div>
  ); 
}
