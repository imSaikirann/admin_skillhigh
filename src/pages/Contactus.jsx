import React, { useEffect, useState } from 'react';
import axios from '../auth/axiosConfig';
import Spinner from '../components/Spinner';

export default function Contactus() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await axios.get('/api/v1/contacts/allContacts', {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (response.data.success) {
          setContacts(response.data.allContacts);
        } else {
          alert('Failed to load contact data');
        }
      } catch (error) {
        console.error('Error fetching contacts:', error);
        alert('Error fetching contact data');
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`/api/v1/contacts/deleteContact/${id}`, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.data.success) {
        setContacts(contacts.filter((contact) => contact.id !== id));
        alert('Contact deleted successfully');
      } else {
        alert('Failed to delete contact');
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
      alert('Error deleting contact');
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
    return <p className="text-center mt-8">No messages found</p>;
  }

  return (
    <div className="p-8 sm:pl-72 font-poppins bg-white text-darkColor dark:bg-darkColor dark:text-gray-300 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-center">Contact Us Messages</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white  text-darkColor dark:text-secondary dark:bg-darkColor shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-primaryColor">
              <th className="px-6 py-4 text-left text-sm font-medium ">Name</th>
              <th className="px-6 py-4 text-left text-sm font-medium ">Email</th>
              <th className="px-6 py-4 text-left text-sm font-medium ">Phone</th>
              <th className="px-6 py-4 text-left text-sm font-medium ">Message</th>
              <th className="px-6 py-4 text-left text-sm font-medium ">Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => (
              <tr
                key={contact.id}
                className="border-b border-gray-200 hover:bg-lightColor"
              >
                <td className="px-6 py-4 text-sm text-darkColor dark:text-gray-300">{contact.name}</td>
                <td className="px-6 py-4 text-sm text-darkColor dark:text-gray-300">{contact.email}</td>
                <td className="px-6 py-4 text-sm text-darkColor dark:text-gray-300">{contact.phone}</td>
                <td className="px-6 py-4 text-sm text-darkColor dark:text-gray-300">{contact.message}</td>
                <td className="px-6 py-4 text-sm">
                  <button
                    onClick={() => handleDelete(contact.id)}
                    className="text-red-600 hover:text-red-800 font-semibold focus:outline-none"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
