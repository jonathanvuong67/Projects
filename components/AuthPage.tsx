import React, { useState } from 'react';
import { User } from '../types';
import { LogIn, UserPlus, AlertCircle, Box } from 'lucide-react';

interface AuthPageProps {
  onLogin: (user: User) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const storedUsers = localStorage.getItem('nexus_users');
    const users: User[] = storedUsers ? JSON.parse(storedUsers) : [];

    if (isLogin) {
      // Handle Login
      const user = users.find(u => u.email === formData.email && u.password === formData.password);
      if (user) {
        onLogin(user);
      } else {
        setError('Invalid email or password');
      }
    } else {
      // Handle Signup
      if (!formData.name || !formData.email || !formData.password) {
        setError('All fields are required');
        return;
      }

      if (users.some(u => u.email === formData.email)) {
        setError('User with this email already exists');
        return;
      }

      const newUser: User = {
        id: crypto.randomUUID(),
        name: formData.name,
        email: formData.email,
        password: formData.password
      };

      const updatedUsers = [...users, newUser];
      localStorage.setItem('nexus_users', JSON.stringify(updatedUsers));
      onLogin(newUser);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
        <div className="p-8 bg-slate-900 text-white flex flex-col items-center justify-center">
            <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-900/50">
                <Box size={28} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-wide">Inventory Assistant</h1>
            <p className="text-slate-400 mt-2 text-sm text-center">Smart inventory management for modern retailers.</p>
        </div>

        <div className="p-8">
            <div className="flex gap-4 mb-6 p-1 bg-slate-100 rounded-lg">
                <button 
                    type="button"
                    onClick={() => { setIsLogin(true); setError(null); }}
                    className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${isLogin ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Sign In
                </button>
                <button 
                    type="button"
                    onClick={() => { setIsLogin(false); setError(null); }}
                    className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${!isLogin ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Create Account
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg flex items-center gap-2">
                        <AlertCircle size={16} />
                        {error}
                    </div>
                )}

                {!isLogin && (
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
                        <input 
                            type="text" 
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            placeholder="John Doe"
                        />
                    </div>
                )}

                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                    <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        placeholder="name@company.com"
                        required
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Password</label>
                    <input 
                        type="password" 
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        placeholder="••••••••"
                        required
                    />
                </div>

                <button 
                    type="submit"
                    className="w-full mt-6 bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
                >
                    {isLogin ? <LogIn size={18} /> : <UserPlus size={18} />}
                    {isLogin ? 'Sign In' : 'Create Account'}
                </button>
            </form>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;