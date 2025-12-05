
import React, { useState, useMemo } from 'react';
import { Product } from '../types';
import { Search, Edit2, Trash2, Plus, ArrowUpDown, AlertCircle, ShoppingCart } from 'lucide-react';

interface InventoryListProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
  onSell: (product: Product) => void;
}

const InventoryList: React.FC<InventoryListProps> = ({ products, onEdit, onDelete, onAdd, onSell }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof Product>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (field: keyof Product) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedProducts = useMemo(() => {
    return [...products]
      .filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
           return sortDirection === 'asc' 
             ? aValue.localeCompare(bValue) 
             : bValue.localeCompare(aValue);
        }
        
        if (typeof aValue === 'number' && typeof bValue === 'number') {
           return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
        }
        
        return 0;
      });
  }, [products, searchTerm, sortField, sortDirection]);

  return (
    <div className="p-8 h-full flex flex-col animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Inventory</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your products and stock levels.</p>
        </div>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg shadow-lg shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 transition-all hover:-translate-y-0.5"
        >
          <Plus size={20} />
          <span>Add Product</span>
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search by name, SKU, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white dark:bg-slate-700 dark:text-white"
            />
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400">
            Showing {filteredAndSortedProducts.length} items
          </div>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-12 bg-slate-50 dark:bg-slate-900/50 p-4 border-b border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-300">
          <div className="col-span-4 flex items-center cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400" onClick={() => handleSort('name')}>
            Product Name <ArrowUpDown size={14} className="ml-1" />
          </div>
          <div className="col-span-2 flex items-center cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400" onClick={() => handleSort('category')}>
            Category <ArrowUpDown size={14} className="ml-1" />
          </div>
          <div className="col-span-2 text-right flex items-center justify-end cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400" onClick={() => handleSort('price')}>
             <ArrowUpDown size={14} className="mr-1" /> Price
          </div>
          <div className="col-span-2 text-center flex items-center justify-center cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400" onClick={() => handleSort('stock')}>
             <ArrowUpDown size={14} className="mr-1" /> Stock
          </div>
          <div className="col-span-2 text-center">Actions</div>
        </div>

        {/* Table Body */}
        <div className="overflow-y-auto flex-1">
          {filteredAndSortedProducts.length > 0 ? (
            filteredAndSortedProducts.map((product) => (
              <div 
                key={product.id} 
                className="grid grid-cols-12 p-4 border-b border-slate-50 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors items-center text-sm"
              >
                <div className="col-span-4 pr-4">
                  <div className="font-medium text-slate-800 dark:text-slate-200">{product.name}</div>
                  <div className="text-xs text-slate-400">{product.sku}</div>
                </div>
                <div className="col-span-2">
                  <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full text-xs font-medium">
                    {product.category}
                  </span>
                </div>
                <div className="col-span-2 text-right font-medium text-slate-700 dark:text-slate-300">
                  ${product.price.toFixed(2)}
                </div>
                <div className="col-span-2 text-center flex justify-center">
                  <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-bold w-fit ${
                    product.stock <= product.minStock 
                      ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300' 
                      : 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300'
                  }`}>
                    {product.stock <= product.minStock && <AlertCircle size={12} />}
                    {product.stock}
                  </div>
                </div>
                <div className="col-span-2 flex justify-center gap-2">
                  <button 
                    onClick={() => onSell(product)}
                    className="p-1.5 text-slate-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-md transition-colors"
                    title="Record Sale"
                    disabled={product.stock === 0}
                  >
                    <ShoppingCart size={16} className={product.stock === 0 ? "opacity-30" : ""} />
                  </button>
                  <button 
                    onClick={() => onEdit(product)}
                    className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-md transition-colors"
                    title="Edit"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(product.id);
                    }}
                    className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={16} className="pointer-events-none" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-slate-400 dark:text-slate-600">
              <Search size={48} className="mb-4 opacity-20" />
              <p>No products found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InventoryList;
