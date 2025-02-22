
import React, { createContext, useEffect, useState } from 'react';
import axios from '../auth/axiosConfig'

export const AppContext = createContext();


export const AppProvider = ({ children }) => {
  const [mentors,setMentors] = useState([])
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [isUser, setUser] = useState(false)

  //FETCH ALL COURSE NAMES
  async function fetchCourses() {
    try {
      const res = await axios.get('/api/v1/courses/allCourses');
      setCourses(res.data.allCourses);
    } catch (error) {
      console.log(error);
    }
  }

  //FETCH ALL MENTORS
  const fetchMentors = async () => {
    try {
      const response = await axios.get('/api/v1/mentors/getAllMentors');
      setMentors(response.data.mentors);
      console.log(response)
    } catch (error) {
      console.error('Error fetching mentors:', error);
    }
  };


  const contextValue = {
    courses,
    loading,
    setLoading,
    isUser,
    setUser,
    mentors,



    fetchCourses,
    fetchMentors
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};
