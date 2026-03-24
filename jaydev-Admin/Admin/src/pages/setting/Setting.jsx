import React, { useState, useContext, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import {
  changePassword,
  profilePicUpdate,
  updateAdminProfile,
} from "../../api/Authapi";
import { AuthContext } from "../../context/AuthContext";
import { RiEyeCloseFill } from "react-icons/ri";
import { BsFillEyeFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

const Setting = () => {
  const { auth, setAuth, fetchAdminData } = useContext(AuthContext);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [editData, setEditData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [profileImage, setProfileImage] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const fileInputRef = useRef(null);
  const [isSavingBasic, setIsSavingBasic] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [oldpassword, setOldpassword] = useState("");
  const [newpassword, setNewpassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (auth) {
      setFirstname(auth.firstname || "");
      setLastname(auth.lastname || "");
      setEmail(auth.email || "");
      setPhone(auth.phone || "");
      setProfileImage(auth.profileUrl || '/assets/profiledefault.png');
    }
  }, [auth]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);

      // Show preview immediately
      const previewURL = URL.createObjectURL(file);
      setProfileImage(previewURL);
    }
  };

  const handleImageSave = async () => {
    if (!selectedFile) return;
    setIsUpdating(true);

    try {
      const token = sessionStorage.getItem("token");
      const res = await profilePicUpdate(selectedFile, token);
      setProfileImage(res.data.imageUrl);
      setSelectedFile(null);
      await fetchAdminData(token);
      toast.success(
        res.data.message || "profile picture updated succesfully !!"
      );
    } catch (error) {
      console.error("Error updating profile image:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const openEditModal = () => {
    setEditData({
      firstname,
      lastname,
      email,
      phone,
    });
    setIsEditModalOpen(true);
  };

  const handleSave = async () => {
    setIsSavingBasic(true);

    try {
      const token = sessionStorage.getItem("token");

      const response = await updateAdminProfile(editData, token);
      const data = response.data;

      if (data?.success) {
        toast.success(data.message || "Profile updated successfully !!");
        await fetchAdminData(token);
        setIsEditModalOpen(false);
      } else {
        toast.error(data?.message || "Update failed");
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Something went wrong");
    } finally {
      setIsSavingBasic(false);
    }
  };

  const handleChangePassword = async () => {
    if (!oldpassword || !newpassword) {
      toast.error("Please fill both fields");
      return;
    }
    setLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      const response = await changePassword(
        { oldpassword, newpassword },
        token
      );
      if (response?.data.success) {
        toast.success(
          response.data.message || "password updated succesfully !!"
        );
        setOldpassword("");
        setNewpassword("");
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("username");
        sessionStorage.removeItem("userId");
        sessionStorage.removeItem("role");

       
        setAuth({ token: null, username: null, userId: null, role: null });
        navigate("/");
      } else {
        toast.error(response.data.message || "Failed to Update password");
      }
    } catch (error) {
      toast.error(error?.response?.data.message || "something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* MAIN CARD UI */}
      <div className="min-h-screen md:p-6 p-3">
        <div className="max-w-[1440px] mx-auto bg-white shadow-[inset_0_0_12px_#00000040] rounded-2xl">
          <div className="md:p-8 p-4 border-b border-gray-200">
            <h2 className="text-center text-[#121212] font-semibold mb-6 md:text-4xl text-2xl uppercase tracking-wide border-b-4 border-[#FFD54F] inline-block mx-auto">
              Profile Details
            </h2>

            <div className="flex flex-col md:flex-row gap-4 md:gap-0 justify-center items-center lg:items-end mb-6">
              <div className="relative">
                <img
                  src={profileImage }
                  alt="Profile"
                  className="w-28 h-28 lg:w-42 lg:h-42 rounded-full border-4 border-white shadow-xl object-cover"
                />
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => fileInputRef.current.click()}
                  className="bg-[#121212] text-white text-sm px-5 py-2 rounded font-semibold hover:bg-black transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={handleImageSave}
                  disabled={!selectedFile || isUpdating}
                  className="bg-[#FFD54F] text-[#121212] text-sm px-5 py-2 rounded font-bold disabled:opacity-50"
                >
                  {isUpdating ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
            {/* ACCOUNT INFO (unchanged) */}
            <div className="">
              <div className="grid grid-cols-2 gap-4">
                <div className="mb-4">
                  <label className="block text-gray-600 mb-1 text-sm">
                    First Name
                  </label>
                  <input
                    name="firstname"
                    type="text"
                    value={firstname}
                    disabled
                    className="w-full shadow-[inset_0_0_4px_#00000040] bg-gray-100 rounded-[6px] p-3 text-sm cursor-not-allowed"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-600 mb-1 text-sm">
                    Last Name
                  </label>
                  <input
                    name="lastname"
                    type="text"
                    value={lastname}
                    disabled
                    className="w-full shadow-[inset_0_0_4px_#00000040] bg-gray-100 rounded-[6px] p-3 text-sm cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="mb-4">
                  <label className="block text-gray-600 mb-1 text-sm">
                    Email
                  </label>
                  <input
                    type="text"
                    name="email"
                    value={email}
                    disabled
                    className="w-full shadow-[inset_0_0_4px_#00000040] bg-gray-100 rounded p-3 text-sm cursor-not-allowed"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-600 mb-1 text-sm">
                    Phone
                  </label>
                  <input
                    type="number"
                    name="phone"
                    value={phone || ""}
                    disabled
                    className="w-full shadow-[inset_0_0_4px_#00000040] bg-gray-100 rounded p-3 text-sm cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="lg:flex lg:justify-end gap-2">
                <button
                  onClick={openEditModal}
                  className="bg-[#121212] text-white font-semibold px-6 py-2 rounded-[6px] hover:bg-black transition-colors"
                >
                  Edit
                </button>
              </div>
            </div>
          </div>

          {/* CHANGE PASSWORD  */}
          <div className="max-w-[500px] mx-auto  p-6">
            <h2 className="text-[#121212] font-semibold mb-6 uppercase tracking-wide text-center">
              change password
            </h2>

            <div className="mb-4 relative">
              <label className="block text-gray-600 mb-1 text-sm">
                Old Password
              </label>
              <input
                type={showOldPassword ? "text" : "password"}
                value={oldpassword}
                onChange={(e) => setOldpassword(e.target.value)}
                className="w-full shadow-[inset_0_0_4px_#00000040] rounded p-3 text-sm"
              />
              {showOldPassword ? (
                <BsFillEyeFill
                  className="w-[20px] h-[20px] absolute right-3 top-1/2 -translate-y-[1/2] text-[#34658C]"
                  onClick={() => setShowOldPassword(false)}
                />
              ) : (
                <RiEyeCloseFill
                  className="w-[20px] h-[20px] absolute right-3 top-1/2  -translate-y-[1/2] text-[#121212]"
                  onClick={() => setShowOldPassword(true)}
                />
              )}
            </div>

            <div className="mb-6 relative">
              <label className="block text-gray-600 mb-1 text-sm">
                New Password
              </label>
              <input
                type={showNewPassword ? "text" : "password"}
                value={newpassword}
                onChange={(e) => setNewpassword(e.target.value)}
                className="w-full shadow-[inset_0_0_4px_#00000040] rounded p-3 text-sm"
              />
              {showNewPassword ? (
                <BsFillEyeFill
                  className="w-[20px] h-[20px] absolute right-3 top-1/2 -translate-y-[1/2] text-[#34658C]"
                  onClick={() => setShowNewPassword(false)}
                />
              ) : (
                <RiEyeCloseFill
                  className="w-[20px] h-[20px] absolute right-3 top-1/2  -translate-y-[1/2] text-[#121212]"
                  onClick={() => setShowNewPassword(true)}
                />
              )}
            </div>

            <div className="flex justify-center ">
              <button
                className="bg-[#FFD54F] text-[#121212] text-md font-bold px-12 py-3 rounded hover:brightness-110 transition"
                onClick={handleChangePassword}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* EDIT MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg bg-white rounded-xl p-6 shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Edit Profile</h3>

            {/* NAME & EMAIL EDIT */}
            <div className="grid grid-cols-2 gap-4">
              <div className="mb-4">
                <label className="block text-sm mb-1">First Name</label>
                <input
                  type="text"
                  name="firstname"
                  value={editData.firstname}
                  onChange={handleEditChange}
                  className="w-full border rounded p-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm mb-1">Last Name</label>
                <input
                  type="text"
                  name="lastname"
                  value={editData.lastname}
                  onChange={handleEditChange}
                  className="w-full border rounded p-2"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 ">
              <div className="mb-6">
                <label className="block text-sm mb-1">Email</label>
                <input
                  type="text"
                  name="email"
                  value={editData.email}
                  onChange={handleEditChange}
                  className="w-full border bg-gray-100 rounded p-2 cursor-not-allowed"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm mb-1">Phone</label>
                <input
                  type="number"
                  name="phone"
                  value={editData.phone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    if (value.length <= 10) {
                      handleEditChange({ target: { name: "phone", value } });
                    }
                  }}
                  className="w-full border bg-gray-100 rounded p-2 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 rounded bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSavingBasic}
                className="px-4 py-2 rounded bg-[#FFD54F] text-[#121212] font-bold disabled:opacity-50"
              >
                {isSavingBasic ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Setting;
