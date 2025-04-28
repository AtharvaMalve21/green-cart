import React, { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { UserContext } from "../context/UserContext.jsx";

const Signup = () => {
  const { setIsLoggedIn } = useContext(UserContext);

  const URI = import.meta.env.VITE_BACKEND_URI;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    gender: "",
    profilePic: "",
    phone: "",
    role: "",
    city: "",
    country: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const navigate = useNavigate();

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleChange = (ev) => {
    const { name, value } = ev.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, profilePic: file });
    setPreviewImage(URL.createObjectURL(file));
  };

  const signupUserAccount = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });

      const response = await axios.post(URI + "/api/user/signup", data, {
        headers: {
          "Content-Type": "multi-part/form-data",
        },
        withCredentials: true,
      });

      if (response.data.success) {
        setIsLoggedIn(true);
        toast.success(response.data.message);
        navigate("/");
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error.response?.data.message);
    }
  };

  return (
    <div className="h-[calc(100vh-80px)] bg-gradient-to-r from-blue-50 via-white to-blue-100 flex items-center justify-center bg-gray-50 px-6 py-12">
      <form
        onSubmit={signupUserAccount}
        className="w-full max-w-3xl bg-white p-8 rounded-xl shadow-md space-y-6"
      >
        <h1 className="text-2xl font-bold text-center">Create an Account</h1>

        {/* Profile Pic Upload */}
        <div className="flex justify-center">
          <label htmlFor="profilePic" className="cursor-pointer relative group">
            {previewImage ? (
              <img
                src={previewImage}
                alt="Preview"
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <UserCircleIcon className="w-20 h-20 text-gray-400" />
            )}
            <input
              type="file"
              id="profilePic"
              name="profilePic"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                required
              />
              <button
                type="button"
                onClick={toggleShowPassword}
                className="absolute top-2 right-3 text-sm text-gray-500"
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium">Phone</label>
            <input
              type="number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Country</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            >
              <option value="">Select Role</option>
              <option value="User">User</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <div className="flex gap-4 items-center">
            <label className="font-medium">Gender:</label>
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="gender"
                value="Male"
                checked={formData.gender === "Male"}
                onChange={handleChange}
              />
              Male
            </label>
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="gender"
                value="Female"
                checked={formData.gender === "Female"}
                onChange={handleChange}
              />
              Female
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
        >
          Sign Up
        </button>

        <p className="text-center text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 hover:underline">
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
