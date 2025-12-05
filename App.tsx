
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import InventoryList from './components/InventoryList';
import ProductModal from './components/ProductModal';
import SalesModal from './components/SalesModal';
import Settings from './components/Settings';
import AuthPage from './components/AuthPage';
import { ViewState, Product, Sale, User } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSalesModalOpen, setIsSalesModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [sellingProduct, setSellingProduct] = useState<Product | null>(null);

  // Load User Session on Mount
  useEffect(() => {
    // Optional: Check if we want to persist session across refreshes (simple session)
    const session = sessionStorage.getItem('nexus_session');
    if (session) {
        setUser(JSON.parse(session));
    }
  }, []);

  // Load User Data when User changes
  useEffect(() => {
    if (user) {
        // Load user specific data
        const savedInventory = localStorage.getItem(`nexus_inventory_${user.id}`);
        const savedSales = localStorage.getItem(`nexus_sales_${user.id}`);
        const savedTheme = localStorage.getItem(`nexus_theme_${user.id}`);

        setProducts(savedInventory ? JSON.parse(savedInventory) : []);
        setSales(savedSales ? JSON.parse(savedSales) : []);
        setDarkMode(savedTheme === 'dark');
        setCurrentView(ViewState.DASHBOARD);
    } else {
        // Reset state on logout
        setProducts([]);
        setSales([]);
        setDarkMode(false);
    }
  }, [user]);

  // Save Inventory
  useEffect(() => {
    if (user) {
        localStorage.setItem(`nexus_inventory_${user.id}`, JSON.stringify(products));
    }
  }, [products, user]);

  // Save Sales
  useEffect(() => {
    if (user) {
        localStorage.setItem(`nexus_sales_${user.id}`, JSON.stringify(sales));
    }
  }, [sales, user]);

  // Save Theme
  useEffect(() => {
    if (user) {
        localStorage.setItem(`nexus_theme_${user.id}`, darkMode ? 'dark' : 'light');
    }
  }, [darkMode, user]);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    sessionStorage.setItem('nexus_session', JSON.stringify(loggedInUser));
  };

  const handleLogout = () => {
    setUser(null);
    sessionStorage.removeItem('nexus_session');
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleSellProductRequest = (product: Product) => {
    setSellingProduct(product);
    setIsSalesModalOpen(true);
  };

  const handleConfirmSale = (productId: string, quantity: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    // Create Sale Record
    const newSale: Sale = {
      id: crypto.randomUUID(),
      productId,
      productName: product.name,
      quantity,
      totalAmount: product.price * quantity,
      date: new Date().toISOString()
    };
    
    setSales(prev => [newSale, ...prev]);

    // Update Inventory Stock
    setProducts(prev => prev.map(p => 
      p.id === productId ? { ...p, stock: p.stock - quantity } : p
    ));
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const handleSaveProduct = (product: Product) => {
    if (editingProduct) {
      setProducts(prev => prev.map(p => p.id === product.id ? product : p));
    } else {
      setProducts(prev => [...prev, product]);
    }
  };

  const handleResetData = () => {
    if (!user) return;
    setProducts([]);
    setSales([]);
    localStorage.removeItem(`nexus_inventory_${user.id}`);
    localStorage.removeItem(`nexus_sales_${user.id}`);
    setCurrentView(ViewState.INVENTORY); 
  };

  const renderContent = () => {
    switch (currentView) {
      case ViewState.DASHBOARD:
        return <Dashboard products={products} sales={sales} />;
      case ViewState.INVENTORY:
        return (
          <InventoryList 
            products={products}
            onAdd={handleAddProduct}
            onEdit={handleEditProduct}
            onDelete={handleDeleteProduct}
            onSell={handleSellProductRequest}
          />
        );
      case ViewState.SETTINGS:
        return (
          <Settings 
             darkMode={darkMode} 
             toggleDarkMode={toggleDarkMode} 
             onReset={handleResetData} 
          />
        );
      default:
        return <Dashboard products={products} sales={sales} />;
    }
  };

  if (!user) {
    return <AuthPage onLogin={handleLogin} />;
  }

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-200">
        <Sidebar 
            currentView={currentView} 
            onChangeView={setCurrentView} 
            user={user}
            onLogout={handleLogout}
        />
        
        <main className="flex-1 ml-64 min-h-screen transition-all duration-300">
          {renderContent()}
        </main>

        <ProductModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveProduct}
          product={editingProduct}
        />

        <SalesModal 
          isOpen={isSalesModalOpen}
          onClose={() => setIsSalesModalOpen(false)}
          onConfirm={handleConfirmSale}
          product={sellingProduct}
        />
      </div>
    </div>
  );
};

export default App;
