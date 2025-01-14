import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import axios from '../auth/axiosConfig';

const Dashboard = ({ userCount = 500 }) => {
  const [purchaseData, setPurchaseData] = useState([]);
  const [totalPurchases, setTotalPurchases] = useState(0);

  useEffect(() => {
    async function fetchPurchases() {
      try {
        const res = await axios.get('/api/v1/purchase/getAllPurchases',{
          headers: { "Content-Type": "multipart/form-data","Authorization": `Bearer ${localStorage.getItem('token')}`, },
          
        });
        const fetchedData = res.data.map((item) => ({
          course: item.courseName,
          purchases: 1, // Default to 1 purchase per record unless aggregation is handled server-side
        }));

        // Aggregate purchases by course
        const aggregatedData = fetchedData.reduce((acc, current) => {
          const existing = acc.find((item) => item.course === current.course);
          if (existing) {
            existing.purchases += 1;
          } else {
            acc.push(current);
          }
          return acc;
        }, []);

        const total = aggregatedData.reduce((sum, item) => sum + item.purchases, 0);
        setTotalPurchases(total);
        setPurchaseData(aggregatedData);
      } catch (error) {
        console.error('Error fetching purchases:', error);
      }
    }

    fetchPurchases();
  }, []);

  return (
    <div className="bg-white rounded-lg p-6 m-4 font-poppins sm:md-0 md:ml-80">
      {/* Users Box
      <div className="flex items-center justify-between bg-green-100 rounded-lg p-4 mb-8 shadow-md">
        <h3 className="text-lg font-semibold text-green-700">Total Users</h3>
        <span className="text-3xl font-bold text-green-700">{purchaseData.length}</span>
      </div> */}
      <h1>Working one it</h1>

      {/* Total Purchases Box */}
      <div className="flex items-center justify-between bg-green-50 rounded-lg p-4 mb-8 shadow-md">
        <h3 className="text-lg font-semibold text-main">Total Purchases</h3>
        <span className="text-3xl font-bold text-main">{totalPurchases}</span>
      </div>

      {/* Course Purchases Chart */}
      <h2 className="text-2xl font-semibold text-primary mb-4">Course Purchases</h2>
      <ResponsiveContainer width="100%" height={560}>
        <BarChart data={purchaseData} layout="vertical" margin={{ left: 30, right: 30 }}>
          <XAxis type="number" />
          <YAxis
            dataKey="course"
            type="category"
            width={200}
            tick={{ fontSize: 14, fill: '#0D8267' }} // Custom color for Y-axis labels
          />
          <Tooltip formatter={(value) => [value, "Purchases"]} />
          <Legend />
          <Bar
            dataKey="purchases"
            fill="url(#primaryGradient)"
            name="Purchases"
            label={{ position: 'right', fill: '#0D8267', fontSize: 14, fontWeight: 'bold' }} // Highlight purchase numbers
          />
          <defs>
            {/* Gradient color fill for bars */}
            <linearGradient id="primaryGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#0D8267" />
              <stop offset="100%" stopColor="#0D8267" />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Dashboard;
