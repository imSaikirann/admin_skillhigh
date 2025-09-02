import axios from '../auth/axiosConfig';


export const fetchSales = async (page, email) => {
  try {
    const response = await axios.get('/api/v2/sales/retired', {
      params: { 
        page, 
        ...(email ? { email } : {}) // only include email if provided
      },
      headers: { 
        Authorization: `Bearer ${localStorage.getItem('token')}` 
      },
    });

    return response.data.additional;
  } catch (error) {
    console.error("Error fetching sales:", error);
    throw error;
  }
};


export const removeCourseAccess = async (userId,courseId) => {
  try {
    console.log(userId,courseId)
    const response = await axios.delete('/api/v2/sales/', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      data: { userId,courseId }, 
    });

    return response.data.message
  } catch (error) {
    console.error('Error removing course access:', error);
    throw error; 
  }
};


export const addNewSale = async ({ email, phoneNumber, courseId, priceId }) => {
  try {

  const response = await axios.post(
  '/api/v2/sales/new-sale',
  {
    email,
    phoneNumber,
    courseId,
    priceId,
  },
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  }
);

    return response.data.additional; // or whatever your backend returns
  } catch (error) {
    console.error('Error removing course access:', error);
    throw error; 
  }
};


export const updateSale = async ({ email, phoneNumber, courseId, priceId }) => {
  try {

  const response = await axios.put(
  '/api/v2/sales/',
  {
    email,
    phoneNumber,
    courseId,
    priceId,
  },
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  }
);

    return response.data.additional; 
  } catch (error) {
    console.error('Error removing course access:', error);
    throw error; 
  }
};

