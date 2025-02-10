import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';
import axios from '../auth/axiosConfig';

const Dashboard = () => {
  const [purchaseData, setPurchaseData] = useState([]);
  const [totalPurchases, setTotalPurchases] = useState(0);
  const [topSellingCourse, setTopSellingCourse] = useState({});
  const [lowestSellingCourse, setLowestSellingCourse] = useState({});
  const [mediumSellingCourse, setMediumSellingCourse] = useState({});

  useEffect(() => {
    async function fetchPurchases() {
      try {
        const res = await axios.get('/api/v1/purchase/getAllPurchases', {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        // Mapping data to have course and purchase count
        const fetchedData = res.data.map((item) => ({
          course: item.courseName,
          purchases: 1,
        }));

        // Aggregating purchases by course
        const aggregatedData = fetchedData.reduce((acc, current) => {
          const existing = acc.find((item) => item.course === current.course);
          if (existing) {
            existing.purchases += 1;
          } else {
            acc.push(current);
          }
          return acc;
        }, []);

        // Calculate total purchases
        const total = aggregatedData.reduce((sum, item) => sum + item.purchases, 0);
        setTotalPurchases(total);
        setPurchaseData(aggregatedData);

        // Sorting data to get the top, lowest, and medium selling courses
        aggregatedData.sort((a, b) => a.purchases - b.purchases);
        
        setTopSellingCourse(aggregatedData[aggregatedData.length - 1]); // Top-selling (max purchases)
        setLowestSellingCourse(aggregatedData[0]); // Lowest-selling (min purchases)
        
        // Medium-selling course (if there is an odd number of courses, it's the middle one, else the average of the two middle ones)
        const middleIndex = Math.floor(aggregatedData.length / 2);
        setMediumSellingCourse(aggregatedData[middleIndex]);
      } catch (error) {
        console.error('Error fetching purchases:', error);
      }
    }

    fetchPurchases();
  }, []);

  return (
    <div className="bg-white dark:bg-darkColor text-white rounded-lg p-6 m-4 font-poppins sm:md-0 md:ml-72 overflow-hidden">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-3xl font-bold text-primary">Admin Dashboard</h1>
       
      </div>

      {/* Total Purchases Box */}
      <div className="bg-gradient-to-r from-green-800 to-teal-500 p-6 rounded-2xl shadow-xl mb-8 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-white">Total Purchases</h3>
          <p className="text-3xl font-bold text-white">{totalPurchases}</p>
        </div>
      </div>

      {/* Cards for Top, Lowest, and Medium Selling Courses */}
      <div className="grid grid-col-1 md:grid-cols-3 gap-6 mb-8">
        {/* Top-selling course */}
        <div className="bg-gradient-to-r from-green-400 to-green-950  p-6 rounded-2xl shadow-xl text-center">
          <h4 className="text-lg font-semibold text-white">Top Selling Course</h4>
          <p className="text-xl font-bold text-white">{topSellingCourse.course}</p>
          <p className="text-sm text-white">{topSellingCourse.purchases} Purchases</p>
        </div>

        {/* Lowest-selling course */}
        <div className="bg-gradient-to-r from-red-400 to-red-950  p-6 rounded-2xl shadow-xl text-center">
          <h4 className="text-lg font-semibold text-white">Lowest Selling Course</h4>
          <p className="text-xl font-bold text-white">{lowestSellingCourse.course}</p>
          <p className="text-sm text-white">{lowestSellingCourse.purchases} Purchases</p>
        </div>

        {/* Medium-selling course */}
        <div className="bg-gradient-to-r from-blue-400 to-blue-950 p-6 rounded-2xl  shadow-xl text-center">
          <h4 className="text-lg font-semibold text-white">Medium Selling Course</h4>
          <p className="text-xl font-bold text-white">{mediumSellingCourse.course}</p>
          <p className="text-sm text-white">{mediumSellingCourse.purchases} Purchases</p>
        </div>
      </div>

      {/* Course Purchases Bar Chart */}
      <h2 className="text-2xl font-semibold text-primary mb-6">Course Purchases</h2>
      <div className="bg-white dark:bg-darkBg p-6 rounded-lg shadow-xl mb-8">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={purchaseData}>
            <CartesianGrid strokeDasharray="3 3" />
            {/* X-Axis */}
            <XAxis dataKey="course" tick={{ fontSize: 12, fontWeight: 'bold' }} />
            {/* Y-Axis */}
            <YAxis tick={{ fontSize: 12, fontWeight: 'bold' }} />
            {/* Tooltip formatter */}
            <Tooltip 
              content={({ payload }) => {
                if (payload && payload.length > 0) {
                  const { course, purchases } = payload[0].payload;
                  return (
                    <div className="custom-tooltip text-darkColor dark:text-white bg-gray-50 dark:bg-darkColor p-3 rounded-lg">
                      <p className="label">{course}</p>
                      <p className="desc">{`${purchases} Purchases`}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
            <Bar dataKey="purchases" fill="#0D8267" barSize={30} radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
