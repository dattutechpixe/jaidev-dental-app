import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createBlog, updateBlog, updateBlogImage, getBlogById } from "../../api/Authapi";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { FileText, ArrowLeft, Upload, Save, X, PlusCircle } from "lucide-react";

const AddBlog = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    useofproduct: "",
    recommendedProducts: "",
    sections: [{ heading: "", description: "", bullets: [""] }]
  });
  
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (isEdit) {
      const fetchBlog = async () => {
        try {
          const res = await getBlogById(id);
          if (res.data.success) {
            const b = res.data.data;
            setFormData({
              title: b.title || "",
              category: b.category || "",
              description: b.description || "",
              useofproduct: b.useofproduct || "",
              recommendedProducts: b.recommendedProducts || "",
              sections: Array.isArray(b.sections) && b.sections.length > 0 ? b.sections : [{ heading: "", description: "", bullets: [""] }]
            });
            if (b.blogimage) setPreview(b.blogimage);
          }
        } catch (error) {
          toast.error("Failed to fetch blog data");
        }
      };
      fetchBlog();
    }
  }, [id, isEdit]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSectionChange = (index, field, value) => {
    const newSections = [...formData.sections];
    newSections[index][field] = value;
    setFormData(prev => ({ ...prev, sections: newSections }));
  };

  const handleBulletChange = (sectionIndex, bulletIndex, value) => {
    const newSections = [...formData.sections];
    newSections[sectionIndex].bullets[bulletIndex] = value;
    setFormData(prev => ({ ...prev, sections: newSections }));
  };

  const addSection = () => {
    setFormData(prev => ({
      ...prev,
      sections: [...prev.sections, { heading: "", description: "", bullets: [""] }]
    }));
  };

  const removeSection = (index) => {
    if (formData.sections.length <= 1) return;
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index)
    }));
  };

  const addBullet = (sectionIndex) => {
    const newSections = [...formData.sections];
    if (!Array.isArray(newSections[sectionIndex].bullets)) {
      newSections[sectionIndex].bullets = [""];
    } else {
      newSections[sectionIndex].bullets.push("");
    }
    setFormData(prev => ({ ...prev, sections: newSections }));
  };

  const removeBullet = (sectionIndex, bulletIndex) => {
    const newSections = [...formData.sections];
    if (newSections[sectionIndex].bullets.length <= 1) return;
    newSections[sectionIndex].bullets = newSections[sectionIndex].bullets.filter((_, i) => i !== bulletIndex);
    setFormData(prev => ({ ...prev, sections: newSections }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      // Removed immediate upload - will be handled on save like Products
    }
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = auth.token;
      
      const submissionData = new FormData();
      submissionData.append("title", formData.title);
      submissionData.append("category", formData.category);
      submissionData.append("description", formData.description);
      submissionData.append("useofproduct", formData.useofproduct);
      submissionData.append("recommendedProducts", formData.recommendedProducts);
      submissionData.append("sections", JSON.stringify(formData.sections));
      
      if (image) {
        submissionData.append("blogimage", image);
      }

      if (isEdit) {
        const res = await updateBlog(id, submissionData, token);
        if (res.data.success) {
          toast.success("Blog details updated successfully");
          navigate("/blog/blogs");
        }
      } else {
        if (!image) {
          toast.error("Image is required to create a new blog");
          setIsLoading(false);
          return;
        }

        const res = await createBlog(submissionData, token);
        if (res.data.success) {
          toast.success("Blog created successfully");
          navigate("/blog/blogs");
        }
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white rounded-2xl shadow-xl shadow-gray-200/50 mt-10">
      <div className="flex items-center justify-between mb-8 border-b-2 border-[#FFD54F] pb-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors shadow-sm">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-3xl font-bold text-[#121212] flex items-center gap-2">
            <FileText className="text-[#FFD54F]" /> {isEdit ? "Edit Blog" : "Add Blog"}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        <div>
          <label className="block text-sm font-bold text-[#121212] mb-4 uppercase tracking-wide">Cover Image</label>
          <div className="flex gap-6 items-center">
            {preview && (
              <div className="relative w-64 h-40 rounded-xl overflow-hidden shadow-md border-2 border-gray-100">
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
            <label className="w-64 h-40 flex flex-col items-center justify-center border-2 border-dashed border-[#FFD54F] rounded-xl hover:bg-[#FFD54F]/10 cursor-pointer transition-colors shadow-sm">
              <Upload className="text-[#FFD54F] mb-2" size={30}/>
              <span className="text-sm font-bold text-[#121212]">{preview ? "Change Image" : "Upload Cover Image"}</span>
              <input type="file" onChange={handleFileChange} className="hidden" accept="image/*" />
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-[#121212] mb-2 uppercase tracking-wide">Blog Title</label>
              <input type="text" name="title" value={formData.title} onChange={handleInputChange} required className="w-full p-4 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-[#FFD54F] transition-all shadow-sm" placeholder="Enter blog title..." />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-[#121212] mb-2 uppercase tracking-wide">Category</label>
              <input type="text" name="category" value={formData.category} onChange={handleInputChange} className="w-full p-4 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-[#FFD54F] transition-all shadow-sm" placeholder="e.g. Health, Equipment..." />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-[#121212] mb-2 uppercase tracking-wide">Short Description</label>
              <textarea name="description" value={formData.description} onChange={handleInputChange} required rows="5" className="w-full p-4 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-[#FFD54F] transition-all shadow-sm" placeholder="Main description summary..."></textarea>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div>
              <label className="block text-sm font-bold text-[#121212] mb-2 uppercase tracking-wide">Use of Product</label>
              <textarea name="useofproduct" value={formData.useofproduct} onChange={handleInputChange} rows="3" className="w-full p-4 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-[#FFD54F] transition-all shadow-sm" placeholder="How is it used..."></textarea>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-[#121212] mb-2 uppercase tracking-wide">Recommended Products</label>
              <textarea name="recommendedProducts" value={formData.recommendedProducts} onChange={handleInputChange} rows="3" className="w-full p-4 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-[#FFD54F] transition-all shadow-sm" placeholder="Links or names of recommended products..."></textarea>
            </div>
        </div>

        <div className="pt-6 border-t-2 border-gray-100">
          <div className="flex justify-between items-center mb-6">
             <label className="block text-xl font-bold text-[#121212] uppercase tracking-wide">Blog Sections 📚</label>
             <button type="button" onClick={addSection} className="flex items-center gap-1 bg-[#121212] text-white px-4 py-2 rounded-lg font-bold hover:bg-black">
                <PlusCircle size={18}/> Add Section
             </button>
          </div>

          <div className="space-y-6">
            {formData.sections.map((section, sIdx) => (
              <div key={sIdx} className="bg-gray-50 p-6 rounded-2xl border border-gray-200 relative">
                <button type="button" onClick={() => removeSection(sIdx)} className="absolute top-4 right-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                  <X size={20} />
                </button>
                <div className="pr-12 space-y-4">
                  <div>
                     <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Section Heading</label>
                     <input type="text" value={section.heading} onChange={(e) => handleSectionChange(sIdx, "heading", e.target.value)} className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FFD54F]" />
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Section Description</label>
                     <textarea value={section.description} onChange={(e) => handleSectionChange(sIdx, "description", e.target.value)} rows="2" className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FFD54F]" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-2 uppercase flex items-center gap-4">
                      Bullet Points
                      <button type="button" onClick={() => addBullet(sIdx)} className="text-[#FFD54F] bg-[#121212] px-2 py-0.5 rounded text-[10px] hover:bg-black">+ Add Point</button>
                    </label>
                    <div className="space-y-2">
                      {section.bullets && section.bullets.map((bullet, bIdx) => (
                        <div key={bIdx} className="flex gap-2">
                          <input type="text" value={bullet} onChange={(e) => handleBulletChange(sIdx, bIdx, e.target.value)} className="w-full p-2 text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FFD54F]" placeholder="Bullet point..." />
                          <button type="button" onClick={() => removeBullet(sIdx, bIdx)} className="p-2 text-red-400 hover:text-red-600">
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end border-t border-gray-100 pt-8 mt-10">
          <button type="submit" disabled={isLoading} className="bg-[#121212] text-[#FFD54F] font-black text-lg px-12 py-4 rounded-2xl flex items-center gap-2 hover:bg-black hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-gray-200">
            {isLoading ? (
              <span className="animate-spin border-t-2 border-[#FFD54F] rounded-full h-5 w-5"></span>
            ) : (
              <Save size={24} />
            )} {isEdit ? "Update Blog Details" : "Publish Blog"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBlog;
