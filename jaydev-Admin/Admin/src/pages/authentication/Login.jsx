import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { RiEyeCloseFill } from "react-icons/ri";
import { FaEye } from "react-icons/fa";
import { toast } from "react-toastify";
import {  sendResetPasswordEmail } from "../../api/Authapi";




const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { handleLogin, } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const [showpassword,setShowpassword]=useState(false);
  const [forgetPasswordModal,setForgetPasswordModal]=useState(false);
  const navigate = useNavigate();
  const [email,setEmail]=useState("")
const[isSending,setIsSending]=useState(false)

      useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      navigate("/dashboard", { replace: true });
    }
  }, [])



  const handleSubmit = async (e)=>{
    e.preventDefault();
    setLoading(true)
    const success= await handleLogin(formData);
    setLoading(false)
    if(success){
      navigate('/dashboard')
    }
  }

  const openResetModal = () => {
  setEmail(formData.email || ""); // Prefill using auth email
  setForgetPasswordModal(true);
};


  const handleForgetPassword = async ()=>{
    if(!email){
      toast.error("email is required")
      return;
    }
    setIsSending(true);

    try{
      const token =sessionStorage.getItem("token");
      const response = await sendResetPasswordEmail({email},token)
      if(response?.data.success){
        toast.success(response.data.message || "Reset link sent to your email");
        setForgetPasswordModal(false);
      }else{
        toast.error(response?.data.message || "Failed to send reset Link ")
      }
    }catch(error){
      toast.error(error?.repsonse?.data?.message || "Something went wrong")
    }finally{
      setIsSending(false)
    }
  }

  return (
    <>
      <div className="w-auto bg-[url('/assets/bgImage-1.jpg')] h-screen bg-center bg-cover bg-no-repeat">
        <div className="max-w-[1440px] mx-auto p-[120px]">
          <div className=" flex justify-center items-center h-full ">
            <form
              onSubmit={handleSubmit}
              className="bg-[#121212] px-[32px] py-[64px] rounded-lg shadow-2xl border border-white/10 space-y-5 w-full max-w-[500px] text-white"
            >
              <h2 className="text-[32px] font-bold text-center text-[#FFD54F]">Admin Login</h2>

              {/* Email Field */}
              <div className="flex flex-col">
                <label className="text-[20px] font-medium mb-1">Email</label>
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={formData.email}
                  className="border border-gray-300 p-2 rounded focus:outline-none focus:ring focus:ring-blue-300"
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>

              {/* Password Field */}
              <div className="relative">
              <div className="flex flex-col ">
                <label className="text-[20px] font-medium mb-1">Password</label>
                <input
                  type={showpassword ?"text" :"password"}
                  value={formData.password}
                  required
                  placeholder="Enter your password"
                  className="border border-gray-300 p-2 bg-none rounded focus:outline-none focus:ring focus:ring-blue-300"
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
                {
                  showpassword ?(
                    <FaEye className="w-[24px] h-[24px] text-white absolute right-2 top-1/2 -translate-y-[1/2]"
                    onClick={()=>setShowpassword(false)}
                    />

                  ):(
                    <RiEyeCloseFill className="w-[24px] h-[24px] text-white absolute right-2 top-1/2 -translate-y-[1/2]"
                    onClick={()=>setShowpassword(true)}
                    />

                  )
                }
                
                

              </div>
              </div>
              <div className="flex items-center justify-center mt-6 text-[16px] font-semibold"
                onClick={openResetModal}
                >
                <p>Forget Password ?</p>
                </div>

              {/* Submit Button */}
              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#FFD54F] text-[18px] text-[#121212] font-bold px-[64px] py-3 rounded-lg hover:brightness-110 transition w-fit "
                >
                 {loading ? "Logging in..." : "Login"}
                </button>
              </div>
            </form>

             {forgetPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md bg-white rounded-xl p-6 shadow-xl">
            <h3 className="text-lg font-semibold mb-4 text-center text-[#FFD54F]">
              Reset Password
            </h3>

            <div className="mb-4">
              <label className="block text-sm mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                name="email"
                readOnly 
                className="w-full border rounded p-2 text-sm"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setForgetPasswordModal(false)}
                className="px-4 py-2 rounded bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleForgetPassword}
                disabled={isSending}
                className="px-4 py-2 rounded bg-[#FFD54F] text-[#121212] font-bold disabled:opacity-50"
              >
                {isSending ? "Sending..." : "Reset"}
              </button>
            </div>
          </div>
        </div>
      )}

            
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
