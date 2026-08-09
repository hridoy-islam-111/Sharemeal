import React from 'react';

export const PostFood = () => {
  // TODO: Render form for posting new surplus food (title, quantity, expiry, images, location)
  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Post Surplus Food</h1>
      <p className="text-gray-600 mb-6">Fill in details about the food surplus you wish to donate.</p>
    </div>
  );
};

export default PostFood;
