import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createProduct, updateProduct, getProductById } from "../../api/Authapi";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { Package, ArrowLeft, Upload, Save, X } from "lucide-react";

const AddProduct = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    equipmentName: "",
    equipmentdescription: "",
    description: "",
    indications: [""],
    features: [""]
  });
  
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    if (isEdit) {
      const fetchProduct = async () => {
        try {
          const res = await getProductById(id);
          if (res.data.success) {
            const p = res.data.data;
            setFormData({
              equipmentName: p.equipmentName || "",
              equipmentdescription: p.equipmentdescription || "",
              description: p.description || "",
              indications: p.indications || [""],
              features: p.features || [""]
            });
            if (p.images) setPreviews(p.images);
          }
        } catch (error) {
          toast.error("Failed to fetch product data");
        }
      };
      fetchProduct();
    }
  }, [id, isEdit]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (type, index, value) => {
    const newArr = [...formData[type]];
    newArr[index] = value;
    setFormData((prev) => ({ ...prev, [type]: newArr }));
  };

  const addArrayItem = (type) => {
    setFormData((prev) => ({ ...prev, [type]: [...prev[type], ""] }));
  };

  const removeArrayItem = (type, index) => {
    if (formData[type].length <= 1) return;
    const newArr = formData[type].filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, [type]: newArr }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(prev => [...prev, ...files]);
    
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const removePreview = (index) => {
    const previewToRemove = previews[index];
    
    // If it's a blob (new file), we need to find its index in the 'images' array
    if (previewToRemove.startsWith('blob:')) {
      // Find how many blob previews come before this one to find corresponding index in 'images'
      const blobIndex = previews.slice(0, index).filter(p => p.startsWith('blob:')).length;
      setImages(prev => prev.filter((_, i) => i !== blobIndex));
    }
    
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const submissionData = new FormData();
    submissionData.append("equipmentName", formData.equipmentName);
    submissionData.append("equipmentdescription", formData.equipmentdescription);
    submissionData.append("description", formData.description);

    formData.indications.forEach(i => i.trim() && submissionData.append("indications[]", i));
    formData.features.forEach(f => f.trim() && submissionData.append("features[]", f));
    
    // Separate existing images from new files
    // Existing images are the ones in 'previews' that DON'T start with 'blob:'
    const existingImagesList = previews.filter(p => !p.startsWith('blob:'));
    if (isEdit) {
      submissionData.append("existingImages", JSON.stringify(existingImagesList));
    }
    
    images.forEach(img => submissionData.append("files", img));

    try {
      const token = auth.token;
      let res;
      if (isEdit) {
        res = await updateProduct(id, submissionData, token);
      } else {
        res = await createProduct(submissionData, token);
      }

      if (res.data.success) {
        toast.success(`Product ${isEdit ? "updated" : "created"} successfully`);
        navigate("/product/products");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-2xl shadow-xl shadow-gray-200/50 mt-10">
      <div className="flex items-center justify-between mb-8 border-b-2 border-[#FFD54F] pb-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors shadow-sm">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-3xl font-bold text-[#121212] flex items-center gap-2">
            <Package className="text-[#FFD54F]" /> {isEdit ? "Edit Product" : "Add Product"}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-[#121212] mb-2 uppercase tracking-wide">Product Name</label>
              <input type="text" name="equipmentName" value={formData.equipmentName} onChange={handleInputChange} required className="w-full p-4 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-[#FFD54F] transition-all shadow-sm" placeholder="Enter product name..." />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-[#121212] mb-2 uppercase tracking-wide">Short Description</label>
              <textarea name="equipmentdescription" value={formData.equipmentdescription} onChange={handleInputChange} rows="3" className="w-full p-4 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-[#FFD54F] transition-all shadow-sm" placeholder="Short summary..."></textarea>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#121212] mb-2 uppercase tracking-wide">Full Description</label>
              <textarea name="description" value={formData.description} onChange={handleInputChange} rows="5" className="w-full p-4 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-[#FFD54F] transition-all shadow-sm" placeholder="Full product details..."></textarea>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-[#121212] mb-2 uppercase tracking-wide">Indications</label>
              <div className="space-y-3">
                {formData.indications.map((item, index) => (
                  <div key={index} className="flex gap-2">
                    <input type="text" value={item} onChange={(e) => handleArrayChange("indications", index, e.target.value)} className="w-full p-3 bg-gray-50 border-0 rounded-lg focus:ring-2 focus:ring-[#FFD54F] shadow-sm" />
                    <button type="button" onClick={() => removeArrayItem("indications", index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                      <X size={20} />
                    </button>
                  </div>
                ))}
                <button type="button" onClick={() => addArrayItem("indications")} className="text-sm font-bold text-[#121212] hover:text-[#000] border-b-2 border-[#FFD54F]">
                  + Add Indication
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#121212] mb-2 uppercase tracking-wide">Features</label>
              <div className="space-y-3">
                {formData.features.map((item, index) => (
                  <div key={index} className="flex gap-2">
                    <input type="text" value={item} onChange={(e) => handleArrayChange("features", index, e.target.value)} className="w-full p-3 bg-gray-50 border-0 rounded-lg focus:ring-2 focus:ring-[#FFD54F] shadow-sm" />
                    <button type="button" onClick={() => removeArrayItem("features", index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                      <X size={20} />
                    </button>
                  </div>
                ))}
                <button type="button" onClick={() => addArrayItem("features")} className="text-sm font-bold text-[#121212] hover:text-[#000] border-b-2 border-[#FFD54F]">
                  + Add Feature
                </button>
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-[#121212] mb-4 uppercase tracking-wide">Product Images</label>
          <div className="flex flex-wrap gap-4">
            {previews.map((src, index) => (
              <div key={index} className="relative group w-32 h-32 rounded-xl overflow-hidden shadow-md border-2 border-gray-100">
                <img src={src} alt="Preview" className="w-full h-full object-cover" />
                <button type="button" onClick={() => removePreview(index)} className="absolute top-1 right-1 p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <X size={14} />
                </button>
              </div>
            ))}
            <label className="w-32 h-32 flex flex-col items-center justify-center border-2 border-dashed border-[#FFD54F] rounded-xl hover:bg-[#FFD54F]/10 cursor-pointer transition-colors shadow-sm">
              <Upload className="text-[#FFD54F]" />
              <span className="text-xs font-bold text-[#121212] mt-2">Upload</span>
              <input type="file" multiple onChange={handleFileChange} className="hidden" />
            </label>
          </div>
        </div>

        <div className="flex justify-end border-t border-gray-100 pt-8 mt-10">
          <button type="submit" disabled={isLoading} className="bg-[#121212] text-[#FFD54F] font-black text-lg px-12 py-4 rounded-2xl flex items-center gap-2 hover:bg-black hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-gray-200">
            {isLoading ? (
              <span className="animate-spin border-t-2 border-[#FFD54F] rounded-full h-5 w-5"></span>
            ) : (
              <Save size={24} />
            )} {isEdit ? "Update Product" : "Create Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
