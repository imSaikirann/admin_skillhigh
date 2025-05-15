import axios from '../auth/axiosConfig';


export const getAllBounities = async () => {
    try {
        const response = await axios.get(`api/v1/bounties/bounty`, {
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

export const fetchBountySubmissions = async (bountyId) => {
    try {
        const response = await axios.get(`api/v1/bounties/bounty/submissions/${bountyId}`, {
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

export const fetchBountyApplications = async (bountyId) => {
    try {
        const response = await axios.get(`api/v1/bounties/bounty/applications/${bountyId}`, {
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

export const createBounty = async (bountyData) => {
    console.log(bountyData)
    try {
        const response = await axios.post(`api/v1/bounties/bounty`,bountyData, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })

        return response.data
    } catch (error) {
        console.log(error)
    }
}

export const deleteBounty = async (bountyId) => {
    try {
        const response = await axios.delete(`api/v1/bounties/bounty/${bountyId}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
        return response.data
    } catch (error) {
        console.log(error)
    }
}

export const updateBounty = async (bountyId, bountyData) => {
    try {
        const response = await axios.put(`api/v1/bounties/bounty/${bountyId}`, bountyData, {
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

export const verifyBounty = async (state,submissionId,applicationId) => {
    try {
        const response = await axios.put(`api/v1/bounties/verify-bounty/${submissionId}`, {state,applicationId}, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
             withCredentials: true,
        })

        return response.data;
    } catch (error) {
        console.log(error)
    }
}