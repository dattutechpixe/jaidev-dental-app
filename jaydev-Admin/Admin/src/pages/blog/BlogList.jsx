import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { getAllBlogs, deleteBlog } from "../../api/Authapi";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { Edit2, Trash2, PlusCircle, FileText } from "lucide-react";

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { auth } = useContext(AuthContext);

  const fetchBlogs = async () => {
    try {
      const response = await getAllBlogs();
      if (response.data.success) {
        setBlogs(response.data.data);
      }
    } catch (error) {
      toast.error("Failed to fetch blogs");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    try {
      const response = await deleteBlog(id, auth.token);
      if (response.data.success) {
        toast.success("Blog deleted successfully");
        fetchBlogs();
      }
    } catch (error) {
      toast.error("Failed to delete blog");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8 border-b-2 border-[#FFD54F] pb-4">
        <h1 className="text-3xl font-bold text-[#121212] flex items-center gap-2">
          <FileText className="text-[#FFD54F]" /> Blog List
        </h1>
        <Link
          to="/blog/add-blog"
          className="bg-[#121212] text-[#FFD54F] px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-black transition-all"
        >
          <PlusCircle size={20} /> Add New Blog
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FFD54F]"></div>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-200">
          <table className="min-w-full text-left">
            <thead className="bg-[#121212] text-white">
              <tr>
                <th className="px-6 py-4">Image</th>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {blogs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                    No blogs found. Add some to get started!
                  </td>
                </tr>
              ) : (
                blogs.map((b) => (
                  <tr key={b._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      {b.blogimage ? (
                        <img
                          src={b.blogimage}
                          alt={b.title}
                          className="w-16 h-12 object-cover rounded-md border border-gray-200 shadow-sm"
                        />
                      ) : (
                        <div className="w-16 h-12 bg-gray-100 flex items-center justify-center rounded-md border border-gray-200">
                          <FileText size={20} className="text-gray-400" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 font-semibold text-[#121212]">
                      {b.title}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {b.category || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-gray-600 max-w-xs truncate">
                      {b.description || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-2">
                        <Link
                          to={`/blog/edit-blog/${b._id}`}
                          className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                        >
                          <Edit2 size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(b._id)}
                          className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all shadow-sm"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BlogList;
