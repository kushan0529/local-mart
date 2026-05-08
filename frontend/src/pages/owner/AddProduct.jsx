import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import { Package, Upload, Plus, X, ArrowLeft, Save, Trash2, Tag, Briefcase, Info, RefreshCw, ClipboardList, History, AlertTriangle } from 'lucide-react';
import { toast } from 'react-toastify';

const AddProduct = () => {
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: '',
    discountPrice: '',
    category: '',
    stock: '',
    unit: 'piece',
    brand: '',
    tags: []
  });
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [showDrafts, setShowDrafts] = useState(false);
  const [savedDrafts, setSavedDrafts] = useState([]);
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
    loadDraftsList();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await API.get('/shops/categories');
      setCategories(data.data);
    } catch (err) {
      toast.error('Failed to load categories');
    }
  };

  const loadDraftsList = () => {
    const drafts = JSON.parse(localStorage.getItem('localmart_product_drafts') || '[]');
    setSavedDrafts(drafts);
  };

  const saveNewDraft = () => {
    const drafts = [...savedDrafts];
    const newDraft = {
      id: Date.now(),
      timestamp: new Date().toLocaleString(),
      data: { ...productData }, // Shallow copy to preserve tags array
      name: productData.name || `Untitled Product ${drafts.length + 1}`
    };

    if (drafts.length >= 5) {
      toast.warn('Draft limit reached (Max 5). Please delete an old draft first.');
      return;
    }

    drafts.unshift(newDraft);
    localStorage.setItem('localmart_product_drafts', JSON.stringify(drafts));
    setSavedDrafts(drafts);
    toast.success('Draft saved! (Note: Images are not saved in drafts)');
  };

  const restoreDraft = (draft) => {
    setProductData({
      ...draft.data,
      tags: Array.isArray(draft.data.tags) ? draft.data.tags : []
    });
    setImages([]); // Explicitly clear images as they can't be restored
    setPreviews([]);
    setShowDrafts(false);
    toast.success(`Restored: ${draft.name}. Please re-upload your images.`);
  };

  const deleteDraft = (id) => {
    const updated = savedDrafts.filter(d => d.id !== id);
    localStorage.setItem('localmart_product_drafts', JSON.stringify(updated));
    setSavedDrafts(updated);
    toast.warn('Draft deleted.');
  };

  const clearCurrentForm = () => {
    if (window.confirm('Clear all fields?')) {
      setProductData({
        name: '',
        description: '',
        price: '',
        discountPrice: '',
        category: '',
        stock: '',
        unit: 'piece',
        brand: '',
        tags: []
      });
      setImages([]);
      setPreviews([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => file.size <= 5 * 1024 * 1024); // 5MB limit
    
    if (validFiles.length !== files.length) {
      toast.warn('Some images were skipped because they exceed 5MB.');
    }

    setImages(prev => [...prev, ...validFiles]);
    const newPreviews = validFiles.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (!productData.tags.includes(newTag)) {
        setProductData(prev => ({
          ...prev,
          tags: [...prev.tags, newTag]
        }));
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setProductData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (images.length === 0) {
      return toast.error('Please upload at least one image.');
    }

    setLoading(true);

    try {
      const data = new FormData();
      
      // Append basic data
      Object.keys(productData).forEach(key => {
        if (key !== 'tags') {
          data.append(key, productData[key]);
        }
      });

      // Append tags correctly for Multer/Express
      productData.tags.forEach(tag => data.append('tags[]', tag));

      // Append images
      images.forEach(image => data.append('images', image));

      const response = await API.post('/products', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success) {
        toast.success('Product launched successfully!');
        navigate('/owner/dashboard');
      }
    } catch (err) {
      console.error('Submit Error:', err.response?.data);
      toast.error(err.response?.data?.message || 'Submission failed. Check image sizes and required fields.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100 hover:bg-gray-50 transition-all">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            <Package className="text-primary-600 w-10 h-10" />
            Product Launch
          </h1>
        </div>
        
        <div className="flex gap-3">
          <button 
            type="button"
            onClick={() => setShowDrafts(!showDrafts)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all text-sm border ${showDrafts ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}
          >
            <History className="w-4 h-4" /> 
            Drafts ({savedDrafts.length}/5)
          </button>
          <button 
            type="button"
            onClick={saveNewDraft}
            className="flex items-center gap-2 px-6 py-3 bg-white text-primary-600 rounded-xl font-bold hover:bg-primary-50 transition-all text-sm border border-primary-100"
          >
            <Save className="w-4 h-4" /> Save Current
          </button>
          <button 
            type="button"
            onClick={() => {
              const demoProducts = [
                {
                  name: 'Organic Honey Roasted Nuts',
                  description: 'Premium mix of almonds, cashews, and walnuts roasted to perfection with organic honey and a pinch of sea salt.',
                  price: '850',
                  discountPrice: '799',
                  stock: '100',
                  unit: 'pack',
                  brand: 'NutriDelight',
                  tags: ['Healthy', 'Snack', 'Organic', 'Honey'],
                  category: categories[0]?._id || ''
                },
                {
                  name: 'Wireless Noise Cancelling Earbuds',
                  description: 'State-of-the-art earbuds with active noise cancellation, 30-hour battery life, and crystal clear sound quality.',
                  price: '5999',
                  discountPrice: '4499',
                  stock: '50',
                  unit: 'unit',
                  brand: 'SonicWave',
                  tags: ['Audio', 'Wireless', 'Tech', 'Music'],
                  category: categories.find(c => c.name === 'Electronics')?._id || categories[0]?._id || ''
                }
              ];
              const randomProduct = demoProducts[Math.floor(Math.random() * demoProducts.length)];
              setProductData(randomProduct);
              toast.success('Form filled with demo data!');
            }}
            className="flex items-center gap-2 px-6 py-3 bg-primary-50 text-primary-700 rounded-xl font-bold hover:bg-primary-100 transition-all text-sm border border-primary-200"
          >
            <RefreshCw className="w-4 h-4" /> Demo Fill
          </button>
        </div>
      </div>

      {showDrafts && (
        <div className="absolute top-32 right-4 z-50 w-full max-w-sm bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 p-8 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
              <ClipboardList className="text-primary-600" />
              Saved Drafts
            </h3>
            <button onClick={() => setShowDrafts(false)} className="p-2 hover:bg-gray-100 rounded-full">
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
          
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
            {savedDrafts.length > 0 ? (
              savedDrafts.map((draft) => (
                <div key={draft.id} className="p-5 bg-gray-50 rounded-2xl border border-gray-100 group hover:border-primary-200 transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-black text-gray-900 line-clamp-1">{draft.name}</p>
                    <button onClick={() => deleteDraft(draft.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-4">{draft.timestamp}</p>
                  <button 
                    onClick={() => restoreDraft(draft)}
                    className="w-full py-2 bg-white text-primary-600 rounded-xl text-xs font-black uppercase tracking-widest border border-primary-100 hover:bg-primary-600 hover:text-white transition-all shadow-sm"
                  >
                    Restore Content
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-10">
                <History className="w-12 h-12 text-gray-100 mx-auto mb-3" />
                <p className="text-gray-400 font-bold">No drafts saved yet.</p>
              </div>
            )}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-gray-200/40 border border-gray-50 space-y-8">
            <div className="space-y-4">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Product Name</label>
              <input
                name="name"
                type="text"
                required
                value={productData.name}
                onChange={handleChange}
                className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-primary-500/20 transition-all font-bold text-lg"
                placeholder="Product title"
              />
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Story & Details</label>
              <textarea
                name="description"
                required
                value={productData.description}
                onChange={handleChange}
                rows="5"
                className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-primary-500/20 transition-all font-medium leading-relaxed"
                placeholder="Describe what makes this product special..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-[0.2em]">Listing Price (₹)</label>
                <input
                  name="price"
                  type="number"
                  required
                  value={productData.price}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-primary-500/20 transition-all font-black text-xl"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-[0.2em]">Sale Price (₹)</label>
                <input
                  name="discountPrice"
                  type="number"
                  value={productData.discountPrice}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-primary-500/20 transition-all font-black text-xl text-primary-600"
                  placeholder="Discounted"
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-gray-200/40 border border-gray-50 space-y-6">
            <div className="flex items-center justify-between">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Product Gallery</label>
              {previews.length === 0 && (
                <span className="flex items-center gap-1 text-red-500 text-[10px] font-black uppercase tracking-widest animate-pulse">
                  <AlertTriangle className="w-3 h-3" /> Required
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {previews.map((preview, index) => (
                <div key={index} className="relative aspect-square rounded-2xl overflow-hidden group border border-gray-100 shadow-sm">
                  <img src={preview} className="w-full h-full object-cover" alt="Preview" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-1.5 bg-red-500/80 backdrop-blur-sm text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {previews.length < 5 && (
                <label className="aspect-square rounded-2xl border-4 border-dashed border-gray-100 flex flex-col items-center justify-center cursor-pointer hover:border-primary-200 hover:bg-primary-50/30 transition-all group">
                  <Upload className="w-8 h-8 text-gray-300 group-hover:text-primary-500 transition-colors" />
                  <span className="text-[10px] font-black text-gray-400 mt-2 uppercase tracking-widest">Upload</span>
                  <input type="file" multiple onChange={handleImageChange} className="hidden" accept="image/*" />
                </label>
              )}
            </div>
            <p className="text-[10px] text-gray-400 font-bold italic flex items-center gap-2 uppercase tracking-widest">
              <Info className="w-3 h-3 text-primary-400" /> Max 5 images. Files must be under 5MB.
            </p>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-gray-200/40 border border-gray-100 space-y-8">
            <div>
              <label className="block text-[10px] font-black text-gray-400 mb-3 uppercase tracking-[0.2em]">Product Category</label>
              <select
                name="category"
                required
                value={productData.category}
                onChange={handleChange}
                className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-primary-500/20 transition-all font-bold appearance-none cursor-pointer"
              >
                <option value="">Choose Category</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-gray-400 mb-3 uppercase tracking-[0.2em]">Stock Level</label>
                <input
                  name="stock"
                  type="number"
                  required
                  value={productData.stock}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-primary-500/20 transition-all font-bold"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 mb-3 uppercase tracking-[0.2em]">Sales Unit</label>
                <input
                  name="unit"
                  type="text"
                  required
                  value={productData.unit}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-primary-500/20 transition-all font-bold"
                  placeholder="kg, pcs"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 mb-3 uppercase tracking-[0.2em] flex items-center gap-2">
                <Briefcase className="w-3 h-3" /> Brand/Brandless
              </label>
              <input
                name="brand"
                type="text"
                value={productData.brand}
                onChange={handleChange}
                className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-primary-500/20 transition-all font-bold"
                placeholder="Manufacturer"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 mb-3 uppercase tracking-[0.2em] flex items-center gap-2">
                <Tag className="w-3 h-3" /> Discoverability Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-4">
                {productData.tags.map((tag, idx) => (
                  <span key={idx} className="px-3 py-1 bg-primary-600 text-white rounded-lg text-[10px] font-black flex items-center gap-2 shadow-sm uppercase tracking-widest">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)}>
                      <X className="w-3 h-3 hover:text-red-200 transition-colors" />
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-primary-500/20 transition-all font-bold text-sm"
                placeholder="Type and press Enter"
              />
            </div>
          </div>

          <div className="space-y-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white py-6 rounded-[2rem] font-black transition-all transform active:scale-95 shadow-2xl shadow-primary-200 flex items-center justify-center gap-4 text-xl"
            >
              {loading ? <RefreshCw className="w-8 h-8 animate-spin" /> : <Plus className="w-8 h-8" />}
              {loading ? 'Publishing...' : 'Launch Product'}
            </button>
            <button
              type="button"
              onClick={clearCurrentForm}
              className="w-full flex items-center justify-center gap-2 py-4 text-gray-400 hover:text-red-500 transition-colors text-[10px] font-black uppercase tracking-[0.2em]"
            >
              <RefreshCw className="w-3 h-3" /> Reset Everything
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
