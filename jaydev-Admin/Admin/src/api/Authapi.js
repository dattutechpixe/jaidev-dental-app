import axiosInstance from "./axiosInstance";


// Login 
export const LoginApi = (formData) => {
  return axiosInstance.post('/admin/login', formData)
}

//profile pic update
export const profilePicUpdate = (file, token) => {
  const formData = new FormData();
  formData.append("image", file); // 👈 The backend expects 'image'

  return axiosInstance.post('/admin/adminProfile', formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
};

//get admin Data
export const getAdminData = (token) => {
  return axiosInstance.get('/admin/getadminData', {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  })
}


//update admin data 

export const updateAdminProfile = (data, token) => {
  return axiosInstance.patch('/admin/updateAdminProfile', data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  })
}


//change password 
export const changePassword = (data, token) => {
  return axiosInstance.patch('/admin/updatePassword', data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  })
}

//Forget password

export const sendResetPasswordEmail = (data, token) => {
  return axiosInstance.post('/admin/forgetPassword', data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  })
}


//Reset Password 
export const setNewPasswordApi = (data) => {
  return axiosInstance.put('/admin/adminsetNewPassword', data, {
    headers: {
      "Content-Type": "application/json"
    }
  })
}




// Create product
export const createProduct = (formData, token) => {
  return axiosInstance.post('/products/create', formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
};

// Get all products
export const getAllProducts = () => {
  return axiosInstance.get('/products/all');
};

// Get single product by ID
export const getProductById = (id) => {
  return axiosInstance.get(`/products/${id}`);
};

// Update product
export const updateProduct = (id, formData, token) => {
  return axiosInstance.put(`/products/update/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
};

// Delete product
export const deleteProduct = (id, token) => {
  return axiosInstance.delete(`/products/delete/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};


// Create a new blog
export const createBlog = (formData, token) => {
  return axiosInstance.post('/blog/create', formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`
    }
  });
};

// Get all blogs
export const getAllBlogs = () => {
  return axiosInstance.get('/blog/allblogs');
};

// Get single blog by ID
export const getBlogById = (id) => {
  return axiosInstance.get(`/blog/singleblog/${id}`);
};

// Update entire blog details
export const updateBlog = (id, data, token) => {
  return axiosInstance.put(`/blog/update/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`
    }
  });
};

// Update only blog image
export const updateBlogImage = (id, formData, token) => {
  return axiosInstance.put(`/blog/update/image/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`
    }
  });
};

// Delete blog
export const deleteBlog = (id, token) => {
  return axiosInstance.delete(`/blog/delete/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

// 🖼️ BANNERS APIS
export const createBanner = (formData, token) => {
  return axiosInstance.post('/banners/create', formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`
    }
  });
};

export const getAllBanners = () => {
  return axiosInstance.get('/banners/all');
};

export const getBannerById = (id) => {
  return axiosInstance.get(`/banners/${id}`);
};

export const updateBanner = (id, data, token) => {
  return axiosInstance.put(`/banners/update/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`
    }
  });
};

export const deleteBanner = (id, token) => {
  return axiosInstance.delete(`/banners/delete/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};
