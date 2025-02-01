import React, { useState, useEffect, useContext } from 'react';
import axios from '../auth/axiosConfig';
import { AppContext } from '../store/StoreContext';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert';
import {useNavigateToBack} from '../utils/navigateUtils'

export default function Users() {
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showDropdown, setShowDropdown] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const { loading, setLoading } = useContext(AppContext);
    const redirectToBack = useNavigateToBack()
  
  const [newUser, setNewUser] = useState({
    email: '',
    phone: '',
    courseName: '',
    amount: '',
    using: 'NO',
  });
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  async function fetchUsers() {
    setLoading(true);
    try {
      const res = await axios.get('/api/v1/purchase/getAllPurchases',{
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setUsers(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {

    fetchUsers();
  }, []);


  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await axios.get('/api/v1/courses/allCourses');
        setCourses(res.data.allCourses);
      } catch (error) {
        console.log(error);
      }
    }
    fetchCourses();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.courseName.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();

    try {
      if (newUser.id) {
        const response = await axios.put(`/api/v1/purchase/updatePurchase/${newUser.id}`, {
          email: newUser.email,
          courseId: newUser.courseName,
          amount: parseFloat(newUser.amount),
          phone: newUser.phone,
        },{
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });

        if (response) {

          fetchUsers();
          setShowForm(false);
          setNewUser({ email: '', phone: '', courseName: '', amount: '' });
        }
      } else {

        const response = await axios.post('/api/v1/purchase/addPurchase', {
          email: newUser.email,
          courseId: newUser.courseName,
          amount: parseFloat(newUser.amount),
          phone: newUser.phone,
        },{
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });

        if (response) {
          fetchUsers();
          setShowForm(false);
         
          setNewUser({ email: '', phone: '', courseName: '', amount: '' });
          setAlertMessage(response.data.message)
          setAlertVisible(true)
        }
      }
    } catch (error) {
      console.error("Error adding/editing user:", error);
    }
  };

  const handleDelete = async (userId,courseId) => {
    try {
      const res = await axios.delete(`/api/v1/purchase/deletePurchase/${userId}`, {
        data: { courseId }, // Include `courseId` in the `data` field for DELETE requests
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      
      setUsers(users.filter(user => user.id !== userId));
      setAlertMessage(res.data.message)
      setAlertVisible(true)
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (user) => {
    console.log(user)
    setNewUser({ ...user });
    setShowForm(true);
  };
  const handleAlertClose = () => {
    setAlertVisible(false);
  };
  return (
    <div className="container mx-auto p-6 px-6 sm:pl-72 font-poppins">
      <div>
        <Alert
          message={alertMessage}
          isVisible={alertVisible}
          onClose={handleAlertClose}
        />
      </div>
 {/* Header Section */}
 <div className="flex items-center justify-between mb-6 ">
                <button
                    className="bg-main px-6 py-2 text-white rounded-md font-medium hover:underline flex items-center"
                    onClick={() => redirectToBack()} 
                >
                     Back
                </button>
               
            </div>
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-semibold">Users</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-main text-white px-4 py-2 rounded-md"
        >
          Add New User
        </button>
      </header>

      <div className="mb-6 p-4 bg-darkColor border border-gray-700 text-white shadow rounded-md flex justify-between items-center">
        <div className="text-lg font-semibold ">
          Total Users: <span className="text-main">{users.length}</span>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Search users by email or course..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-96 text-darkColor  px-4 py-3 rounded-md "
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="relative overflow-x-auto p-8 ">
        {loading ? (
          <Spinner />
        ) : (
          <table className="w-full text-sm text-left bg-main text-white">
            <thead className="text-xs text-white uppercase">
              <tr>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Phone Number</th>
                <th className="px-6 py-3">Course Name</th>
                <th className="px-6 py-3">Price</th>
                <th className="px-6 py-3">Using (Yes/No)</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.length > 0 ? (
                currentUsers.map((user, index) => (
                  <tr key={index} className="bg-darkColor border border-gray-800 text-white">
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4">{user.phoneNumber}</td>
                    <td className="px-6 py-4">{user.courseName}</td>
                    <td className="px-6 py-4">{user.price}</td>
                    <td className="px-6 py-4">{user.using ? 'Yes' : 'No'}</td>
                    <td className="px-6 py-4">
                      <div className="relative">
                        <button
                          onClick={() =>
                            setShowDropdown(showDropdown === index ? null : index)
                          }
                          className="text-gray-500 hover:text-black"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
                            <path d="m5.433 13.917 1.262-3.155A4 4 0 0 1 7.58 9.42l6.92-6.918a2.121 2.121 0 0 1 3 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 0 1-.65-.65Z" />
                            <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0 0 10 3H4.75A2.75 2.75 0 0 0 2 5.75v9.5A2.75 2.75 0 0 0 4.75 18h9.5A2.75 2.75 0 0 0 17 15.25V10a.75.75 0 0 0-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5Z" />
                          </svg>
                        </button>
                        {showDropdown === index && (
                          <div className="absolute right-20 bottom-3 mt-2 w-20 bg-white border border-gray-200 shadow-lg rounded-md">
                            <button
                              onClick={() => handleEdit(user)}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 w-full text-left"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(user.id,user.courseId)}
                              className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-200 w-full text-left"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Buttons */}
      <div className="flex justify-between mt-4">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-md border ${currentPage === 1 ? 'bg-gray-300' : 'bg-main text-white'}`}
        >
          Previous
        </button>
        <span className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded-md border ${currentPage === totalPages ? 'bg-gray-300' : 'bg-main text-white'}`}
        >
          Next
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md w-1/3">
            <h2 className="text-2xl font-semibold mb-4">{newUser.id ? 'Edit User' : 'Add New User'}</h2>
            <form onSubmit={handleAddUser}>
              <input
                type="email"
                placeholder="Email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                className="w-full px-4 py-2 mb-3 border rounded-md"
                required
              />
              <input
                type="text"
                placeholder="Phone"
                value={newUser.phone}
                onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                className="w-full px-4 py-2 mb-3 border rounded-md"
                required
              />
              <select
                value={newUser.courseName}
                onChange={(e) => setNewUser({ ...newUser, courseName: e.target.value })}
                className="w-full px-4 py-2 mb-3 border rounded-md"
                required
              >
                <option value="">Select Course</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.courseName}
                  </option>
                ))}
              </select>

              <select
                value={newUser.amount}
                onChange={(e) => {
                  setNewUser({ ...newUser, amount: parseFloat(e.target.value) });
                }}
                className="w-full px-4 py-2 mb-3 border rounded-md"
                required
              >
                <option value="">Select Amount</option>
                <option value="4500">4500</option>
                <option value="6500">6500</option>
              </select>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 mr-2 rounded-md border"
                >
                  Cancel
                </button>
                <button type="submit" className="bg-main text-white px-4 py-2 rounded-md">
                  {newUser.id ? 'Save Changes' : 'Add User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
