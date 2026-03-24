import React, { useState } from "react";
import { toast } from "react-toastify";
import { setNewPasswordApi } from "../../api/Authapi";
import { useLocation, useNavigate } from "react-router-dom";
import { RiEyeCloseFill } from "react-icons/ri";
import { FaEye } from "react-icons/fa";

const ResetPassword = () => {
  const location = useLocation(); // get current URL
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get("email"); // "devireddyamani17@gmail.com"
  const [isLoading, setIsLoading] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showpassword, setShowpassword] = useState("");

  const handleResetPassword = async () => {
    if (!newPassword) {
      toast.error("Please enter a password");
      return;
    }
    setIsLoading(true);
    try {
      
      const response = await setNewPasswordApi({email,password: newPassword } );
      if (response.data.success) {
        toast.success(response.data.message || "Password updated succesfully!");
        navigate("/");
      } else {
        toast.error(response.data.message || "Something went wrong");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong ,,,,,,,,,,,,,,,,,,");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-6">
        <div className="flex justify-center">
          <img src="/assets/Logo.png" className="w-[150px] h-[100px] mb-5" />
        </div>
        <h2 className="text-xl font-bold text-center mb-4 text-[#121212] uppercase tracking-wider">
          Set New Password
        </h2>
        <div className="mb-3">
          <label className="text-sm block mb-1">Email</label>
          <input
            type="text"
            value={email}
            readOnly
            className="w-full border rounded p-2 text-sm"
          />
        </div>

        <div className="mb-3 relative">
          <label className="text-sm block mb-1">New Password</label>
          <input
            type={showpassword ? "text":"password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border rounded p-2 text-sm"
          />
          {showpassword ? (
            <FaEye
              className="w-[20px] h-[20px] text-[#121212] absolute right-2 top-[38px]"
              onClick={() => setShowpassword(false)}
            />
          ) : (
            <RiEyeCloseFill
              className="w-[20px] h-[20px] text-[#121212] absolute right-2 top-[38px]"
              onClick={() => setShowpassword(true)}
            />
          )}
        </div>

        <button
          onClick={handleResetPassword}
          disabled={isLoading}
          className="w-full mt-4 bg-[#FFD54F] text-[#121212] font-bold py-2 rounded border border-[#121212] hover:brightness-110 disabled:opacity-50"
        >
          {isLoading ? "Updating..." : "Reset Password"}
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;
