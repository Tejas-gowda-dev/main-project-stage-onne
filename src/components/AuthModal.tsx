import * as React from 'react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, User, Key, Sparkles, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, Github, GraduationCap } from 'lucide-react';
import { UserSession } from '../types';
import GlowButton from './GlowButton';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserSession) => void;
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup' | 'forgot'>('signin');
  
  // Input fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [college, setCollege] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Status feedback state
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Input cleaners helper
  const clearStatus = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleTabChange = (tab: 'signin' | 'signup' | 'forgot') => {
    setActiveTab(tab);
    clearStatus();
  };

  // 1. Classic Email + Pass Credentials Login
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage("Please fill out all credentials.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to authenticate.");
      }

      setSuccessMessage(data.message || "Welcome back to InternForge!");
      setTimeout(() => {
        onSuccess(data.user);
        onClose();
      }, 1000);
    } catch (err: any) {
      setErrorMessage(err.message || "Network error. Try checking local credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Cleartext Password registration
  const [signingUp, setSigningUp] = useState(false);
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !name || !college) {
      setErrorMessage("Please complete all profile fields including College/University name.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, college })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to complete registration.");
      }

      setSuccessMessage("Account created successfully!");
      setTimeout(() => {
        onSuccess(data.user);
        onClose();
      }, 1000);
    } catch (err: any) {
      setErrorMessage(err.message || "Registration failed.");
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Password reset updating passkey on backend
  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !newPassword) {
      setErrorMessage("Please enter both email and your new password.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Reset command rejected.");
      }

      setSuccessMessage("Password reset successfully! Log in to access your dashboard.");
      setTimeout(() => {
        setActiveTab('signin');
        clearStatus();
      }, 1800);
    } catch (err: any) {
      setErrorMessage(err.message || "Could not retrieve password. Verify profile email.");
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Client OAuth flows mimicking user selections
  const triggerOAuthFlow = async (provider: 'Google' | 'LinkedIn') => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      // Setup mock external payload credentials
      const dummyId = "oauth-" + Math.floor(Math.random() * 100000);
      const randomName = provider === 'Google' ? "Ganesh Rao" : "Tejas Gowda";
      const randomEmail = provider === 'Google' ? "ganesh.rao@gmail.com" : "tejas.gowda@linkedin.com";

      const response = await fetch('/api/auth/oauth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider,
          email: randomEmail,
          name: randomName,
          externalId: dummyId
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "OAuth request rejected.");
      }

      setSuccessMessage(`Successfully connected via ${provider}!`);
      setTimeout(() => {
        onSuccess(data.user);
        onClose();
      }, 1200);
    } catch (err: any) {
      setErrorMessage(err.message || `${provider} authentication stream timed out.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          {/* Black blur overlay curtain background */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Core dialog layout card model */}
          <motion.div
            initial={{ scale: 0.95, y: 15, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 15, opacity: 0 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="relative w-full max-w-md bg-[#111827]/95 border border-white/10 rounded-2xl p-6 overflow-hidden shadow-2xl z-[130] backdrop-blur-3xl font-sans"
          >
            {/* Ambient cyan back glow */}
            <div className="absolute -top-12 -left-12 w-28 h-28 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-12 -right-12 w-28 h-28 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

            {/* Header elements line */}
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-white/5 relative z-10">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-cyber-cyan" />
                <span className="text-[10px] font-mono font-bold text-gray-400 tracking-wider">
                  GATEWAY_SECURE_AUTH
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded bg-white/5 text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Title descriptor block */}
            <div className="text-center mb-6 relative z-10">
              <h3 className="text-xl font-display font-extrabold text-white">
                {activeTab === 'signin' && "Access Portal Control"}
                {activeTab === 'signup' && "New Enrollment Entry"}
                {activeTab === 'forgot' && "Key Recovery Signal"}
              </h3>
              <p className="text-xs text-gray-400 mt-1 select-none">
                {activeTab === 'signin' && "Run credentials verification scan to resume labs."}
                {activeTab === 'signup' && "Setup your primary student profile."}
                {activeTab === 'forgot' && "Supply your registered address to rewrite target secret."}
              </p>
            </div>

            {/* Sub-tab selection row */}
            {activeTab !== 'forgot' && (
              <div className="flex bg-black/40 border border-white/5 p-1 rounded-lg mb-6 relative z-10 select-none">
                <button
                  type="button"
                  onClick={() => handleTabChange('signin')}
                  className={`flex-1 py-1.5 rounded-md text-xs font-semibold font-display tracking-wide transition-all ${
                    activeTab === 'signin'
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shadow-[0_0_10px_rgba(99,102,241,0.25)]'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => handleTabChange('signup')}
                  className={`flex-1 py-1.5 rounded-md text-xs font-semibold font-display tracking-wide transition-all ${
                    activeTab === 'signup'
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* Notifications Display Section */}
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-500/10 border border-red-500/20 text-red-300 rounded-lg text-xs flex gap-2 mb-4 items-center"
              >
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorMessage}</span>
              </motion.div>
            )}

            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 rounded-lg text-xs flex gap-2 mb-4 items-center"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{successMessage}</span>
              </motion.div>
            )}

            {/* Core Action Forms container */}
            <div className="relative z-10">
              {activeTab === 'signin' && (
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="student@internforge.com"
                        className="w-full bg-black/45 border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold text-white focus:outline-none focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/20 transition-all font-mono placeholder:text-gray-600"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Secret Passkey</label>
                      <button
                        type="button"
                        onClick={() => handleTabChange('forgot')}
                        className="text-[10px] font-mono text-indigo-400 hover:underline"
                      >
                        Reset Password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="password123"
                        className="w-full bg-black/45 border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold text-white focus:outline-none focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/20 transition-all font-mono placeholder:text-gray-600"
                        required
                      />
                    </div>
                  </div>

                  <GlowButton
                    variant="cyan"
                    type="submit"
                    disabled={isLoading}
                    className="w-full text-xs py-3 font-bold uppercase tracking-wider mt-2"
                  >
                    {isLoading ? "Validating Signal..." : "Resolve Sign-In Key"}
                  </GlowButton>
                </form>
              )}

              {activeTab === 'signup' && (
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block">Full Legal Name</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Arjun Singh"
                        className="w-full bg-black/45 border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold text-white focus:outline-none focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/20 transition-all font-sans placeholder:text-gray-600"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block">Primary Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="arjun.singh@college.edu"
                        className="w-full bg-black/45 border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold text-white focus:outline-none focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/20 transition-all font-mono placeholder:text-gray-600"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block">College / University Name</label>
                    <div className="relative">
                      <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="text"
                        value={college}
                        onChange={(e) => setCollege(e.target.value)}
                        placeholder="BITS Pilani"
                        className="w-full bg-black/45 border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold text-white focus:outline-none focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/20 transition-all font-sans placeholder:text-gray-600"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block">Initialize Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="password123"
                        className="w-full bg-black/45 border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold text-white focus:outline-none focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/20 transition-all font-mono placeholder:text-gray-600"
                        required
                      />
                    </div>
                  </div>

                  <GlowButton
                    variant="purple"
                    type="submit"
                    disabled={isLoading}
                    className="w-full text-xs py-3 font-bold uppercase tracking-wider mt-2"
                  >
                    {isLoading ? "Provisioning Profile..." : "Submit Candidate Form"}
                  </GlowButton>
                </form>
              )}

              {activeTab === 'forgot' && (
                <form onSubmit={handleForgot} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block">Registered Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="student@internforge.com"
                        className="w-full bg-black/45 border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold text-white focus:outline-none focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/20 transition-all font-mono placeholder:text-gray-600"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block">New Reset Password</label>
                    <div className="relative">
                      <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="enterNewSecurePassword"
                        className="w-full bg-black/45 border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold text-white focus:outline-none focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/20 transition-all font-mono placeholder:text-gray-600"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center py-1">
                    <button
                      type="button"
                      onClick={() => handleTabChange('signin')}
                      className="text-[11px] font-semibold text-cyan-400 hover:underline flex items-center gap-1.5"
                    >
                      &larr; Return to Sign In
                    </button>
                  </div>

                  <GlowButton
                    variant="gradient"
                    type="submit"
                    disabled={isLoading}
                    className="w-full text-xs py-3 font-bold uppercase tracking-wider"
                  >
                    {isLoading ? "Rewriting Target..." : "Rewrite Security Credentials"}
                  </GlowButton>
                </form>
              )}

              {/* Dynamic Social Login Options Row */}
              {activeTab !== 'forgot' && (
                <div className="mt-6 border-t border-white/5 pt-4">
                  <div className="relative flex justify-center text-[10px] font-mono font-bold text-gray-500 uppercase tracking-wider mb-4">
                    <span className="bg-[#111827] px-2.5 relative z-10">Or Connect Account via</span>
                    <div className="absolute inset-y-1/2 left-0 right-0 border-t border-white/5 -z-1" />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => triggerOAuthFlow('Google')}
                      disabled={isLoading}
                      className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-cyan-400/35 hover:bg-white/10 text-xs font-semibold text-gray-100 transition-all cursor-pointer select-none"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path
                          fill="#EA4335"
                          d="M12 5.04c1.62 0 3.08.56 4.22 1.65l3.15-3.15C17.45 1.77 14.93 1 12 1 7.37 1 3.42 3.65 1.48 7.52l3.75 2.91C6.11 7.15 8.84 5.04 12 5.04z"
                        />
                        <path
                          fill="#4285F4"
                          d="M23.49 12.27c0-.82-.07-1.61-.21-2.38H12v4.51h6.44c-.28 1.46-1.1 2.69-2.34 3.52l3.65 2.83c2.13-1.97 3.74-4.86 3.74-8.48z"
                        />
                        <path
                          fill="#34A853"
                          d="M5.23 14.43c-.22-.67-.35-1.39-.35-2.13s.13-1.46.35-2.13L1.48 7.26C.54 9.17 0 11.28 0 13.5s.54 4.33 1.48 6.24l3.75-2.91z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M12 22.96c3.24 0 5.96-1.07 7.95-2.91l-3.65-2.83c-1.01.68-2.3 1.08-4.3 1.08-3.16 0-5.89-2.11-6.77-5.39L1.48 16c1.94 3.87 5.89 6.52 10.52 6.52z"
                        />
                      </svg>
                      <span>Google Hub</span>
                    </button>

                    <button
                      onClick={() => triggerOAuthFlow('LinkedIn')}
                      disabled={isLoading}
                      className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-cyan-400/35 hover:bg-white/10 text-xs font-semibold text-gray-100 transition-all cursor-pointer select-none"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                      <span>Linked Core</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
