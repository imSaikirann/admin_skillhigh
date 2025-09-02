import axios from '../auth/axiosConfig';

export const fetchPricings = async () => {
  try {

    const response = await axios.get('/api/v2/pricings/pricing', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
   
    return response.data.additional
  } catch (error) {
    console.error('Error removing course access:', error);
    throw error; 
  }
};

