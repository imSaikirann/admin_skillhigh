import React, { useState, useEffect } from 'react';
import axios from '../auth/axiosConfig';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

export default function Topics() {
    const [topics, setTopics] = useState([]);
    const [error, setError] = useState(null);
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const { courseId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const fetchTopics = async () => {
            try {
                const res = await axios.get(`/api/v1/courseTopics/getTopicsByCoureId/${courseId}`);
                setTopics(res.data.topics);
            } catch (err) {
                setError("An error occurred while fetching the topics.");
            }
        };
        fetchTopics();
    }, [courseId]);

    const handleEditClick = (topic) => {
        setSelectedTopic(topic);
        setIsEditMode(true);
    };

    const handleEditCancel = () => {
        setIsEditMode(false);
        setSelectedTopic(null);
    };

    const handleSaveEdit = async () => {
        try {
            const updatedTopic = {
                ...selectedTopic,
                title: selectedTopic.title,
                description: selectedTopic.description,
                video: selectedTopic.video,
            };

            const response = await axios.put(`/api/v1/courseTopics/updateTopic/${selectedTopic.id}`, updatedTopic);
            setTopics(prevTopics =>
                prevTopics.map(topic =>
                    topic.id === selectedTopic.id ? response.data.updatedTopic : topic
                )
            );

            setIsEditMode(false);
            setSelectedTopic(null);
        } catch (err) {
            setError("An error occurred while updating the topic.");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSelectedTopic((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleTaskBox = (topicId) => {
        navigate(`/dashboard/departments/courses/topic/${topicId}?courseId=${courseId}`);
    };

    return (
        <div className="container mx-auto p-6 font-poppins sm:pl-80">
            {/* Header Section */}
            <div className="flex items-center justify-between mb-6">
                <button
                    className="bg-main px-3 py-1 text-white rounded-md font-medium hover:underline flex items-center"
                    onClick={() => navigate(-1)} 
                >
                     Go Back
                </button>
                <h1 className="text-4xl font-bold text-gray-800 text-center w-full">
                    {location.state?.courseName || "Course Name"}
                </h1>
            </div>

            <div className="flex items-center justify-between mb-8 flex-col sm:flex-row">
                <h1 className="text-3xl font-bold mb-4 sm:mb-0 text-gray-800">Course Topics</h1>
                <div className="flex flex-wrap gap-4 sm:gap-6 justify-center sm:justify-end w-full sm:w-auto">
                    <button
                        className="bg-main text-white font-semibold py-2 px-4 rounded hover:bg-main-dark transition-colors w-full sm:w-auto"
                        onClick={() => navigate(`/courses/add-topic/${courseId}`)}
                    >
                        Add Topic
                    </button>
                    <button
                        className="bg-main text-white font-semibold py-2 px-4 rounded hover:bg-main-dark transition-colors w-full sm:w-auto"
                        onClick={() => navigate(`/dashboard/courses/projects/${courseId}`)}
                    >
                        Course Projects
                    </button>
                    <button
                        className="bg-main text-white font-semibold py-2 px-4 rounded hover:bg-main-dark transition-colors w-full sm:w-auto"
                        onClick={() => navigate(`/dashboard/courses/modules/${courseId}`)}
                    >
                        Modules
                    </button>
                </div>
            </div>

            {/* Edit Topic Form */}
            {isEditMode && selectedTopic && (
                <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
                    <h2 className="text-2xl font-semibold mb-4">Edit Topic</h2>
                    <div className="mb-4">
                        <label htmlFor="title" className="block text-gray-700 mb-2">Title</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={selectedTopic.title}
                            onChange={handleInputChange}
                            className="border border-gray-300 p-2 w-full rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="description" className="block text-gray-700 mb-2">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={selectedTopic.description}
                            onChange={handleInputChange}
                            className="border border-gray-300 p-2 w-full rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="video" className="block text-gray-700 mb-2">Video URL</label>
                        <input
                            type="text"
                            id="video"
                            name="video"
                            value={selectedTopic.video}
                            onChange={handleInputChange}
                            className="border border-gray-300 p-2 w-full rounded"
                        />
                    </div>
                    <div className="flex gap-4">
                        <button
                            className="bg-main text-white py-2 px-4 rounded"
                            onClick={handleSaveEdit}
                        >
                            Save Changes
                        </button>
                        <button
                            className="bg-red-500 text-white py-2 px-4 rounded"
                            onClick={handleEditCancel}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Topics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {topics.length > 0 ? (
                    topics.map((topic, index) => (
                        <div
                            key={topic.id}
                            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 min-h-[300px] flex flex-col"
                        >
                            <div className="flex-grow">
                                <h1 className="text-lg font-semibold text-main mb-2">Lesson {index + 1}</h1>
                                <h2 className="text-2xl font-semibold text-gray-800 mb-4">{topic.title}</h2>
                                <p className="text-gray-600 mb-4 line-clamp-3">{topic.description}</p>
                            </div>
                            {topic.video && (
                                <video
                                    controls
                                    src={topic.video}
                                    className="w-full rounded-lg mb-4"
                                ></video>
                            )}
                            <button
                                className="bg-main text-white font-semibold py-2 px-4 rounded hover:bg-main-dark transition-colors w-full"
                                onClick={() => handleTaskBox(topic.id)}
                            >
                                Open TaskBox
                            </button>
                            <button
                                className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 mt-4"
                                onClick={() => handleEditClick(topic)}
                            >
                                Edit
                            </button>
                        </div>
                    ))
                ) : (
                    <div className='flex items-start justify-center h-screen'> Topics not found</div>
                )}
            </div>
        </div>
    );
}
