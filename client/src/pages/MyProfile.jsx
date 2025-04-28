import React, { useContext } from "react";
import { UserContext } from "../context/UserContext.jsx";
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  GlobeAltIcon,
  UserCircleIcon,
  ClipboardDocumentListIcon,
  IdentificationIcon,
} from "@heroicons/react/24/outline";

const MyProfile = () => {
  const { user } = useContext(UserContext);
  const URI = import.meta.env.VITE_BACKEND_URI;

  return (
    <div className="h-[calc(100vh-80px)] bg-gradient-to-r from-blue-50 via-white to-blue-100 bg-gray-50 flex items-center justify-center px-4 py-12">
      {user && (
        <div className="bg-white shadow-lg rounded-xl p-8 max-w-3xl w-full">
          <div className="flex flex-col items-center mb-8">
            <img
              src={`${URI}/${user.profilePic}`}
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover border-4 border-indigo-500"
            />
            <h2 className="mt-4 text-2xl font-bold text-gray-800">
              {user.name}
            </h2>
            <p className="text-indigo-600 text-sm">{user.role}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700 text-sm">
            {/* Email */}
            <div className="flex items-start gap-3">
              <EnvelopeIcon className="w-5 h-5 mt-1 text-indigo-500" />
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p>{user.email}</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-3">
              <PhoneIcon className="w-5 h-5 mt-1 text-indigo-500" />
              <div>
                <p className="text-xs text-gray-500">Phone Number</p>
                <p>{user.phone}</p>
              </div>
            </div>

            {/* City */}
            <div className="flex items-start gap-3">
              <MapPinIcon className="w-5 h-5 mt-1 text-indigo-500" />
              <div>
                <p className="text-xs text-gray-500">City</p>
                <p>{user.city}</p>
              </div>
            </div>

            {/* Country */}
            <div className="flex items-start gap-3">
              <GlobeAltIcon className="w-5 h-5 mt-1 text-indigo-500" />
              <div>
                <p className="text-xs text-gray-500">Country</p>
                <p>{user.country}</p>
              </div>
            </div>

            {/* Gender */}
            <div className="flex items-start gap-3">
              <IdentificationIcon className="w-5 h-5 mt-1 text-indigo-500" />
              <div>
                <p className="text-xs text-gray-500">Gender</p>
                <p>{user.gender}</p>
              </div>
            </div>

            {/* Orders */}
            <div className="flex items-start gap-3">
              <ClipboardDocumentListIcon className="w-5 h-5 mt-1 text-indigo-500" />
              <div>
                <p className="text-xs text-gray-500">My Orders</p>
                <p>5</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProfile;
