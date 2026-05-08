import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import Loader from '../../components/Loader';
import * as LucideIcons from 'lucide-react';
import { Layers, Plus, Edit2, Trash2, Save, X, Info, Tag } from 'lucide-react';
import { toast } from 'react-toastify';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(null); // ID of category being edited
  const [editForm, setEditForm] = useState({ name: '', icon: '', description: '' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [newForm, setNewForm] = useState({ name: '', icon: 'ShoppingBag', description: '' });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await API.get('/admin/categories');
      setCategories(data.data);
    } catch (err) {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (cat) => {
    setIsEditing(cat._id);
    setEditForm({ name: cat.name, icon: cat.icon, description: cat.description || '' });
  };

  const handleUpdate = async (id) => {
    try {
      await API.put(`/admin/categories/${id}`, editForm);
      toast.success('Category updated!');
      setIsEditing(null);
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure? This may affect shops in this category.')) {
      try {
        await API.delete(`/admin/categories/${id}`);
        toast.success('Category deleted');
        fetchCategories();
      } catch (err) {
        toast.error(err.response?.data?.message || 'Delete failed');
      }
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await API.post('/admin/categories', newForm);
      toast.success('New category added!');
      setShowAddForm(false);
      setNewForm({ name: '', icon: 'ShoppingBag', description: '' });
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add category');
    }
  };

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><Loader /></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-gray-900 flex items-center gap-3">
            <Layers className="text-primary-600 w-10 h-10" />
            Manage Categories
          </h1>
          <p className="text-gray-500 mt-1 font-medium italic">Organize how customers find local products.</p>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-primary-600 text-white px-8 py-4 rounded-2xl font-black hover:bg-primary-700 transition-all flex items-center gap-2 shadow-xl shadow-primary-100 active:scale-95"
        >
          {showAddForm ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
          {showAddForm ? 'Close Form' : 'Add New Category'}
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl border border-primary-100 mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
          <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-[0.2em]">Category Name</label>
              <input 
                type="text" 
                required 
                value={newForm.name} 
                onChange={(e) => setNewForm({...newForm, name: e.target.value})}
                className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-primary-500/20 transition-all font-bold"
                placeholder="e.g. Pet Care"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-[0.2em]">Lucide Icon Name</label>
              <input 
                type="text" 
                required 
                value={newForm.icon} 
                onChange={(e) => setNewForm({...newForm, icon: e.target.value})}
                className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-primary-500/20 transition-all font-bold"
                placeholder="e.g. Dog"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-[0.2em]">Description</label>
              <div className="flex gap-4">
                <input 
                  type="text" 
                  value={newForm.description} 
                  onChange={(e) => setNewForm({...newForm, description: e.target.value})}
                  className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-primary-500/20 transition-all font-bold"
                  placeholder="Short summary..."
                />
                <button type="submit" className="bg-primary-600 text-white px-8 py-4 rounded-2xl font-black">Save</button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((cat) => (
          <div key={cat._id} className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-gray-200/40 border border-gray-50 hover:border-primary-200 transition-all group">
            {isEditing === cat._id ? (
              <div className="space-y-4">
                <input 
                  type="text" 
                  value={editForm.name} 
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-50 rounded-xl font-bold"
                />
                <input 
                  type="text" 
                  value={editForm.icon} 
                  onChange={(e) => setEditForm({...editForm, icon: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-50 rounded-xl text-sm"
                />
                <textarea 
                  value={editForm.description} 
                  onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-50 rounded-xl text-sm"
                  rows="2"
                />
                <div className="flex gap-2">
                  <button onClick={() => handleUpdate(cat._id)} className="flex-1 bg-green-600 text-white py-2 rounded-xl font-bold text-sm">Save</button>
                  <button onClick={() => setIsEditing(null)} className="flex-1 bg-gray-100 text-gray-500 py-2 rounded-xl font-bold text-sm">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col h-full">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-16 h-16 bg-primary-50 rounded-[1.5rem] flex items-center justify-center text-primary-600 shadow-inner group-hover:scale-110 transition-transform">
                    {/* Fallback to Tag if icon not found or invalid */}
                    {(() => {
                      const IconComponent = LucideIcons[cat.icon] || Tag;
                      return <IconComponent className="w-8 h-8" />;
                    })()}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(cat)} className="p-3 bg-gray-50 rounded-xl text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-all">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(cat._id)} className="p-3 bg-gray-50 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <h3 className="text-2xl font-black text-gray-900 mb-2">{cat.name}</h3>
                <p className="text-gray-500 text-sm font-medium mb-4 italic">"{cat.description || 'No description'}"</p>
                <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Icon: {cat.icon}</span>
                  <div className="flex items-center gap-1 text-primary-600 text-xs font-black">
                    <Info className="w-3 h-3" />
                    System Asset
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminCategories;
