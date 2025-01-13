import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../auth/axiosConfig';
import { FiMoreVertical } from 'react-icons/fi';

export default function Module() {
  const { courseId } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [moduleName, setModuleName] = useState('');
  const [contentModal, setContentModal] = useState(false);
  const [contentName, setContentName] = useState('');
  const [selectedModuleId, setSelectedModuleId] = useState(null);
  const [editingContentId, setEditingContentId] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [moduleModalOpen, setModuleModalOpen] = useState(false);
  const [editingModuleId, setEditingModuleId] = useState(null);
  const [modules, setModules] = useState([]);

  // Fetch modules on initial render and after any data change
  const fetchModules = async () => {
    try {
      const res = await axios.get(`/api/v1/curriculum/getAllModules/${courseId}`);
      console.log(res.data)
      setModules(res.data.allModules);
    } catch (error) {
      console.error('Error fetching modules:', error.message);
      alert('Error fetching modules');
    }
  };

  useEffect(() => {
    fetchModules(); // Fetch modules when the component mounts
  }, [courseId]);

  // Toggle Module Modal
  const toggleModuleModal = (module = null) => {
    setModuleModalOpen(!moduleModalOpen);
    setModuleName(module ? module.moduleName : '');
    setEditingModuleId(module ? module.id : null);
  };

  // Handle Module Submission (Add or Edit)
  const handleModuleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingModuleId) {
        // Edit existing module
        await axios.put(`/api/v1/curriculum/updateModule/${editingModuleId}`, {
          moduleName,
        });
       
      } else {
        // Add new module
        await axios.post(`/api/v1/curriculum/createModule/${courseId}`, {
          moduleName,
        });
      
      }
      setModuleModalOpen(false);
      setModuleName('');
      setEditingModuleId(null);
      fetchModules(); // Fetch updated modules after add or edit
    } catch (error) {
      console.error('Error saving module:', error.message);
      alert('Error saving module');
    }
  };

  // Toggle Content Modal
  const toggleContentModal = (moduleId, content = {}) => {
    setContentModal(!contentModal);
    setSelectedModuleId(moduleId || null);
    setContentName(content.contentName || '');
    setEditingContentId(content.id || null);
  };

  // Handle Content Submission
  const handleContentSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingContentId) {
        await axios.put(`/api/v1/curriculum/updateContent/${editingContentId}`, {
          contentName,
          moduleId: selectedModuleId,
        });
      
      } else {
        await axios.post(`/api/v1/curriculum/addContent/${selectedModuleId}`, {
          contentName,
        });
       
      }
      setContentModal(false);
      setContentName('');
      setEditingContentId(null);
      fetchModules(); // Fetch updated modules after add or edit content
    } catch (error) {
      console.error('Error saving content:', error.message);
      alert('Error saving content');
    }
  };

  const handleDeleteContent = async (contentId) => {
    try {
      await axios.delete(`/api/v1/curriculum/deleteContent/${contentId}`);
   
      fetchModules(); // Fetch updated modules after content deletion
    } catch (error) {
      console.error('Error deleting content:', error.message);
      alert('Error deleting content');
    }
  };

  const handleDeleteModule = async (moduleId) => {
    try {
      await axios.delete(`/api/v1/curriculum/deleteModule/${moduleId}`);
  
      fetchModules(); 
    } catch (error) {
      console.error('Error deleting Module:', error);
      alert('Error deleting Module');
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-6 sm:pl-80">
      <h1 className="text-3xl font-bold text-center mb-8">Course Modules</h1>

      <div className="flex justify-end mb-4">
        <button
          onClick={() => toggleModuleModal()}
          className="bg-main text-white px-4 py-2 rounded-md transition-colors"
        >
          Add New Module
        </button>
      </div>

      {modules?.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">No modules available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module, index) => (
            <div
              key={module.id}
              className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-300 relative"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold mb-2">
                  Module {index + 1}: {module.moduleName}
                </h2>
                <div className="relative">
                  <FiMoreVertical
                    onClick={() =>
                      setDropdownOpen(dropdownOpen === module.id ? null : module.id)
                    }
                    className="cursor-pointer text-gray-600 hover:text-gray-800"
                  />
                  {dropdownOpen === module.id && (
                    <div className="absolute right-0 mt-2 bg-white shadow-md rounded-md text-sm w-40">
                      <button
                        onClick={() => toggleContentModal(module.id)}
                        className="block px-4 py-2 text-left w-full hover:bg-gray-100"
                      >
                        Add Content
                      </button>
                      <button
                        onClick={() => toggleModuleModal(module)}
                        className="block px-4 py-2 text-left w-full hover:bg-gray-100"
                      >
                        Edit Module
                      </button>
                      <button
                        onClick={() => handleDeleteModule(module.id)}
                        className="block px-4 py-2 text-left w-full text-red-500 hover:bg-gray-100"
                      >
                        Delete Module
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-500">
                Created At: {new Date(module.createdAt).toLocaleDateString()}
              </p>

              <div className="border-t pt-4">
                <h3 className="text-lg font-medium mb-3">Contents:</h3>
                {module.contents.length > 0 ? (
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    {module.contents.map((content) => (
                      <li key={content.id} className="flex justify-between items-center">
                        {content.contentName}
                        <div className="flex gap-2">
                          <button
                            onClick={() => toggleContentModal(module.id, content)}
                            className="text-blue-500 hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteContent(content.id)}
                            className="text-red-500 hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-600">No contents available.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Module Modal */}
      {moduleModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">
              {editingModuleId ? 'Edit Module' : 'Add Module'}
            </h2>
            <form onSubmit={handleModuleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Module Name</label>
                <input
                  type="text"
                  value={moduleName}
                  onChange={(e) => setModuleName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModuleModalOpen(false)}
                  className="bg-gray-200 px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-main text-white px-4 py-2 rounded-md"
                >
                  {editingModuleId ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Content Modal */}
      {contentModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">
              {editingContentId ? 'Edit Content' : 'Add Content'}
            </h2>
            <form onSubmit={handleContentSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Content Name</label>
                <input
                  type="text"
                  value={contentName}
                  onChange={(e) => setContentName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setContentModal(false)}
                  className="bg-gray-200 px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-main text-white px-4 py-2 rounded-md"
                >
                  {editingContentId ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
