import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { getAllProducts, deleteProduct } from "../../api/Authapi";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { Edit2, Trash2, PlusCircle, Package } from "lucide-react";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { auth } = useContext(AuthContext);

  const fetchProducts = async () => {
    try {
      const response = await getAllProducts();
      if (response.data.success) {
        setProducts(response.data.data);
      }
    } catch (error) {
      toast.error("Failed to fetch products");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const response = await deleteProduct(id, auth.token);
      if (response.data.success) {
        toast.success("Product deleted successfully");
        fetchProducts();
      }
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8 border-b-2 border-[#FFD54F] pb-4">
        <h1 className="text-3xl font-bold text-[#121212] flex items-center gap-2">
          <Package className="text-[#FFD54F]" /> Product List
        </h1>
        <Link
          to="/product/add-product"
          className="bg-[#121212] text-[#FFD54F] px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-black transition-all"
        >
          <PlusCircle size={20} /> Add New Product
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
                <th className="px-6 py-4">Product Name</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-10 text-center text-gray-500">
                    No products found. Add some to get started!
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      {p.images && p.images[0] ? (
                        <img
                          src={p.images[0]}
                          alt={p.equipmentName}
                          className="w-12 h-12 object-cover rounded-md border border-gray-200 shadow-sm"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 flex items-center justify-center rounded-md border border-gray-200">
                          <Package size={20} className="text-gray-400" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 font-semibold text-[#121212]">
                      {p.equipmentName}
                    </td>
                    <td className="px-6 py-4 text-gray-600 max-w-xs truncate">
                      {p.equipmentdescription || p.description || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-2">
                        <Link
                          to={`/product/edit-product/${p._id}`}
                          className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                        >
                          <Edit2 size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(p._id)}
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

export default ProductList;
