
import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { X, Sparkles, Loader2, RefreshCw } from 'lucide-react';
import { suggestProductDetails } from '../services/geminiService';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
  product?: Product | null;
}

const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose, onSave, product }) => {
  // We use strings for numbers in local state to allow empty inputs without forcing 0
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    price: '' as string | number,
    stock: '' as string | number,
    minStock: '' as string | number,
    description: '',
  });
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (product) {
        setFormData({
          name: product.name,
          sku: product.sku,
          category: product.category,
          price: product.price,
          stock: product.stock,
          minStock: product.minStock,
          description: product.description,
        });
      } else {
        // Reset for new product
        setFormData({
          name: '',
          sku: `SKU-${Math.floor(Math.random() * 10000)}`,
          category: '',
          price: '', // Start empty
          stock: '', // Start empty
          minStock: '', // Start empty to prevent "0" or "5" appearing
          description: '',
        });
      }
    }
  }, [isOpen, product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMagicFill = async () => {
    if (!formData.name) return;
    
    setIsGenerating(true);
    try {
      const suggestions = await suggestProductDetails(formData.name);
      setFormData(prev => ({
        ...prev,
        description: suggestions.description,
        category: suggestions.category,
        price: (prev.price === '' || prev.price === 0) ? suggestions.suggestedPrice : prev.price
      }));
    } catch (error) {
      console.error("Failed to generate details", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: product?.id || crypto.randomUUID(),
      lastUpdated: new Date().toISOString(),
      name: formData.name,
      sku: formData.sku,
      category: formData.category,
      price: Number(formData.price) || 0,
      stock: Number(formData.stock) || 0,
      minStock: Number(formData.minStock) || 0,
      description: formData.description
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">
          {/* Name Input with Magic Button */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Product Name</label>
            <div className="flex gap-2">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Wireless Noise Cancelling Headphones"
                className="flex-1 px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:bg-slate-700 dark:text-white"
                required
              />
              <button
                type="button"
                onClick={handleMagicFill}
                disabled={!formData.name || isGenerating}
                className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-lg hover:shadow-md transition-all disabled:opacity-50 flex items-center gap-2 whitespace-nowrap"
                title="Auto-fill details using AI"
              >
                {isGenerating ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
                {isGenerating ? 'Generating...' : 'Magic Fill'}
              </button>
            </div>
            <p className="text-xs text-slate-400">Enter a name and click "Magic Fill" to let AI suggest details.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">SKU</label>
              <div className="flex items-center gap-2">
                <input
                    type="text"
                    name="sku"
                    value={formData.sku}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-slate-50 dark:bg-slate-700 dark:text-white"
                    required
                />
                <button 
                  type="button" 
                  onClick={() => setFormData({...formData, sku: `SKU-${Math.floor(Math.random() * 100000)}`})}
                  className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                    <RefreshCw size={18} />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Category</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="e.g. Electronics"
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:bg-slate-700 dark:text-white"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Price ($)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:bg-slate-700 dark:text-white"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Stock Quantity</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:bg-slate-700 dark:text-white"
                required
              />
            </div>

             <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Min Stock Level</label>
              <input
                type="number"
                name="minStock"
                value={formData.minStock}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:bg-slate-700 dark:text-white"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none dark:bg-slate-700 dark:text-white"
              placeholder="Product description..."
            />
          </div>

          <div className="flex gap-4 pt-4 border-t border-slate-100 dark:border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-indigo-600 rounded-lg text-white font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 dark:shadow-none"
            >
              {product ? 'Save Changes' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
