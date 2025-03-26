import React from "react";
import { motion } from "framer-motion";

const Forecast = ({ forecast, loading }) => {
  const skeletonCards = Array(5).fill(0);

  if (loading) {
    return (
      <div className="mt-10">
        <h3 className="text-2xl font-bold mb-6 text-center text-blue-700 dark:text-blue-300">
          📅 5-Day Forecast
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
          {skeletonCards.map((_, index) => (
            <div
              key={index}
              className="bg-gray-200 dark:bg-gray-700 animate-pulse rounded-xl p-4 h-48"
            >
              <div className="h-4 w-3/4 bg-gray-300 dark:bg-gray-600 mb-4 rounded"></div>
              <div className="h-12 w-12 mx-auto bg-gray-300 dark:bg-gray-600 rounded-full mb-3"></div>
              <div className="h-3 w-2/3 bg-gray-300 dark:bg-gray-600 mx-auto rounded"></div>
              <div className="h-4 w-1/2 bg-gray-300 dark:bg-gray-600 mt-3 mx-auto rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="mt-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-2xl font-bold mb-6 text-center text-blue-700 dark:text-blue-300">
        📅 5-Day Forecast
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
        {forecast.map((day, index) => (
          <motion.div
            key={index}
            className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 shadow-md hover:shadow-xl transition duration-300 rounded-2xl p-4 text-center border border-gray-200 dark:border-gray-700"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">
              {day.date}
            </p>
            <img
              src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
              alt={day.description}
              className="mx-auto w-16 h-16"
            />
            <p className="capitalize text-sm text-gray-600 dark:text-gray-300">
              {day.description}
            </p>
            <p className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-2">
              {day.avgTemp}°C
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Forecast;
