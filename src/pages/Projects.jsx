import React, { useState, useEffect } from 'react';
import axios from '../auth/axiosConfig';
import { useParams } from 'react-router-dom';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [projectName, setProjectName] = useState('');
  const [projectLink, setProjectLink] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const { courseId } = useParams();

  // Fetch projects by course ID
  const fetchProjectsByCourse = async (courseId) => {
    try {
      const response = await axios.get(`/api/v1/courseProjects/getProjectByCourseID/${courseId}`);

      setProjects(response.data.projects);
    } catch (error) {
      console.error('Error fetching projects:', error.message);
    }
  };

  // Add or update project
  const addOrUpdateProject = async () => {
    if (isEditing && selectedProject) {
      try {
        await axios.put(`/api/v1/courseProjects/updateProject/${selectedProject.id}`, { projectName, projectLink });
        setProjects(projects.map((proj) =>
          proj.id === selectedProject.id ? { ...proj, projectName, projectLink } : proj
        ));
      } catch (error) {
        console.error('Error updating project:', error.message);
      }
    } else {
      try {
        const response = await axios.post(`/api/v1/courseProjects/createProject/${courseId}`, {
          projectName,
          projectLink,
        });
        setProjects([...projects, response.data]);
      } catch (error) {
        console.error('Error adding project:', error.message);
      }
    }
    setShowModal(false);
    setIsEditing(false);
    setProjectName('');
    setProjectLink('');
  };

  // Delete project
  const deleteProject = async (projectId) => {
    try {
      await axios.delete(`/api/v1/project/deleteProject/${projectId}`);
      setProjects(projects.filter((proj) => proj.id !== projectId));
    } catch (error) {
      console.error('Error deleting project:', error.message);
    }
  };

  // Open edit modal
  const openEditModal = (project) => {
    setSelectedProject(project);
    setProjectName(project.projectName);
    setProjectLink(project.projectLink);
    setIsEditing(true);
    setShowModal(true);
  };

  useEffect(() => {
    fetchProjectsByCourse(courseId);
  }, [courseId]);

  return (
    <div className="container mx-auto p-6 px-6 font-poppins sm:pl-80">
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-semibold">Projects</h1>
        <button
          onClick={() => {
            setShowModal(true);
            setIsEditing(false);
            setProjectName('');
            setProjectLink('');
          }}
          className="bg-main text-white px-4 py-2 rounded-md"
        >
          Add New Project
        </button>
      </header>

      {/* List of Projects */}
      <div className="grid grid-cols-1 gap-4 mt-4">
        {projects.length > 0 ? (
          projects.map((project) => (
            <div key={project.id} className="p-6 border rounded-md shadow-md">
              <h3 className="text-xl font-medium">{project.projectName}</h3>
              <a href={project.projectLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                View Project
              </a>
              <div className="mt-2">
                <button
                  onClick={() => openEditModal(project)}
                  className="text-blue-500 hover:underline mr-4"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteProject(project.id)}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center mt-4">No projects found</p>
        )}
      </div>

      {/* Add/Edit Project Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-md p-6 w-96 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">{isEditing ? 'Edit Project' : 'Add New Project'}</h2>
            <input
              name="projectName"
              placeholder="Project Name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              name="projectLink"
              placeholder="Project Link"
              value={projectLink}
              onChange={(e) => setProjectLink(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <div className="flex justify-end">
              <button
                onClick={addOrUpdateProject}
                className="bg-main text-white px-4 py-2 rounded-md mr-2"
              >
                Save
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
