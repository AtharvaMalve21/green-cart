import React, { useContext } from "react";
import { UserContext } from "../context/UserContext.jsx";
import { EnvelopeIcon, UserCircleIcon } from "@heroicons/react/24/outline";

const MyProfile = () => {
  const { user } = useContext(UserContext);

  // Get first letter of user's name
  const getInitial = (name) => {
    return name?.charAt(0)?.toUpperCase() || "?";
  };

  return (
    <div className="h-[calc(100vh-80px)] bg-gradient-to-r from-blue-50 via-white to-blue-100 flex items-center justify-center px-4 py-12">
      {user && (
        <div className="bg-white shadow-xl rounded-2xl p-10 max-w-md w-full text-center">
          {/* Gradient Initial Circle */}
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-500 to-blue-400 text-white flex items-center justify-center text-4xl font-bold mx-auto mb-4 shadow-md">
            {getInitial(user.name)}
          </div>

          {/* Name */}
          <h2 className="text-2xl font-semibold text-gray-800 mb-1 flex items-center justify-center gap-2">
            <UserCircleIcon className="w-6 h-6 text-indigo-500" />
            {user.name}
          </h2>

          {/* Email */}
          <p className="text-gray-600 text-sm flex items-center justify-center gap-2 mt-1">
            <EnvelopeIcon className="w-5 h-5 text-indigo-500" />
            {user.email}
          </p>
        </div>
      )}
    </div>
  );
};

export default MyProfile;
