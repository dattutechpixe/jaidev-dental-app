import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createBanner, updateBanner, getBannerById } from "../../api/Authapi";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { Image as ImageIcon, ArrowLeft, Upload, Save, X } from "lucide-react";

const AddBanner = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    heading: "",
    description: "",
  });
  
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    if (isEdit) {
      const fetchBanner = async () => {
        try {
          const res = await getBannerById(id);
          if (res.data.success) {
            const b = res.data.data;
            setFormData({
              heading: b.heading || "",
              description: b.description || "",
            });
            if (b.images && b.images.length > 0) {
                setPreviews(b.images);
            }
          }
        } catch (error) {
          toast.error("Failed to fetch banner data");
        }
      };
      fetchBanner();
    }
  }, [id, isEdit]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(prev => [...prev, ...files]);
    
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const removePreview = (index) => {
    const previewToRemove = previews[index];
    
    if (previewToRemove.startsWith('blob:')) {
      const blobIndex = previews.slice(0, index).filter(p => p.startsWith('blob:')).length;
      setImages(prev => prev.filter((_, i) => i !== blobIndex));
    }
    
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const submissionData = new FormData();
    submissionData.append("heading", formData.heading);
    submissionData.append("description", formData.description);

    images.forEach(img => submissionData.append("files", img));

    // Separate existing images from new files
    const existingImagesList = previews.filter(p => !p.startsWith('blob:'));
    if (isEdit) {
      submissionData.append("existingImages", JSON.stringify(existingImagesList));
    }
    
    try {
      const token = auth.token;
      let res;
      if (isEdit) {
        res = await updateBanner(id, submissionData, token);
      } else {
        if (images.length === 0) {
          toast.error("Please upload at least one image");
          setIsLoading(false);
          return;
        }
        res = await createBanner(submissionData, token);
      }

      if (res.data.success) {
        toast.success(`Banner ${isEdit ? "updated" : "created"} successfully`);
        navigate("/banner/banners");
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
            <ImageIcon className="text-[#FFD54F]" /> {isEdit ? "Edit Banner" : "Add Banner"}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-6 max-w-2xl">
          <div>
            <label className="block text-sm font-bold text-[#121212] mb-2 uppercase tracking-wide">Banner Heading</label>
            <input type="text" name="heading" value={formData.heading} onChange={handleInputChange} className="w-full p-4 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-[#FFD54F] transition-all shadow-sm" placeholder="Optional heading text..." />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-[#121212] mb-2 uppercase tracking-wide">Banner Description</label>
            <textarea name="description" value={formData.description} onChange={handleInputChange} rows="3" className="w-full p-4 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-[#FFD54F] transition-all shadow-sm" placeholder="Optional description..."></textarea>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-[#121212] mb-4 uppercase tracking-wide">Banner Images</label>
          <div className="flex flex-wrap gap-4">
            {previews.map((src, index) => (
              <div key={index} className="relative group w-48 h-24 rounded-xl overflow-hidden shadow-md border-2 border-gray-100">
                <img src={src} alt="Preview" className="w-full h-full object-cover" />
                <button type="button" onClick={() => removePreview(index)} className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <X size={14} />
                </button>
              </div>
            ))}
            <label className="w-48 h-24 flex flex-col items-center justify-center border-2 border-dashed border-[#FFD54F] rounded-xl hover:bg-[#FFD54F]/10 cursor-pointer transition-colors shadow-sm">
              <Upload className="text-[#FFD54F]" />
              <span className="text-xs font-bold text-[#121212] mt-2">Upload Images</span>
              <input type="file" multiple onChange={handleFileChange} className="hidden" accept="image/*" />
            </label>
          </div>
        </div>

        <div className="flex justify-end border-t border-gray-100 pt-8 mt-10">
          <button type="submit" disabled={isLoading} className="bg-[#121212] text-[#FFD54F] font-black text-lg px-12 py-4 rounded-2xl flex items-center gap-2 hover:bg-black hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-gray-200">
            {isLoading ? (
              <span className="animate-spin border-t-2 border-[#FFD54F] rounded-full h-5 w-5"></span>
            ) : (
              <Save size={24} />
            )} {isEdit ? "Update Banner" : "Create Banner"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBanner;
