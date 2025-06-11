import React, { useEffect, useState } from 'react';
import axios from '../auth/axiosConfig';
import Spinner from '../components/Spinner';

export default function Contactus() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchContacts = async () => {
    try {
      const response = await axios.get('/api/v1/contacts/allContacts', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.data.success) {
        setContacts(response.data.allContacts);
      } else {
        console.error('Failed to load contact data');
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this contact?');
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(`/api/v1/contacts/deleteContact/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.data.success) {
        setContacts((prev) => prev.filter((contact) => contact.id !== id));
      } else {
        console.error('Failed to delete contact');
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  const toggleSelect = async (id, currentStatus) => {
    try {
      const response = await axios.put(
        `/api/v1/contacts/updateStatus/${id}`,
        { read: !currentStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (response.data) {
        fetchContacts();
      } else {
        console.error('Failed to update contact read status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );
  }

  if (contacts.length === 0) {
    return (
      <div className="text-center mt-20 text-gray-500 dark:text-gray-400 text-lg">
        No messages found.
      </div>
    );
  }

  return (
    <div className="p-8 sm:pl-72 bg-white dark:bg-darkColor min-h-screen font-poppins text-sm text-darkColor dark:text-gray-300">
      <h2 className="text-3xl font-bold mb-6 text-center">Contact Us Messages</h2>

      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="px-4 py-3 text-left">
                <span className="sr-only">Select</span>
              </th>
              <th className="px-4 py-3 text-left font-semibold">Date</th>
              <th className="px-4 py-3 text-left font-semibold">Name</th>
              <th className="px-4 py-3 text-left font-semibold">Email</th>
              <th className="px-4 py-3 text-left font-semibold">Phone</th>
              <th className="px-4 py-3 text-left font-semibold">Message</th>
              <th className="px-4 py-3 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => {
              const isRead = contact.read ;

              return (
                <tr
                  key={contact.id}
                  className={`border-t border-gray-200 dark:border-gray-700 
                    ${isRead ? 'bg-gray-200 dark:bg-gray-800' : ''} 
                    hover:bg-gray-50 dark:hover:bg-gray-800`}
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={isRead}
                      onChange={() => toggleSelect(contact.id, isRead)}
                      className="form-checkbox h-4 w-4 text-primaryColor"
                    />
                  </td>
                  <td className="px-4 py-3">
                    {new Date(contact.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">{contact.name}</td>
                  <td className="px-4 py-3">{contact.email}</td>
                  <td className="px-4 py-3">{contact.phone}</td>
                  <td className="px-4 py-3 max-w-sm break-words whitespace-pre-wrap">
                    {contact.message}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDelete(contact.id)}
                      className="text-red-600 hover:text-red-800 font-semibold"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
