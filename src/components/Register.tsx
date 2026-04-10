import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { currentUser, register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      navigate('/', { replace: true });
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    try {
      setError('');
      setLoading(true);
      await register(email, password);
      navigate('/');
    } catch (err: any) {
      setError('Failed to create an account: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="glass-card max-w-md w-full p-8 rounded-[1rem] border border-outline-variant/10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black font-manrope tracking-tighter text-on-surface uppercase inline-flex items-center gap-2">
            IRON<span className="text-primary">TRACK</span>
            <span className="material-symbols-outlined text-primary">fitness_center</span>
          </h1>
          <p className="text-xs text-on-surface-variant font-bold uppercase tracking-widest mt-2">New Athlete Registration</p>
        </div>

        {error && <div className="bg-error-container text-on-error-container p-3 rounded-lg mb-4 text-sm mix-blend-screen">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Email</label>
            <input 
              type="email" 
              required
              title="Email"
              placeholder="Email"
              className="w-full bg-surface-container-highest border border-outline-variant/20 rounded-lg p-3 text-on-surface focus:outline-none focus:border-primary transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Password</label>
            <input 
              type="password" 
              required
              title="Password"
              placeholder="Password"
              className="w-full bg-surface-container-highest border border-outline-variant/20 rounded-lg p-3 text-on-surface focus:outline-none focus:border-primary transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Confirm Password</label>
            <input 
              type="password" 
              required
              title="Confirm Password"
              placeholder="Confirm Password"
              className="w-full bg-surface-container-highest border border-outline-variant/20 rounded-lg p-3 text-on-surface focus:outline-none focus:border-primary transition-colors"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button 
            disabled={loading}
            className="momentum-gradient w-full py-4 rounded-[1rem] text-on-primary font-bold font-headline uppercase tracking-widest shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 mt-4"
          >
            {loading ? 'Initializing...' : 'Join the Fellowship'}
          </button>
        </form>

        <div className="relative mt-6 mb-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-outline-variant/20"></div>
          </div>
          <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest">
            <span className="bg-surface px-2 text-on-surface-variant">Or continue with</span>
          </div>
        </div>

        <button 
          type="button"
          onClick={async () => {
            try {
              setError(''); setLoading(true);
              await loginWithGoogle();
              navigate('/');
            } catch (err: any) {
              setError('Google login failed: ' + err.message);
            } finally {
              setLoading(false);
            }
          }}
          disabled={loading}
          className="w-full py-4 bg-white text-black font-bold font-headline uppercase tracking-widest rounded-[1rem] shadow-[0_10px_30px_rgba(255,255,255,0.05)] hover:bg-gray-100 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5"/>
          Google
        </button>

        <div className="mt-6 text-center text-xs text-on-surface-variant">
          Already recruited? <button onClick={() => navigate('/login')} className="text-primary hover:underline font-bold uppercase tracking-widest">Login</button>
        </div>
      </div>
    </div>
  );
};

export default Register;
