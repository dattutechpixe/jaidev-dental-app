import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getAdminData, LoginApi } from "../api/Authapi";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [auth, setAuth] = useState({
    token: sessionStorage.getItem("token") || null,
    username: sessionStorage.getItem("username") || "",
    userId: sessionStorage.getItem("userId") || "",
    role: sessionStorage.getItem("role") || "",
  
    profileUrl: "", 
    email: "", 
    firstname: "", 
    lastname: "",
    phone: "", 
  });



   const fetchAdminData = async (token) => {
    try {
      const response = await getAdminData(token);
      const data = response.data;

      if (data?.success) {
          sessionStorage.setItem("email", data.data.email);
        setAuth((prev) => ({
          ...prev,
          firstname: data.data.firstname,
          lastname: data.data.lastname,
          email: data.data.email,
          profileUrl: data.data.profileUrl,
          phone: data.data.phone,
        }));
      } else {
        toast.error(data?.message || "Failed to fetch admin data");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching admin data");
    }
  };

  // optional: fetch admin data on mount if token exists
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) fetchAdminData(token);
  }, []);


  
  const handleLogin = async (formData) => {
    try {
      const response = await LoginApi(formData);
      const data = response.data;

      if (data?.success) {
        const token = data.JWTtoken;
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("username", data.username);
        sessionStorage.setItem("userId", data.userID);
        sessionStorage.setItem("role", data.role);
      
        setAuth((prev) => ({
          ...prev,
          token,
          username: data.username,
          userId: data.userID,
          role: data.role,
        
        }));

        // Fetch admin data after login
        fetchAdminData(token);
        toast.success(data.message || "Login successful!");
        return true;
      } else {
        toast.error(data?.message || "Login failed");
        return false;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
      return false;
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    setAuth({ token: null, username: "", userId: "", role: "" });
    toast.success("Logged out successfully!"); // 🔹 Add Toast
    navigate("/");
  };

 

  return (
    <AuthContext.Provider
      value={{ setAuth, auth, handleLogin, handleLogout, fetchAdminData }}
    >
      {children}
    </AuthContext.Provider>
  );
};
