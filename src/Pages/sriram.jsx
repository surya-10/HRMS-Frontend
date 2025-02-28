import React, { useState } from "react";
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import { motion } from "framer-motion";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-600 to-blue-500">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md"
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          {isLogin ? "Login" : "Sign Up"}
        </h2>

        {/* Username/Email Field */}
        <div className="flex items-center mb-4 bg-gray-100 rounded-lg p-3">
          {isLogin ? (
            <FaUser className="text-gray-500" />
          ) : (
            <FaEnvelope className="text-gray-500" />
          )}
          <input
            type={isLogin ? "text" : "email"}
            placeholder={isLogin ? "Username" : "Email"}
            className="ml-2 bg-transparent outline-none w-full"
          />
        </div>

        {/* Password Field */}
        <div className="flex items-center mb-6 bg-gray-100 rounded-lg p-3">
          <FaLock className="text-gray-500" />
          <input
            type="password"
            placeholder="Password"
            className="ml-2 bg-transparent outline-none w-full"
          />
        </div>

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white py-2 rounded-lg font-semibold hover:shadow-lg transition-shadow"
        >
          {isLogin ? "Login" : "Sign Up"}
        </motion.button>

        {/* Toggle Form Text */}
        <p className="text-center mt-4 text-gray-600">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span
            onClick={toggleForm}
            className="text-purple-600 cursor-pointer hover:underline"
          >
            {isLogin ? "Sign Up" : "Login"}
          </span>
        </p>
      </motion.div>
    </div>
  );
};

export default AuthPage;