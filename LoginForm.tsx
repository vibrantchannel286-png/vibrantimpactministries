
import React, { useState } from 'react';
import { ADMIN_EMAILS } from '../constants';

const LoginForm: React.FC<{ onLogin: (email: string) => void }> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ADMIN_EMAILS.includes(email.toLowerCase())) {
      onLogin(email);
    } else {
      setError('Unauthorized access. This area is reserved for VIM Administrators.');
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-white rounded-[3rem] p-10 shadow-2xl border border-gray-100 text-center space-y-8">
        <div className="space-y-2">
          <h2 className="text-vimNavy text-3xl font-serif font-black">Admin Portal</h2>
          <p className="text-gray-400 text-sm">Please sign in with your authorized ministry email.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="email" 
            placeholder="Admin Email Address" 
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-6 py-4 outline-none focus:ring-2 focus:ring-vimGold"
          />
          {error && <p className="text-red-500 text-xs font-bold">{error}</p>}
          <button className="w-full bg-vimNavy text-vimGold py-4 rounded-xl font-bold text-lg hover:bg-vimSteel transition-all shadow-xl">
            ACCESS DASHBOARD
          </button>
        </form>

        <p className="text-[10px] text-gray-300 uppercase tracking-widest">Secure Entry Point • Vibrant Impact Ministries</p>
      </div>
    </div>
  );
};

export default LoginForm;
