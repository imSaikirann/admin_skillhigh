import React, { useEffect, useState } from 'react';
import axios from '../auth/axiosConfig';
import Spinner from '../components/Spinner';

export default function Contactus() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from the backend on component mount
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await axios.get('/api/v1/contacts/allContacts'); // Adjust the endpoint if needed

        if (response.data.success) {
          setContacts(response.data.allContacts); // Assuming `response.data.data` holds the contacts
        } else {
          alert('Failed to load contact data');
        }
      } catch (error) {
        console.error('Error fetching contacts:', error);
        alert('Error fetching contact data');
      } finally {
        setLoading(false); // Set loading to false once data is fetched or error occurs
      }
    };

    fetchContacts();
  }, []);

  // Handle the case where the contacts data is still loading or empty
  if (loading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <Spinner />
      </div>
    );
  }

  // Function to handle delete
  const handleDelete = async (id) => {
    try {
      // Send delete request to backend
      const response = await axios.delete(`/api/v1/contacts/deleteContact/${id}`);
      
      if (response.data.success) {
        // Remove the deleted contact from the state
        setContacts(contacts.filter(contact => contact.id !== id));
        alert('Contact deleted successfully');
      } else {
        alert('Failed to delete contact');
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
      alert('Error deleting contact');
    }
  };

  // If no contacts were found
  if (contacts.length === 0) {
    return <p className="text-center mt-8">No messages found</p>;
  }

  return (
    <div className="p-8 sm:pl-80">
      <h2 className="text-2xl font-bold mb-4">Contact Us Messages</h2>
      <table className="min-w-full table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2 border">Name</th>
            <th className="px-4 py-2 border">Email</th>
            <th className="px-4 py-2 border">Phone</th>
            <th className="px-4 py-2 border">Message</th>
            <th className="px-4 py-2 border">Actions</th> {/* Added Actions column */}
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact) => (
            <tr key={contact.id}>
              <td className="px-4 py-2 border">{contact.name}</td>
              <td className="px-4 py-2 border">{contact.email}</td>
              <td className="px-4 py-2 border">{contact.phone}</td>
              <td className="px-4 py-2 border">{contact.message}</td>
              <td className="px-4 py-2 border">
                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(contact.id)}
                  className="text-red-500 hover:text-red-700 font-semibold"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
