import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { getAllBanners, deleteBanner } from "../../api/Authapi";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { Edit2, Trash2, PlusCircle, Image as ImageIcon } from "lucide-react";

const BannerList = () => {
  const [banners, setBanners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { auth } = useContext(AuthContext);

  const fetchBanners = async () => {
    try {
      const response = await getAllBanners();
      if (response.data.success) {
        setBanners(response.data.data);
      }
    } catch (error) {
      toast.error("Failed to fetch banners");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this banner?")) return;
    try {
      const response = await deleteBanner(id, auth.token);
      if (response.data.success) {
        toast.success("Banner deleted successfully");
        fetchBanners();
      }
    } catch (error) {
      toast.error("Failed to delete banner");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8 border-b-2 border-[#FFD54F] pb-4">
        <h1 className="text-3xl font-bold text-[#121212] flex items-center gap-2">
          <ImageIcon className="text-[#FFD54F]" /> Banner List
        </h1>
        <Link
          to="/banner/add-banners"
          className="bg-[#121212] text-[#FFD54F] px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-black transition-all"
        >
          <PlusCircle size={20} /> Add New Banner
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
                <th className="px-6 py-4">Heading</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {banners.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-10 text-center text-gray-500">
                    No banners found. Add some to get started!
                  </td>
                </tr>
              ) : (
                banners.map((b) => (
                  <tr key={b._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      {b.images && b.images.length > 0 ? (
                        <img
                          src={b.images[0]}
                          alt={b.heading}
                          className="w-24 h-12 object-cover rounded-md border border-gray-200 shadow-sm"
                        />
                      ) : (
                        <div className="w-24 h-12 bg-gray-100 flex items-center justify-center rounded-md border border-gray-200">
                          <ImageIcon size={20} className="text-gray-400" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 font-semibold text-[#121212]">
                      {b.heading || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-gray-600 max-w-sm truncate">
                      {b.description || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-2">
                        <Link
                          to={`/banner/edit-banner/${b._id}`}
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

export default BannerList;
