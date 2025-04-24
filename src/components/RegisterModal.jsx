import React, { useState } from "react";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";

const RegisterModal = ({ isOpen, onClose }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    gender: "",
    job: "",
    password: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Registration successful!");
    onClose();
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <dialog className={`modal ${isOpen ? 'modal-open' : ''} sm:modal-middle`}>
      <div className="modal-box max-w-md">
        <h3 className="font-bold text-2xl mb-6 text-center">Create Your Account</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Full Name</span>
            </label>
            <input
              type="text"
              name="fullName"
              placeholder="John Doe"
              className="input input-bordered w-full"
              required
              value={formData.fullName}
              onChange={handleChange}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Gender</span>
            </label>
            <select
              name="gender"
              className="select select-bordered w-full"
              required
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Job Title</span>
            </label>
            <input
              type="text"
              name="job"
              placeholder="Software Developer"
              className="input input-bordered w-full"
              required
              value={formData.job}
              onChange={handleChange}
            />
          </div>

          <div className="form-control relative">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                className="input input-bordered w-full pr-12"
                required
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-2 top-1/2 -translate-y-1/2 btn btn-ghost btn-sm p-1 hover:bg-transparent z-10"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOutlined className="text-lg text-gray-500" />
                ) : (
                  <EyeInvisibleOutlined className="text-lg text-gray-500" />
                )}
              </button>
            </div>
          </div>

          <div className="modal-action mt-6">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Register
            </button>
          </div>
        </form>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </dialog>
  );
};

export default RegisterModal;