import React from 'react';
import { Link } from 'react-router-dom';

export const Home = () => {
  // TODO: Build hero section, real-time donation metrics, call to actions
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-extrabold text-emerald-700 mb-4">
        Welcome to ShareMeal
      </h1>
      <p className="text-lg text-gray-600 mb-8 max-w-2xl">
        Connecting surplus food donors with verified NGOs and individuals in need. Together, we eliminate hunger and cut food waste.
      </p>
      <div className="flex gap-4">
        <Link to="/donate" className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-emerald-700">
          Donate Food Now
        </Link>
        <Link to="/find-food" className="bg-gray-100 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200">
          Find Available Food
        </Link>
      </div>
    </div>
  );
};

export default Home;
