import axios from '../auth/axiosConfig';


export const getAllUserQuestions = async (userId) => {
    try {
        const response = await axios.get(`/api/v1/courseTopics/topics/all-questions`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })

        return response.data;
    } catch (error) {
        console.log(error)
    }
}

export const verifyUserQuestion = async (questionId) => {
    try {
        const response = await axios.put(
            `/api/v1/admin/topics/questions/verifyQuestion/${questionId}`,
            {}, 
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.log(error);
    }
};

export const deleteUserQuestion = async (questionId) => {
    try {
        const response = await axios.delete(`/api/v1/admin/topics/questions/deleteQuestion/${questionId}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })

        return response.data;
    } catch (error) {
        console.log(error)
    }
}