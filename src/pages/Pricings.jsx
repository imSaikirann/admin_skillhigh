import React, { useState, useEffect } from 'react';
import axios from '../auth/axiosConfig';
import Alert from '../components/Alert';

export default function Pricings() {
  const [newPrice, setNewPrice] = useState('');
  const [newName, setNewName] = useState('');
  const [pricingPlans, setPricingPlans] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [features, setFeatures] = useState([]);
  const [featureName, setFeatureName] = useState('');
  const [isIncluded, setIsIncluded] = useState(false);
  const [showAddPricingModal, setShowAddPricingModal] = useState(false); // State to control "Add Pricing" modal

  useEffect(() => {
    async function fetchPlans() {
      try {
        const res = await axios.get('/api/v1/pricings/allPricings');
        if (res.data.success) {
          setPricingPlans(res.data.allpricings);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchPlans();
  }, []);

  const openFeaturesModal = async (plan) => {
    setSelectedPlan(plan);
    try {
      const res = await axios.get(`/api/v1/pricings/features/${plan.pricingId}`);
      if (res.data.success) {
        setFeatures(res.data.features);
      }
      setShowModal(true);
    } catch (error) {
      console.log('Error fetching features:', error);
    }
  };

  const addFeature = async () => {
    if (!featureName) return;

    const newFeature = { name: featureName, isIncluded };
    try {
      const res = await axios.post(
        `/api/v1/pricings/addPricingFeatures/${selectedPlan.pricingId}`,
        newFeature
      );
      conssole.log(res)
      if (res.data.success) {
        // Refresh the features list after adding a new feature
        const updatedFeatures = await axios.get(`/api/v1/pricings/features/${selectedPlan.pricingId}`);
        if (updatedFeatures.data.success) {
          setFeatures(updatedFeatures.data.features); // Update the features list
        }
        setFeatureName('');
        setIsIncluded(false);
      }
    } catch (error) {
      console.log('Error adding feature:', error);
    }
  };

  // Function to handle adding a new pricing plan
  const addPricingPlan = async () => {
    if (!newName || !newPrice) return;

    const newPlan = {
      name: newName,
      price: parseInt(newPrice)
    };

    try {
      const res = await axios.post('/api/v1/pricings/addPricing', newPlan);
      if (res.data.success) {
        // After adding, refresh the pricing plans
        const updatedPlans = await axios.get('/api/v1/pricings/allPricings');
        if (updatedPlans.data.success) {
          setPricingPlans(updatedPlans.data.allpricings); // Update the pricing list
        }
        setNewName('');
        setNewPrice('');
        setShowAddPricingModal(false); // Close the modal
      }
    } catch (error) {
      console.log('Error adding pricing plan:', error);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto font-poppins h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">Pricing List</h1>

      {/* Button to add a new pricing plan */}
      <button
        onClick={() => setShowAddPricingModal(true)}
        className="bg-green-600 text-white px-4 py-2 rounded-lg mb-6 hover:bg-green-700"
      >
        Add New Pricing Plan
      </button>

      {/* Modal for adding a new pricing plan */}
      {showAddPricingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center ">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-2xl font-bold mb-4">Add New Pricing Plan</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Plan Name</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full border px-3 py-2 rounded-lg mb-2"
                placeholder="Enter plan name"
              />
              <label className="block text-sm font-medium mb-1">Price</label>
              <input
                type="number"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                className="w-full border px-3 py-2 rounded-lg mb-2"
                placeholder="Enter price"
              />
            </div>
            <div className="flex justify-between mt-4">
              <button
                onClick={() => setShowAddPricingModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={addPricingPlan}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                Add Plan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pricing Plans Display */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {pricingPlans.map((plan) => (
          <div
            key={plan.pricingId}
            className="p-4 border rounded-lg shadow-md bg-white text-center"
          >
            <h2 className="text-xl font-semibold">{plan.pricingName}</h2>
            <p className="text-lg font-medium text-gray-700 mt-2">
              ₹{plan.price}
            </p>
            <button
              onClick={() => openFeaturesModal(plan)}
              className="bg-blue-600 text-white px-3 py-2 rounded-lg mt-4 hover:bg-blue-700"
            >
              Manage Features
            </button>
          </div>
        ))}
      </div>

      {showModal && selectedPlan && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-11/12 sm:w-3/4 md:max-w-md max-h-screen overflow-auto">
      <h2 className="text-2xl font-bold mb-4">
        Features for {selectedPlan.pricingName}
      </h2>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">
          Add New Feature
        </label>
        <input
          type="text"
          value={featureName}
          onChange={(e) => setFeatureName(e.target.value)}
          className="w-full border px-3 py-2 rounded-lg mb-2"
          placeholder="Feature name"
        />
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            checked={isIncluded}
            onChange={(e) => setIsIncluded(e.target.checked)}
            className="mr-2"
          />
          <label>Included in this pricing</label>
        </div>
        <button
          onClick={addFeature}
          className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700"
        >
          Add Feature
        </button>
      </div>
      <h3 className="text-lg font-semibold mb-2">Existing Features</h3>
      <ul>
        {features.map((feature) => (
          <li
            key={feature.id}
            className="border-b py-2 flex justify-between items-center"
          >
            <span>{feature?.name || 'Unnamed Feature'}</span>
            <span
              className={`text-sm px-2 py-1 rounded ${
                feature.isIncluded
                  ? 'bg-green-200 text-green-800'
                  : 'bg-red-200 text-red-800'
              }`}
            >
              {feature.isIncluded ? 'Included' : 'Not Included'}
            </span>
            <button className="bg-green-800 text-white px-3 py-2 rounded hover:bg-green-900">
              Edit
            </button>
          </li>
        ))}
      </ul>

      <div className="flex justify-end mt-4">
        <button
          onClick={() => setShowModal(false)}
          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}
