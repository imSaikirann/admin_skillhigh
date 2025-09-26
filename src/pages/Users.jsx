import React, { useState, useEffect, useContext } from "react";
import axios from "../auth/axiosConfig";

import Spinner from "../components/Spinner";
import Alert from "../components/Alert";
import { useNavigateToBack } from "../utils/navigateUtils";
import { AppContext } from "../store/StoreContext";
import { addNewSale, fetchSales, removeCourseAccess } from "../services/userServices";
import { fetchPricings } from "../services/pricingsService";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showDropdown, setShowDropdown] = useState(null);
  const [page, setPage] = useState(1);
  const [pricings, setPricings] = useState([]);
  const [salesCount, setSalesCount] = useState(0);

  const limit = 10;
  const totalPages = Math.ceil(salesCount / limit);

  const { loading, setLoading, courses, fetchCourses } = useContext(AppContext);
  const redirectToBack = useNavigateToBack();

  const [newUser, setNewUser] = useState({
    id: "",
    email: "",
    phoneNumber: "",
    courseName: "",
    amount: "",
    priceId: "",
    isFullPayment: true,
  });
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  // 👇 NEW: filter state
  const [filter, setFilter] = useState("paid"); // "paid" | "unpaid"

  async function fetchUsers(page, search) {
    setLoading(true);
    try {
      const res = await fetchSales(page, search);
      setUsers(res.sales || []);
      setSalesCount(res.totalCount || 0);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchCoursePricings() {
    const res = await fetchPricings();
    setPricings(res || []);
  }

  useEffect(() => {
    fetchCourses();
    fetchCoursePricings();
  }, []);

  useEffect(() => {
    fetchUsers(page, search);
  }, [page, search]);

  const handleNextPage = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  const handleAddUser = async (e) => {
    e.preventDefault();

    try {
      if (newUser.id) {
        const response = await axios.put(
          `/api/v1/purchase/updatePurchase/${newUser.id}`,
          {
            email: newUser.email,
            courseId: newUser.courseName,
            amount: parseFloat(newUser.amount),
            phoneNumber: newUser.phoneNumber,
            isFullPayment: newUser.isFullPayment,
          },
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );

        if (response) {
          fetchUsers(page, search);
          setShowForm(false);
          resetUserForm();
        }
      } else {
        await addNewSale({
          email: newUser.email,
          courseId: newUser.courseName,
          priceId: newUser.priceId,
          phoneNumber: newUser.phoneNumber,
          isFullPayment: newUser.isFullPayment,
        });

        fetchUsers(page, search);
        setShowForm(false);
        resetUserForm();
      }
    } catch (error) {
      console.error("Error adding/editing user:", error);
    }
  };

  const resetUserForm = () => {
    setNewUser({
      id: "",
      email: "",
      phoneNumber: "",
      courseName: "",
      amount: "",
      priceId: "",
      isFullPayment: true,
    });
  };

  const handleDelete = async (userId, courseId) => {
    try {
      const res = await removeCourseAccess(userId, courseId);
      setAlertMessage(res);
      setAlertVisible(true);
      fetchUsers(page, search);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (user) => {
    setNewUser({ ...user, id: user.id || "" });
    setShowForm(true);
  };

  const handleAlertClose = () => {
    setAlertVisible(false);
  };

  // 👇 NEW: filter users based on filter state
  const filteredUsers = users?.filter((user) =>
    filter === "paid" ? user.isFullPayment : !user.isFullPayment
    
  );



  return (
    <div className="container mx-auto p-6 px-6 sm:pl-72 font-poppins h-screen">
      <div>
        <Alert message={alertMessage} isVisible={alertVisible} onClose={handleAlertClose} />
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

      {/* Search & Stats */}
      <div className="mb-6 p-4 dark:bg-darkColor w-full text-secondary shadow rounded-md">
        <div className="flex flex-col md:flex-row justify-between gap-4 items-center">
          <div className="text-lg font-semibold">
            Total Students: <span className="text-main">{salesCount}</span>
          </div>

          <div className="w-full md:w-auto relative">
            <input
              type="text"
              placeholder="Search by email..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full md:w-96 bg-gray-100 dark:bg-darkBg text-lightColor px-4 py-3 rounded-md shadow-sm focus:ring-2 focus:ring-main focus:outline-none transition duration-300 placeholder:text-gray-400"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-lightColor"
              >
                ✖
              </button>
            )}
          </div>
        </div>
      </div>

      <header className="flex justify-between items-center text-secondary mb-4">
        <h1 className="text-3xl font-semibold">Students</h1>
        <div className="flex flex-row gap-3">
          <button onClick={() => fetchUsers(page, search)} className="bg-gray-800 text-white px-4 py-3 rounded-md">
            Refresh
          </button>
          <button onClick={() => setShowForm(true)} className="bg-main text-white px-4 py-3 rounded-md">
            Add New Student
          </button>
        </div>
      </header>

      {/* 👇 NEW: Filter Buttons */}
      <div className="flex gap-3 mb-4">
        <button
          onClick={() => setFilter("paid")}
          className={`px-4 py-2 rounded-md border ${
            filter === "paid" ? "bg-main text-white" : "bg-white text-main"
          }`}
        >
          Full Payment
        </button>
        <button
          onClick={() => setFilter("unpaid")}
          className={`px-4 py-2 rounded-md border ${
            filter === "unpaid" ? "bg-main text-white" : "bg-white text-main"
          }`}
        >
          Unpaid
        </button>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <Spinner />
        ) : (
          <table className="w-full text-sm text-left bg-white dark:bg-darkBg text-secondary border dark:border-darkColor rounded-md shadow-md">
            <thead className="text-xs text-dark dark:text-white h-12 uppercase bg-green-50 dark:bg-darkBg sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3 border-b">Email</th>
                <th className="px-6 py-3 border-b">Phone Number</th>
                <th className="px-6 py-3 border-b">Course Name</th>
                <th className="px-6 py-3 border-b">Price</th>
                <th className="px-6 py-3 border-b">Full Payment</th>
                <th className="px-6 py-3 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <tr
                    key={index}
                    className="bg-white text-darkColor dark:text-white dark:bg-darkColor border-b hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  >
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4">{user.phoneNumber}</td>
                    <td className="px-6 py-4">{user.courseName}</td>
                    <td className="px-6 py-4">{user.price}</td>
                    <td className="px-6 py-4">{user.isFullPayment ? "Paid ✅" : "Unpaid ❌"}</td>
                    <td className="px-6 py-4">
                      <div className="relative">
                        <button
                          onClick={() => setShowDropdown(showDropdown === index ? null : index)}
                          className="text-gray-400 hover:text-main"
                        >
                          ⋮
                        </button>
                        {showDropdown === index && (
                          <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-300 shadow-lg rounded-md z-20">
                            <button
                              onClick={() => handleEdit(user)}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 w-full text-left"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(user.userId, user.courseId)}
                              className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-200 w-full text-left"
                            >
                              Remove Access
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-gray-400">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {filter === "paid" && (
        <div className="flex justify-center items-center mt-6 gap-4">
        <button
          onClick={handlePrevPage}
          disabled={page === 1}
          className={`px-4 py-2 rounded-md border ${
            page === 1
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-white text-main hover:bg-main hover:text-white transition"
          }`}
        >
          ◀ Prev
        </button>
        <span className="text-sm text-gray-600 dark:text-gray-300">
          Page <span className="font-semibold">{page}</span> of {totalPages || 1}
        </span>
        <button
          onClick={handleNextPage}
          disabled={page === totalPages || totalPages === 0}
          className={`px-4 py-2 rounded-md border ${
            page === totalPages || totalPages === 0
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-white text-main hover:bg-main hover:text-white transition"
          }`}
        >
          Next ▶
        </button>
      </div>)}

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowForm(false)}
          ></div>

          <div className="relative bg-white dark:bg-darkBg dark:text-white p-6 rounded-xl shadow-xl w-full max-w-lg z-50">
            <h2 className="text-2xl font-semibold mb-4">
              {newUser.id ? "Edit User" : "Add New User"}
            </h2>
            <form onSubmit={handleAddUser}>
              <input
                type="email"
                placeholder="Email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                className="w-full px-4 py-2 mb-3 border rounded-md dark:bg-darkColor dark:text-white"
                required
              />
              <input
                type="text"
                placeholder="Phone"
                value={newUser.phoneNumber}
                onChange={(e) => setNewUser({ ...newUser, phoneNumber: e.target.value })}
                className="w-full px-4 py-2 mb-3 border rounded-md dark:bg-darkColor dark:text-white"
                required
              />

              <div className="flex items-center gap-2 mb-3">
                <label className="text-sm">Full Payment:</label>
                <input
                  type="checkbox"
                  checked={newUser.isFullPayment}
                  onChange={(e) => setNewUser({ ...newUser, isFullPayment: e.target.checked })}
                />
              </div>

              <select
                value={newUser.courseName}
                onChange={(e) => setNewUser({ ...newUser, courseName: e.target.value })}
                className="w-full px-4 py-2 mb-3 border rounded-md dark:bg-darkColor dark:text-white"
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
                value={newUser.priceId || ""}
                onChange={(e) => setNewUser({ ...newUser, priceId: e.target.value })}
                className="w-full px-4 py-2 mb-3 border rounded-md dark:bg-darkColor dark:text-white"
                required
              >
                <option value="">Select Pricing</option>
                {pricings.map((pricing) => (
                  <option key={pricing.id} value={pricing.id}>
                    {pricing.name} - {pricing.price}
                  </option>
                ))}
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
                  {newUser.id ? "Save Changes" : "Add User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
