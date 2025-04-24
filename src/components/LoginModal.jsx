import React, { useState } from "react";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";

const LoginModal = ({ isOpen, onClose }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login submission
    console.log("Form data:", formData);
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
        <h3 className="font-bold text-2xl mb-6 text-center">Welcome Back</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              name="email"
              placeholder="name@example.com"
              className="input input-bordered w-full"
              required
              value={formData.email}
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
      className="input input-bordered w-full pr-12" // Increased padding-right
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
              Login
            </button>
          </div>
        </form>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </dialog>
  );
};

export default LoginModal;