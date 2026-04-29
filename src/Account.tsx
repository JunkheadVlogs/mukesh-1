import type { FormEvent } from 'react';
import { useState } from 'react';
import { useStore } from './store';

export default function Account() {
  const { user, login, logout } = useStore();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Mock login
    login(isLogin ? (email.split('@')[0] || 'User') : name, email);
  };

  if (user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20">
        <h1 className="text-3xl md:text-[40px] font-serif text-primary-950 mb-10 border-b border-black/5 pb-6 font-normal">My Account</h1>
        <div className="bg-primary-50 p-10 lg:p-12 border border-black/5">
          <p className="text-2xl font-serif text-primary-950 mb-2">Welcome back, {user.name}</p>
          <p className="text-primary-950/50 mb-10 font-light">{user.email}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="border border-black/10 p-8 bg-transparent">
              <h3 className="text-[11px] tracking-[2px] uppercase text-primary-950 mb-4 border-b border-black/5 pb-3">Order History</h3>
              <p className="text-[13px] text-primary-950/70 font-light">You haven't placed any orders yet.</p>
            </div>
            <div className="border border-black/10 p-8 bg-transparent">
              <h3 className="text-[11px] tracking-[2px] uppercase text-primary-950 mb-4 border-b border-black/5 pb-3">Saved Addresses</h3>
              <p className="text-[13px] text-primary-950/70 font-light">No addresses saved.</p>
            </div>
          </div>
          
          <button 
            onClick={logout}
            className="border-b border-primary-950 text-priority-950 hover:text-gold-500 hover:border-gold-500 pb-1 text-[11px] tracking-[2px] uppercase transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto px-4 py-24 min-h-[70vh] flex flex-col justify-center">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-[40px] font-serif text-primary-950 mb-4 font-normal">{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
        <p className="text-primary-950/70 font-light">
          {isLogin ? 'Sign in to access your orders and saved items.' : 'Join us to enjoy a premium shopping experience.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {!isLogin && (
          <div>
            <label className="block text-[10px] tracking-[1px] uppercase text-primary-950/50 mb-2">Full Name</label>
            <input 
              required 
              type="text" 
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-transparent border border-black/10 px-4 py-3 text-sm focus:border-gold-500 outline-none transition-colors" 
            />
          </div>
        )}
        <div>
          <label className="block text-[10px] tracking-[1px] uppercase text-primary-950/50 mb-2">Email Address</label>
          <input 
            required 
            type="email" 
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full bg-transparent border border-black/10 px-4 py-3 text-sm focus:border-gold-500 outline-none transition-colors" 
          />
        </div>
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-[10px] tracking-[1px] uppercase text-primary-950/50">Password</label>
            {isLogin && <a href="#" className="text-[10px] tracking-[1px] uppercase text-gold-500 hover:underline">Forgot?</a>}
          </div>
          <input 
            required 
            type="password" 
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full bg-transparent border border-black/10 px-4 py-3 text-sm focus:border-gold-500 outline-none transition-colors" 
          />
        </div>
        <button type="submit" className="w-full bg-primary-950 text-white py-4 mt-6 text-[11px] tracking-[2px] uppercase hover:bg-gold-500 transition-colors">
          {isLogin ? 'Sign In' : 'Sign Up'}
        </button>
      </form>

      <div className="mt-8 text-center pt-8 border-t border-black/5">
        <button 
          onClick={() => setIsLogin(!isLogin)}
          className="text-[11px] tracking-[1px] uppercase text-primary-950/70 hover:text-gold-500 transition-colors"
        >
          {isLogin ? "Don't have an account? Create one" : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}
