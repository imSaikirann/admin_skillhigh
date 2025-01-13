import React from 'react';
import { useLocation, Link, useParams } from 'react-router-dom';

const Breadcrumbs = () => {
    const location = useLocation(); // Get the current location
    const { departmentId, courseId } = useParams(); // Get dynamic params like courseId and departmentId
    const paths = location.pathname.split('/').filter(Boolean); // Split the URL path into parts

    return (
        <nav className="breadcrumb-nav">
            <ul className="breadcrumb-list">
                {/* Home Breadcrumb */}
                <li>
                    <Link to="/">Home</Link>
                </li>

                {/* Dashboard Breadcrumb */}
                {paths.includes('dashboard') && (
                    <li>
                        <Link to="/dashboard">Dashboard</Link>
                    </li>
                )}

                {/* Courses Breadcrumb (only if `departmentId` exists) */}
                {paths.includes('courses') && departmentId && (
                    <li>
                        <Link to={`/dashboard/courses/${departmentId}`}>Courses</Link>
                    </li>
                )}

                {/* Course Breadcrumb (only if `courseId` exists) */}
                {courseId && (
                    <li>
                        Course
                    </li>
                )}
            </ul>
        </nav>
    );
};

export default Breadcrumbs;
