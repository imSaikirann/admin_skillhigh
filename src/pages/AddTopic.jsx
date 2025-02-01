import React, { useState } from 'react';
import axios from '../auth/axiosConfig';
import Alert from '../components/Alert';
import { useParams } from 'react-router-dom';

export default function AddTopic() {
    const { courseId } = useParams(); // Corrected typo 'couresId' to 'courseId'
    
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        pptLink: '',
        video: '',
    });
    const [loading, setLoading] = useState(false);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prepare the data to send as JSON (no need for FormData)
        const payload = {
            title: formData.title,
            description: formData.description,
            pptLink: formData.pptLink,
            video: formData.video,
        };

        try {
            setLoading(true);

            const response = await axios.post(`/api/v1/courseTopics/addTopic/${courseId}`, payload, {
                headers: {
                    'Content-Type': 'application/json', // Send JSON data
                },
            });

            setAlertMessage(response.data.message || 'Topic added successfully!');
            setAlertVisible(true);

            // Reset form data
            setFormData({
                title: '',
                description: '',
                pptLink: '',
                video: '',
            });
        } catch (error) {
            setAlertMessage(error.response?.data?.errors[0].message ||error.response?.data?.message || 'Error while adding topic.');
            setAlertVisible(true);
        } finally {
            setLoading(false);
        }
    };

    const handleAlertClose = () => {
        setAlertVisible(false);
    };

    return (
        <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg font-poppins">
            <Alert
                message={alertMessage}
                isVisible={alertVisible}
                onClose={handleAlertClose}
            />
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Add New Topic</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Topic Title */}
                <div>
                    <label className="block text-gray-600 font-medium mb-1" htmlFor="title">
                        Topic Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-green-600"
                    />
                </div>

                {/* Topic Description */}
                <div>
                    <label className="block text-gray-600 font-medium mb-1" htmlFor="description">
                        Topic Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        rows="4"
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-green-600"
                    ></textarea>
                </div>

                {/* PPT Link */}
                <div>
                    <label className="block text-gray-600 font-medium mb-1" htmlFor="pptLink">
                        PPT Link
                    </label>
                    <input
                        type="url"
                        id="pptLink"
                        name="pptLink"
                        value={formData.pptLink}
                        onChange={handleChange}
                        required
                        placeholder="https://example.com/presentation.pptx"
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-green-600"
                    />
                </div>

                {/* Video Link */}
                <div>
                    <label className="block text-gray-600 font-medium mb-1" htmlFor="video">
                        Video Link
                    </label>
                    <input
                        type="url"
                        id="video"
                        name="video"
                        value={formData.video}
                        onChange={handleChange}
                        required
                        placeholder="https://iframe.mediadelivery.net/play/123456/abcde12345"
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-green-600"
                    />
                </div>

                {/* Submit Button */}
                <div>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full text-white font-semibold py-2 rounded-md transition duration-200 ${
                            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-main hover:bg-green-600'
                        }`}
                    >
                        {loading ? 'Adding Topic...' : 'Add Topic'}
                    </button>
                </div>
            </form>
        </div>
    );
}
