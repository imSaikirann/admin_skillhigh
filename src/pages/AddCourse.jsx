import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../auth/axiosConfig';
import { AppContext } from '../store/StoreContext';
import Alert from '../components/Alert';
import {useNavigateToBack} from '../utils/navigateUtils'


export default function AddCourse() {
    const { fetchCourses,   } = useContext(AppContext);
    const { departmentId } = useParams();
    const [loading,setLoading] = useState(false)
    const [formData, setFormData] = useState({
        courseName: '',
        courseDescription: '',
        courseCount: '',
        image: null,
        departmentId: '',
    });
   const redirectToBack = useNavigateToBack()

    const [imageName, setImageName] = useState('');
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            setFormData({ ...formData, [name]: files[0] });
            setImageName(files[0].name);
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
   // Set loading to true right before starting the API request
   setLoading(true);
        const formDataToSend = new FormData();
        formDataToSend.append('courseName', formData.courseName);
        formDataToSend.append('courseDescription', formData.courseDescription);
        formDataToSend.append('courseCount', formData.courseCount);
    
        formDataToSend.append('departmentId', departmentId);
        if (formData.image) {
            formDataToSend.append('courseThumbnail', formData.image);
        }
        try {
           
            const response = await axios.post('/api/v1/courses/addNewCourse', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setAlertMessage(response.data.message);
            setAlertVisible(true);

            // Reset the form data
            setFormData({
                courseName: '',
                courseDescription: '',
                courseCount: '',
           
                image: null,
                departmentId: '', 
            });
            setImageName('');

            fetchCourses();
        } catch (error) {
       
            setAlertMessage(error.response?.data?.message || "Error while adding course.");
            setAlertVisible(true);
        } finally {
            setLoading(false);
        }
    };

   

    const handleAlertClose = () => {
        setAlertVisible(false);
    };

    return (
        <div className='p-8 sm:pl-72 font-poppins'>
               {/* Header Section */}
         <div className="flex items-center justify-between mb-6">
                <button
                    className="bg-main px-6 py-3 text-white rounded-md font-medium hover:underline flex items-center"
                    onClick={() => redirectToBack()} 
                >
                     Back
                </button>
               
            </div>
            <div className="max-w-2xl mx-auto p-8 bg-white text-darkColor  dark:bg-darkColor dark:text-white border dark:border-darkColor rounded-lg font-poppins h-screen">
            <Alert
                message={alertMessage}
                isVisible={alertVisible}
                onClose={handleAlertClose}
            />

         
            <h2 className="text-2xl font-semibold mb-6 ">Add New Course</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              
                {/* Course Title */}
                <div>
                    <label className="block  font-medium mb-1" htmlFor="courseName">
                        Course Title
                    </label>
                    <input
                        type="text"
                        id="courseName"
                        name="courseName"
                        value={formData.courseName}
                        onChange={handleChange}
                        required
                        className="w-full  border-darkColor bg-white dark:bg-darkBg dark:text-white px-4 py-2 border rounded-md focus:outline-none focus:border-green-600"
                    />
                </div>

                {/* Course Description */}
                <div>
                    <label className="block  font-medium mb-1" htmlFor="courseDescription">
                        Course Description
                    </label>
                    <textarea
                        id="courseDescription"
                        name="courseDescription"
                        value={formData.courseDescription}
                        onChange={handleChange}
                        required
                        rows="4"
                        className="w-full  border-darkColor bg-white dark:bg-darkBg dark:text-white  px-4 py-2 border rounded-md focus:outline-none focus:border-green-600"
                    ></textarea>
                </div>


                {/* Number of Lessons */}
                <div>
                    <label className="block  font-medium mb-1" htmlFor="courseCount">
                        Number of Lessons
                    </label>
                    <input
                        type="number"
                        id="courseCount"
                        name="courseCount"
                        value={formData.courseCount}
                        onChange={handleChange}
                        required
                        className="w-full  border-darkColor bg-white dark:bg-darkBg dark:text-white  px-4 py-2 border rounded-md focus:outline-none focus:border-green-600"
                    />
                </div>

                {/* Image Upload */}
                <div>
                    <label className="block  font-medium mb-1">Upload Course Image</label>
                    <div className="flex items-center justify-center w-full">
                        <label
                            htmlFor="image"
                            className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer bg-green-100 border-gray-300 hover:bg-green-200 transition duration-200"
                        >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <p className="mb-2 text-sm text-black">
                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs text-black">JPEG, PNG (Max 1GB)</p>
                            </div>
                            <input
                                id="image"
                                type="file"
                                name="image"
                                accept="image/*"
                                onChange={handleChange}
                                className="hidden"
                            />
                        </label>
                        {imageName && (
                            <div className="ml-4 mt-2">
                                <p className="text-sm text-gray-600">
                                    Selected File: <span className="font-semibold">{imageName}</span>
                                </p>
                                <p className="text-xs text-gray-500">Make sure it's the correct file.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Submit Button */}
                <div>
                    <button
                    disabled={loading}
                        type="submit"
                        className="w-full bg-main text-white font-semibold py-2 rounded-md transition duration-200 hover:bg-green-600"
                    >
                        {loading ? "Adding Course..." : "Add course"}
                    </button>
                </div>
            </form>
        </div>
        </div>
      
    );
}
