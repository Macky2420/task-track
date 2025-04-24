import React, { useState } from "react";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { auth, database } from "../database/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set } from "firebase/database";
import { useNavigate } from "react-router-dom";

const RegisterModal = ({ isOpen, onClose }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    gender: "",
    job: "",
    password: ""
  });

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (formData.fullName.length < 3) {
      newErrors.fullName = "Name must be at least 3 characters";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }

    if (!formData.gender) {
      newErrors.gender = "Please select a gender";
    }

    if (!formData.job.trim()) {
      newErrors.job = "Job title is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ ...toast, show: false }), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      await set(ref(database, `users/${userCredential.user.uid}`), {
        fullName: formData.fullName,
        email: formData.email,
        gender: formData.gender,
        job: formData.job,
        createdAt: new Date().toISOString()
      });

      showToast("Registration successful!");
      onClose();
      navigate(`/home/${userCredential.user.uid}`);
    } catch (error) {
      // ... existing error handling
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors(prev => ({ ...prev, [e.target.name]: "" }));
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <dialog className={`modal ${isOpen ? 'modal-open' : ''} sm:modal-middle`}>
      <div className="modal-box max-w-md">
        {/* Toast Notification */}
        {toast.show && (
          <div className={`toast toast-top toast-end`}>
            <div className={`alert alert-${toast.type}`}>
              <span>{toast.message}</span>
            </div>
          </div>
        )}

        <h3 className="font-bold text-2xl mb-6 text-center">Create Your Account</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          {/* Full Name Input */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Full Name</span>
            </label>
            <input
              type="text"
              name="fullName"
              placeholder="John Doe"
              className={`input input-bordered w-full ${errors.fullName ? 'input-error' : ''}`}
              value={formData.fullName}
              onChange={handleChange}
            />
            {errors.fullName && (
              <label className="label">
                <span className="label-text-alt text-red-500">{errors.fullName}</span>
              </label>
            )}
          </div>

          {/* Email Input */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              name="email"
              placeholder="name@example.com"
              className={`input input-bordered w-full ${errors.email ? 'input-error' : ''}`}
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && (
              <label className="label">
                <span className="label-text-alt text-red-500">{errors.email}</span>
              </label>
            )}
          </div>

          {/* Gender Select */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Gender</span>
            </label>
            <select
              name="gender"
              className={`select select-bordered w-full ${errors.gender ? 'select-error' : ''}`}
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {errors.gender && (
              <label className="label">
                <span className="label-text-alt text-red-500">{errors.gender}</span>
              </label>
            )}
          </div>

          {/* Job Title Input */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Job Title</span>
            </label>
            <input
              type="text"
              name="job"
              placeholder="Software Developer"
              className={`input input-bordered w-full ${errors.job ? 'input-error' : ''}`}
              value={formData.job}
              onChange={handleChange}
            />
            {errors.job && (
              <label className="label">
                <span className="label-text-alt text-red-500">{errors.job}</span>
              </label>
            )}
          </div>

          {/* Password Input */}
          <div className="form-control relative">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                className={`input input-bordered w-full pr-12 ${errors.password ? 'input-error' : ''}`}
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
            {errors.password && (
              <label className="label">
                <span className="label-text-alt text-red-500">{errors.password}</span>
              </label>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="modal-action mt-6">
            <button 
              type="button" 
              className="btn btn-ghost" 
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-spinner"></span>
              ) : (
                "Register"
              )}
            </button>
          </div>
        </form>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </dialog>
  );
};

export default RegisterModal;