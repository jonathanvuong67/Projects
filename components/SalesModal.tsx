
import React, { useState } from 'react';
import { Product } from '../types';
import { X, ShoppingCart } from 'lucide-react';

interface SalesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (productId: string, quantity: number) => void;
  product: Product | null;
}

const SalesModal: React.FC<SalesModalProps> = ({ isOpen, onClose, onConfirm, product }) => {
  const [quantity, setQuantity] = useState<string>('1');

  if (!isOpen || !product) return null;

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = parseInt(quantity);
    if (qty > 0 && qty <= product.stock) {
      onConfirm(product.id, qty);
      setQuantity('1'); // Reset
      onClose();
    }
  };

  const revenue = (parseFloat(quantity || '0') * product.price).toFixed(2);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md shadow-2xl flex flex-col">
        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <ShoppingCart className="text-green-500" />
            Record Sale
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleConfirm} className="p-6 space-y-6">
          <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg">
              <p className="text-sm text-slate-500 dark:text-slate-400">Product</p>
              <p className="font-semibold text-slate-800 dark:text-white text-lg">{product.name}</p>
              <div className="flex justify-between mt-2 text-sm">
                  <span className="text-slate-600 dark:text-slate-300">Stock Available: {product.stock}</span>
                  <span className="text-slate-600 dark:text-slate-300">Price: ${product.price}</span>
              </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Quantity Sold</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min="1"
              max={product.stock}
              className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none dark:bg-slate-700 dark:text-white text-lg"
              autoFocus
              required
            />
          </div>

          <div className="flex justify-between items-center py-2">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Total Revenue:</span>
              <span className="text-2xl font-bold text-green-600 dark:text-green-400">${revenue}</span>
          </div>

          <div className="flex gap-4 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={parseInt(quantity) > product.stock || parseInt(quantity) <= 0}
              className="flex-1 px-4 py-2.5 bg-green-600 rounded-lg text-white font-medium hover:bg-green-700 transition-colors shadow-lg shadow-green-200 dark:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirm Sale
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SalesModal;
