import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Users, History, FileText, Check, X, ShieldCheck, 
  Search, RefreshCw, Key, ArrowRight, UserCheck, AlertCircle,
  CreditCard, CheckCircle2, XCircle, Sparkles, Filter,
  Award, GraduationCap, BookOpen, TrendingUp, Lock, Unlock, Settings
} from 'lucide-react';
import GlowButton from './GlowButton';
import { PROGRAMS } from '../data';

interface AdminPanelProps {
  onBackToClass: () => void;
}

interface UserRecord {
  id: string;
  name: string;
  email: string;
  college?: string;
  level: number;
  xp: number;
  streak: number;
  completedNodes: string[];
  labsCompleted: number;
  password?: string;
  purchasedPrograms?: string[];
}

interface ProfileRequest {
  id: string;
  userId: string;
  userEmail: string;
  currentName: string;
  currentCollege: string;
  requestedName: string;
  requestedCollege: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

interface LoginAudit {
  id: string;
  email: string;
  name: string;
  timestamp: string;
  provider: string;
}

interface TransactionRecord {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  programId: string;
  programTitle: string;
  amount: number;
  status: 'success' | 'failed';
  paymentGateway: string;
  errorMessage?: string;
  timestamp: string;
}

export default function AdminPanel({ onBackToClass }: AdminPanelProps) {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [profileRequests, setProfileRequests] = useState<ProfileRequest[]>([]);
  const [loginAudits, setLoginAudits] = useState<LoginAudit[]>([]);
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'users' | 'requests' | 'logins' | 'transactions'>('transactions');
  const [txnFilter, setTxnFilter] = useState<'all' | 'success' | 'failed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Create / Register student state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserCollege, setNewUserCollege] = useState('');

  // Edit student state
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editCollege, setEditCollege] = useState('');
  const [editCompletedNodes, setEditCompletedNodes] = useState<string[]>([]);
  const [editPurchasedPrograms, setEditPurchasedPrograms] = useState<string[]>([]);
  const [editLevel, setEditLevel] = useState<number>(14);
  const [editXp, setEditXp] = useState<number>(14250);
  const [editLabsCompleted, setEditLabsCompleted] = useState<number>(14);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim() || !newUserPassword.trim()) {
      setStatusMsg({ type: 'error', text: 'Name, Email, and Password are all required.' });
      return;
    }
    try {
      setIsLoading(true);
      const res = await fetch('/api/admin/users/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newUserName.trim(),
          email: newUserEmail.trim(),
          password: newUserPassword,
          college: newUserCollege.trim() || undefined
        })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create new user profile.');
      }
      setStatusMsg({ type: 'success', text: data.message || 'New user successfully created!' });
      setNewUserName('');
      setNewUserEmail('');
      setNewUserPassword('');
      setNewUserCollege('');
      setShowAddForm(false);
      fetchAdminData();
      setTimeout(() => setStatusMsg(null), 4000);
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'Error creating user session.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartEdit = (user: UserRecord) => {
    setEditingUserId(user.id);
    setEditName(user.name);
    setEditEmail(user.email);
    setEditPassword(user.password || '');
    setEditCollege(user.college || '');
    setEditCompletedNodes(user.completedNodes || []);
    setEditPurchasedPrograms(user.purchasedPrograms || []);
    setEditLevel(user.level || 14);
    setEditXp(user.xp || 14250);
    setEditLabsCompleted(user.labsCompleted || 14);
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim() || !editEmail.trim()) {
      setStatusMsg({ type: 'error', text: 'Name and Email are required fields.' });
      return;
    }
    try {
      setIsLoading(true);
      const res = await fetch('/api/admin/users/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingUserId,
          name: editName.trim(),
          email: editEmail.trim(),
          password: editPassword || undefined,
          college: editCollege.trim() || undefined,
          completedNodes: editCompletedNodes,
          purchasedPrograms: editPurchasedPrograms,
          level: editLevel,
          xp: editXp,
          labsCompleted: editLabsCompleted
        })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update student records.');
      }
      setStatusMsg({ type: 'success', text: data.message || 'Student record updated successfully!' });
      setEditingUserId(null);
      fetchAdminData();
      setTimeout(() => setStatusMsg(null), 4000);
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'Error updating student record.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Direct fast-track certification logic
  const handleFastTrackCertify = async (user: UserRecord) => {
    try {
      setIsLoading(true);
      const allNodes = ['w1-2', 'w3-5', 'w6-8', 'w9-10', 'w11-12'];
      // Ensure they have at least one active purchased program to latch the certificate on
      const currentPurchased = user.purchasedPrograms || [];
      const updatedPurchased = currentPurchased.length > 0 ? currentPurchased : ['prog-ai-robotics'];

      const res = await fetch('/api/admin/users/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: user.id,
          name: user.name,
          email: user.email,
          completedNodes: allNodes,
          purchasedPrograms: updatedPurchased,
          level: 15,
          xp: Math.max(user.xp, 15000),
          labsCompleted: 15
        })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Server rejected auto-certification.');
      }
      setStatusMsg({ 
        type: 'success', 
        text: `🏆 Successfully Certified ${user.name}! Streamed graduation hash codes and unlocked standard PDF printing.` 
      });
      fetchAdminData();
      setTimeout(() => setStatusMsg(null), 5000);
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'Error performing quick certification.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Direct specialization toggle logic
  const handleToggleProgramAccess = async (user: UserRecord, programId: string) => {
    try {
      setIsLoading(true);
      const currentPurchased = user.purchasedPrograms || [];
      const hasTrack = currentPurchased.includes(programId);
      const updatedPurchased = hasTrack 
        ? currentPurchased.filter(id => id !== programId)
        : [...currentPurchased, programId];

      const res = await fetch('/api/admin/users/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: user.id,
          name: user.name,
          email: user.email,
          purchasedPrograms: updatedPurchased
        })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Server rejected program toggle.');
      }
      setStatusMsg({ 
        type: 'success', 
        text: `🔓 Updated course access parameters for ${user.name}.` 
      });
      fetchAdminData();
      setTimeout(() => setStatusMsg(null), 4000);
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'Error toggling specialization.' });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAdminData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/data');
      if (!response.ok) {
        throw new Error("Failed to load admin stream telemetry.");
      }
      const data = await response.json();
      setUsers(data.users || []);
      setProfileRequests(data.profileRequests || []);
      setLoginAudits(data.loginAudits || []);
      setTransactions(data.transactions || []);
    } catch (err: any) {
      console.error(err);
      setStatusMsg({ type: 'error', text: err.message || "Endpoint error retrieving telemetry feeds." });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleRequestAction = async (requestId: string, action: 'approve' | 'reject') => {
    try {
      const response = await fetch('/api/admin/requests/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, action })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Execution parameters failed.");
      }
      setStatusMsg({ type: 'success', text: data.message || `Successfully executed request action.` });
      // Refresh database records
      fetchAdminData();
      setTimeout(() => setStatusMsg(null), 4000);
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || "Failed to process decision." });
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (u.college || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full flex flex-col pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10 font-sans select-none">
      
      {/* Admin Head Banner */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 bg-[#1E1B4B]/35 border border-indigo-500/20 p-5 rounded-2xl relative overflow-hidden backdrop-blur-md">
        <div className="absolute top-0 right-0 p-2 font-mono text-[8px] text-indigo-400">ROLE::ROOT_ADMINISTRATOR</div>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/35 flex items-center justify-center text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.25)]">
            <ShieldCheck className="w-6 h-6 animate-pulse" />
          </div>
          <div className="text-left">
            <span className="text-[10px] font-mono tracking-widest text-indigo-455 font-bold uppercase block mb-0.5">Control Center Mode</span>
            <h2 className="text-xl md:text-2xl font-display font-bold text-white tracking-tight">
              InternForge Administrator Console
            </h2>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchAdminData}
            disabled={isLoading}
            className="p-2.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 hover:text-white transition-all cursor-pointer flex items-center gap-2 text-xs font-mono font-semibold"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-cyan-400' : ''}`} />
            REFRESH_STREAM
          </button>
          
          <GlowButton onClick={onBackToClass} variant="cyan" className="text-xs font-semibold py-2 px-4 shadow-[0_0_12px_rgba(6,182,212,0.15)]">
            Exit Admin Mode &rarr;
          </GlowButton>
        </div>
      </div>

      {/* Operation Warnings/Toasts */}
      {statusMsg && (
        <motion.div 
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl mb-6 flex items-center gap-3 text-xs md:text-sm font-medium ${
            statusMsg.type === 'success' 
              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300' 
              : 'bg-red-500/10 border border-red-500/30 text-red-300'
          }`}
        >
          {statusMsg.type === 'success' ? <UserCheck className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span>{statusMsg.text}</span>
        </motion.div>
      )}

      {/* Internal Control Tabs Row */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Navigation panel */}
        <div className="space-y-3 bg-[#111827]/75 p-4 rounded-2xl border border-white/5 backdrop-blur-sm">
          <span className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest px-2 mb-2">TELEMETRY_FEEDS</span>
          <button
            onClick={() => setActiveTab('requests')}
            className={`w-full flex items-center justify-between p-3.5 rounded-xl transition-all font-display text-xs font-semibold uppercase tracking-wider ${
              activeTab === 'requests'
                ? 'bg-gradient-to-r from-amber-500/15 to-yellow-500/5 border border-amber-500/30 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.15)]'
                : 'bg-transparent text-gray-400 hover:text-white border border-transparent hover:border-white/5 hover:bg-white/5'
            }`}
          >
            <span className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Change Requests
            </span>
            <span className="font-mono text-[10px] bg-amber-500/15 border border-amber-500/20 text-amber-200 px-2 py-0.5 rounded-full font-bold">
              {profileRequests.filter(r => r.status === 'pending').length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center justify-between p-3.5 rounded-xl transition-all font-display text-xs font-semibold uppercase tracking-wider ${
              activeTab === 'users'
                ? 'bg-gradient-to-r from-cyan-500/15 to-blue-500/5 border border-cyan-500/30 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                : 'bg-transparent text-gray-400 hover:text-white border border-transparent hover:border-white/5 hover:bg-white/5'
            }`}
          >
            <span className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Registered Cohort
            </span>
            <span className="font-mono text-[10px] bg-cyan-500/15 border border-cyan-500/20 text-cyan-200 px-2 py-0.5 rounded-full">
              {users.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('logins')}
            className={`w-full flex items-center justify-between p-3.5 rounded-xl transition-all font-display text-xs font-semibold uppercase tracking-wider ${
              activeTab === 'logins'
                ? 'bg-gradient-to-r from-purple-500/15 to-indigo-500/5 border border-purple-500/30 text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.15)]'
                : 'bg-transparent text-gray-400 hover:text-white border border-transparent hover:border-white/5 hover:bg-white/5'
            }`}
          >
            <span className="flex items-center gap-2">
              <History className="w-4 h-4" />
              Live Logins Activity
            </span>
            <span className="font-mono text-[10px] bg-purple-500/15 border border-purple-500/20 text-purple-200 px-2 py-0.5 rounded-full">
              {loginAudits.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('transactions')}
            className={`w-full flex items-center justify-between p-3.5 rounded-xl transition-all font-display text-xs font-semibold uppercase tracking-wider ${
              activeTab === 'transactions'
                ? 'bg-gradient-to-r from-indigo-500/15 to-cyan-500/5 border border-indigo-555/40 text-cyan-300 shadow-[0_0_12px_rgba(99,102,241,0.2)]'
                : 'bg-transparent text-gray-400 hover:text-white border border-transparent hover:border-white/5 hover:bg-white/5'
            }`}
          >
            <span className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-cyan-400" />
              Audit Transactions
            </span>
            <span className="font-mono text-[10px] bg-indigo-500/15 border border-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full font-bold">
              {transactions.length}
            </span>
          </button>
        </div>

        {/* Central Display Feed */}
        <div className="lg:col-span-3 bg-[#111827]/75 p-6 rounded-2xl border border-white/5 min-h-[420px] relative">
          
          {/* SEARCH BAR COMPONENT */}
          <div className="w-full flex items-center justify-between gap-4 pb-4 border-b border-white/5 mb-6">
            <h3 className="font-display text-sm font-extrabold uppercase text-gray-300 tracking-wider">
              {activeTab === 'users' && "Registered Candidates (Total View)"}
              {activeTab === 'requests' && "Pending Profile Correction Tickets"}
              {activeTab === 'logins' && "Live Logins Telemetry Records"}
              {activeTab === 'transactions' && "Transactions Audit Ledger (PhonePe / Cashfree)"}
            </h3>
            {(activeTab === 'users' || activeTab === 'transactions') && (
              <div className="relative max-w-xs w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input 
                  type="text"
                  placeholder={activeTab === 'users' ? "Search students..." : "Search transactions..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-black/45 border border-white/5 rounded-xl py-2 pl-9 pr-3 text-xs text-white focus:outline-none focus:border-cyan-400/40 font-mono"
                />
              </div>
            )}
          </div>

          {/* tab 1. PENDING CHANGE REQUEST TICKETS */}
          {activeTab === 'requests' && (
            <div className="space-y-4">
              {profileRequests.length === 0 ? (
                <div className="text-center py-16 text-gray-500 font-mono text-xs">
                  NO_PROFILE_CHANGE_REQUESTS_LOGGED
                </div>
              ) : (
                profileRequests.map((req) => (
                  <div 
                    key={req.id}
                    className="p-5 rounded-xl bg-white/5 border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-white/10 transition-all text-left"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-bold">
                          REQUEST_ID: {req.id.substring(0, 8).toUpperCase()}
                        </span>
                        <span className={`font-mono text-[10px] px-2 py-0.5 rounded ${
                          req.status === 'pending' ? 'bg-amber-500/10 border border-amber-500/20 text-amber-400' :
                          req.status === 'approved' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' :
                          'bg-red-500/10 border border-red-500/20 text-red-400'
                        } font-bold uppercase`}>
                          {req.status}
                        </span>
                      </div>

                      <div className="text-xs text-gray-400 font-mono">
                        User: <span className="text-slate-100 font-sans font-bold">{req.userEmail}</span>
                      </div>

                      {/* Side by side differences */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl text-xs bg-black/35 p-3 rounded-lg border border-white/5">
                        <div className="space-y-1">
                          <div className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">Original Data</div>
                          <div className="font-sans font-semibold text-gray-300">Name: <span className="line-through text-gray-500">{req.currentName || 'Not Set'}</span></div>
                          <div className="font-sans font-semibold text-gray-300">College: <span className="line-through text-gray-500">{req.currentCollege || 'Not Set'}</span></div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-[10px] text-amber-500 font-mono uppercase tracking-widest">Requested Change</div>
                          <div className="font-sans font-bold text-amber-200">Name: {req.requestedName}</div>
                          <div className="font-sans font-bold text-amber-200">College: {req.requestedCollege}</div>
                        </div>
                      </div>
                    </div>

                    {req.status === 'pending' && (
                      <div className="flex sm:flex-col md:flex-row gap-2 self-start md:self-center">
                        <button
                          onClick={() => handleRequestAction(req.id, 'approve')}
                          className="flex items-center gap-1.5 px-3 py-1.5 font-mono text-[10px] font-bold text-emerald-400 hover:text-white bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500 hover:border-emerald-500 rounded-lg transition-all cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          APPROVE
                        </button>
                        <button
                          onClick={() => handleRequestAction(req.id, 'reject')}
                          className="flex items-center gap-1.5 px-3 py-1.5 font-mono text-[10px] font-bold text-red-400 hover:text-white bg-red-500/10 border border-red-500/20 hover:bg-red-500 hover:border-red-500 rounded-lg transition-all cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                          REJECT
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* tab 2. USER COHORT LIST */}
          {activeTab === 'users' && (() => {
            const totalStudents = users.length;
            const certifiedStudents = users.filter(u => u.completedNodes && u.completedNodes.length >= 5);
            const certifiedCount = certifiedStudents.length;
            const certRate = totalStudents > 0 ? Math.round((certifiedCount / totalStudents) * 100) : 0;
            const totalLabs = users.reduce((acc, u) => acc + (u.labsCompleted || 0), 0);
            const avgXp = totalStudents > 0 ? Math.round(users.reduce((acc, u) => acc + (u.xp || 0), 0) / totalStudents) : 0;

            // Compute course unlocks count
            const courseStats = PROGRAMS.map(prog => {
              const enrolledCount = users.filter(u => u.purchasedPrograms && u.purchasedPrograms.includes(prog.id));
              return {
                ...prog,
                enrolledCount: enrolledCount.length,
                percentage: totalStudents > 0 ? Math.round((enrolledCount.length / totalStudents) * 105) : 0
              };
            });

            return (
              <div className="space-y-6 text-left">
                {/* 1. Academic Performance Dashboard KPI cards */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-cyan-500/[0.03] border border-cyan-500/20">
                    <div className="flex justify-between items-start">
                      <span className="block text-[10px] font-mono text-cyan-400 uppercase tracking-widest mb-1.5">Registered Cohort</span>
                      <Users className="w-3.5 h-3.5 text-cyan-400" />
                    </div>
                    <strong className="text-2xl font-black text-white font-display block">{totalStudents}</strong>
                    <span className="block text-[10px] text-gray-500 mt-1">Enrolled and verified students</span>
                  </div>

                  <div className="p-4 rounded-xl bg-amber-500/[0.03] border border-amber-500/20">
                    <div className="flex justify-between items-start">
                      <span className="block text-[10px] font-mono text-amber-400 uppercase tracking-widest mb-1.5">Certified Graduates</span>
                      <Award className="w-3.5 h-3.5 text-amber-400" />
                    </div>
                    <strong className="text-2xl font-black text-amber-300 font-display block">
                      {certifiedCount} <span className="text-xs text-gray-500 font-sans font-normal">/ {totalStudents}</span>
                    </strong>
                    <span className="block text-[10px] text-gray-500 mt-1">Cleared all 5 sequential milestones</span>
                  </div>

                  <div className="p-4 rounded-xl bg-indigo-500/[0.03] border border-indigo-500/20">
                    <div className="flex justify-between items-start">
                      <span className="block text-[10px] font-mono text-indigo-400 uppercase tracking-widest mb-1.5">Certification Goal Rate</span>
                      <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
                    </div>
                    <strong className="text-2xl font-black text-indigo-300 font-display block">{certRate}%</strong>
                    <div className="w-full bg-indigo-950/40 rounded-full h-1 mt-2 overflow-hidden">
                      <div className="bg-gradient-to-r from-cyan-400 to-indigo-500 h-1 rounded-full transition-all duration-500" style={{ width: `${certRate}%` }}></div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-purple-500/[0.03] border border-purple-500/20">
                    <div className="flex justify-between items-start">
                      <span className="block text-[10px] font-mono text-purple-400 uppercase tracking-widest mb-1.5">Simulation Velocity</span>
                      <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
                    </div>
                    <strong className="text-2xl font-black text-purple-300 font-display block">{totalLabs} Labs</strong>
                    <span className="block text-[10px] text-gray-500 mt-1">Avg {avgXp.toLocaleString()} XP/candidate</span>
                  </div>
                </div>

                {/* 2. Demographic Map & Stream Unlocks Breakdown */}
                <div className="p-4 bg-indigo-950/15 border border-indigo-500/15 rounded-xl space-y-3">
                  <div className="flex items-center justify-between border-b border-indigo-500/10 pb-2">
                    <span className="text-[10px] font-mono text-indigo-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                      Academic Course Specialization & Unlocks Distribution (Business Intelligence Metrics)
                    </span>
                    <span className="text-[9px] font-mono text-gray-500">REALTIME_ROLLOVER</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-1">
                    {courseStats.slice(0, 4).map(cs => (
                      <div key={cs.id} className="space-y-1">
                        <div className="flex justify-between text-[11px] font-sans">
                          <span className="text-gray-300 font-bold truncate max-w-[150px]">{cs.title}</span>
                          <span className="text-cyan-300 font-mono font-bold">{cs.enrolledCount} unlock(s)</span>
                        </div>
                        <div className="w-full bg-black/45 rounded-full h-1.5 overflow-hidden border border-white/5">
                          <div 
                            className="bg-cyan-400 h-1.5 rounded-full transition-all duration-500" 
                            style={{ width: `${Math.min(cs.percentage, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                    {courseStats.slice(4).map(cs => (
                      <div key={cs.id} className="space-y-1">
                        <div className="flex justify-between text-[11px] font-sans">
                          <span className="text-gray-300 font-bold truncate max-w-[150px]">{cs.title}</span>
                          <span className="text-cyan-300 font-mono font-bold">{cs.enrolledCount} unlock(s)</span>
                        </div>
                        <div className="w-full bg-black/45 rounded-full h-1.5 overflow-hidden border border-white/5">
                          <div 
                            className="bg-purple-500 h-1.5 rounded-full transition-all duration-500" 
                            style={{ width: `${Math.min(cs.percentage, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Header toggle buttons and tools */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-center bg-[#1E1B4B]/20 border border-indigo-500/10 p-4 rounded-xl gap-3">
                  <div className="text-xs text-gray-400 font-mono flex items-center gap-1">
                    <Settings className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
                    COHORT_PROFILES_AND_CERTIFICATION_DECIDER
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(!showAddForm)}
                      className="px-3 py-1.5 font-mono text-[10px] font-bold text-cyan-400 hover:text-white bg-cyan-500/15 border border-cyan-500/25 hover:bg-cyan-500 rounded-lg transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      {showAddForm ? '✕ Close Quick Add' : '➕ Quick Register Student'}
                    </button>
                  </div>
                </div>

                {/* Add user form */}
                {showAddForm && (
                  <div className="bg-black/35 border border-white/5 p-4 rounded-xl space-y-3.5">
                    <form onSubmit={handleCreateUser} className="space-y-3">
                      <div className="text-xs font-bold text-gray-200 border-b border-white/5 pb-1 font-mono uppercase tracking-wider">
                        ⚡ Register New Candidate Account
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        <div>
                          <label className="block text-[10px] text-gray-400 font-mono uppercase mb-1">Full Name</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Rohan Sharma"
                            value={newUserName}
                            onChange={(e) => setNewUserName(e.target.value)}
                            className="w-full bg-black/45 border border-white/10 rounded-lg py-1.5 px-3 text-xs text-white focus:outline-none focus:border-cyan-400 shadow-inner"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-gray-400 font-mono uppercase mb-1">Email Address</label>
                          <input
                            type="email"
                            required
                            placeholder="e.g. rohan@example.com"
                            value={newUserEmail}
                            onChange={(e) => setNewUserEmail(e.target.value)}
                            className="w-full bg-black/45 border border-white/10 rounded-lg py-1.5 px-3 text-xs text-white focus:outline-none focus:border-cyan-400 shadow-inner"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-gray-400 font-mono uppercase mb-1">Set Password</label>
                          <input
                            type="password"
                            required
                            placeholder="Set password"
                            value={newUserPassword}
                            onChange={(e) => setNewUserPassword(e.target.value)}
                            className="w-full bg-black/45 border border-white/10 rounded-lg py-1.5 px-3 text-xs text-white focus:outline-none focus:border-cyan-400 shadow-inner"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-gray-400 font-mono uppercase mb-1">College/Institution</label>
                          <input
                            type="text"
                            placeholder="e.g. IIT Kharagpur"
                            value={newUserCollege}
                            onChange={(e) => setNewUserCollege(e.target.value)}
                            className="w-full bg-black/45 border border-white/10 rounded-lg py-1.5 px-3 text-xs text-white focus:outline-none focus:border-cyan-400 shadow-inner"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2.5 pt-1">
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="px-4 py-2 text-xs font-semibold rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-mono transition-colors shadow-lg cursor-pointer"
                        >
                          REGISTER_ACCOUNT
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {filteredUsers.length === 0 ? (
                  <div className="text-center py-16 text-gray-500 font-mono text-xs">
                    NO_COHORT_STUDENTS_MATCHING_SPEC
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-xl border border-white/5 bg-[#0D0B14]/30">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead>
                        <tr className="bg-black/45 border-b border-white/5 font-mono text-[10px] text-gray-500 uppercase tracking-widest">
                          <th className="py-3 px-3">Student Name / Email</th>
                          <th className="py-3 px-3">College Name</th>
                          <th className="py-3 px-3">Cohort Metrics</th>
                          <th className="py-3 px-3 text-center">Certified & Course Specializations (Click to Toggle)</th>
                          <th className="py-3 px-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.03]">
                        {filteredUsers.map((user) => {
                          const isEditing = editingUserId === user.id;
                          const userCertified = user.completedNodes && user.completedNodes.length >= 5;
                          const completedCount = user.completedNodes ? user.completedNodes.length : 0;

                          return (
                            <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                              {isEditing ? (
                                <td colSpan={5} className="py-4 px-3">
                                  <form onSubmit={handleUpdateUser} className="space-y-4 bg-indigo-950/20 border border-indigo-500/20 p-5 rounded-xl text-left font-sans">
                                    <div className="text-[10px] font-mono text-indigo-300 font-bold uppercase tracking-wider border-b border-white/10 pb-1.5 flex justify-between items-center">
                                      <span>⚙️ Edit Candidate Progress parameters: {user.name}</span>
                                      <span className="text-cyan-400">UID: {user.id}</span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                      <div>
                                        <label className="block text-[10px] font-mono text-gray-400 uppercase mb-1">Name</label>
                                        <input
                                          type="text"
                                          required
                                          value={editName}
                                          onChange={(e) => setEditName(e.target.value)}
                                          className="w-full bg-black/60 border border-white/10 rounded-lg py-1.5 px-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-[10px] font-mono text-gray-400 uppercase mb-1">Email ID</label>
                                        <input
                                          type="email"
                                          required
                                          value={editEmail}
                                          onChange={(e) => setEditEmail(e.target.value)}
                                          className="w-full bg-black/60 border border-white/10 rounded-lg py-1.5 px-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-[10px] font-mono text-gray-400 uppercase mb-1">Authentication Passkey</label>
                                        <input
                                          type="text"
                                          placeholder="No change"
                                          value={editPassword}
                                          onChange={(e) => setEditPassword(e.target.value)}
                                          className="w-full bg-black/60 border border-white/10 rounded-lg py-1.5 px-3 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-[10px] font-mono text-gray-400 uppercase mb-1">College/Institution</label>
                                        <input
                                          type="text"
                                          value={editCollege}
                                          onChange={(e) => setEditCollege(e.target.value)}
                                          className="w-full bg-black/60 border border-white/10 rounded-lg py-1.5 px-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                                        />
                                      </div>
                                    </div>

                                    {/* Advanced Stats Sliders */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-white/5">
                                      <div>
                                        <div className="flex justify-between text-[10px] font-mono text-gray-400 uppercase mb-1">
                                          <span>Scholar Level</span>
                                          <span className="text-cyan-400 font-bold">Lvl {editLevel}</span>
                                        </div>
                                        <input 
                                          type="range" 
                                          min="1" 
                                          max="30"
                                          value={editLevel}
                                          onChange={(e) => setEditLevel(Number(e.target.value))}
                                          className="w-full accent-cyan-400 cursor-pointer"
                                        />
                                      </div>
                                      <div>
                                        <div className="flex justify-between text-[10px] font-mono text-gray-400 uppercase mb-1">
                                          <span>Experience points (XP)</span>
                                          <span className="text-cyan-400 font-bold">{editXp} XP</span>
                                        </div>
                                        <input 
                                          type="number"
                                          value={editXp}
                                          onChange={(e) => setEditXp(Number(e.target.value))}
                                          className="w-full bg-black/60 border border-white/10 rounded-lg py-1 px-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                                        />
                                      </div>
                                      <div>
                                        <div className="flex justify-between text-[10px] font-mono text-gray-400 uppercase mb-1">
                                          <span>Simulation Labs Complete</span>
                                          <span className="text-cyan-400 font-bold">{editLabsCompleted} Labs</span>
                                        </div>
                                        <input 
                                          type="range" 
                                          min="0" 
                                          max="25"
                                          value={editLabsCompleted}
                                          onChange={(e) => setEditLabsCompleted(Number(e.target.value))}
                                          className="w-full accent-cyan-400 cursor-pointer"
                                        />
                                      </div>
                                    </div>

                                    {/* Specialization program tracks locks manager */}
                                    <div className="pt-2 border-t border-white/5 space-y-2">
                                      <label className="block text-[10px] font-mono text-gray-400 uppercase tracking-widest">
                                        🔓 COURSE SPECIALIZATION ACCESS (TOGGLE TO LICENSE)
                                      </label>
                                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                        {PROGRAMS.map(prog => {
                                          const isUnlocked = editPurchasedPrograms.includes(prog.id);
                                          return (
                                            <button
                                              key={prog.id}
                                              type="button"
                                              onClick={() => {
                                                if (isUnlocked) {
                                                  setEditPurchasedPrograms(editPurchasedPrograms.filter(id => id !== prog.id));
                                                } else {
                                                  setEditPurchasedPrograms([...editPurchasedPrograms, prog.id]);
                                                }
                                              }}
                                              className={`p-2 rounded-lg text-left border text-[10px] transition-all flex flex-col gap-0.5 cursor-pointer ${
                                                isUnlocked
                                                  ? 'bg-indigo-500/15 border-indigo-500/40 text-indigo-200'
                                                  : 'bg-black/30 border-white/5 text-gray-500 hover:text-gray-300'
                                              }`}
                                            >
                                              <span className="font-bold truncate">{prog.title}</span>
                                              <span className="font-mono text-[8px] opacity-60">ID: {prog.id}</span>
                                            </button>
                                          );
                                        })}
                                      </div>
                                    </div>

                                    {/* Milestones completed checker */}
                                    <div className="pt-2 border-t border-white/5 space-y-2">
                                      <div className="flex justify-between items-center">
                                        <label className="block text-[10px] font-mono text-gray-400 uppercase tracking-widest">
                                          🏆 SEQUENCE LAB MILESTONES COMPLETED (5/5 REQUIRED FOR CERTIFICATION)
                                        </label>
                                        <button
                                          type="button"
                                          onClick={() => setEditCompletedNodes(['w1-2', 'w3-5', 'w6-8', 'w9-10', 'w11-12'])}
                                          className="text-[9px] font-mono text-amber-400 hover:underline uppercase"
                                        >
                                          ⚡ Complete All Milestones
                                        </button>
                                      </div>
                                      <div className="flex flex-wrap gap-2">
                                        {['w1-2', 'w3-5', 'w6-8', 'w9-10', 'w11-12'].map((nodeId, idx) => {
                                          const done = editCompletedNodes.includes(nodeId);
                                          return (
                                            <button
                                              key={nodeId}
                                              type="button"
                                              onClick={() => {
                                                if (done) {
                                                  setEditCompletedNodes(editCompletedNodes.filter(n => n !== nodeId));
                                                } else {
                                                  setEditCompletedNodes([...editCompletedNodes, nodeId]);
                                                }
                                              }}
                                              className={`px-3 py-1.5 rounded-lg border text-[10px] font-mono font-bold tracking-tight transition-all cursor-pointer ${
                                                done
                                                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                                                  : 'bg-black/30 border-white/5 text-gray-500 hover:text-gray-300'
                                              }`}
                                            >
                                              {done ? '✅' : '⚫'} Milestone {idx + 1} ({nodeId})
                                            </button>
                                          );
                                        })}
                                      </div>
                                    </div>

                                    {/* Form Footer Buttons */}
                                    <div className="flex justify-end gap-2.5 pt-3 border-t border-white/5">
                                      <button
                                        type="button"
                                        onClick={handleCancelEdit}
                                        className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 font-mono cursor-pointer"
                                      >
                                        CANCEL
                                      </button>
                                      <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-mono transition-colors shadow-lg shadow-indigo-500/10 cursor-pointer"
                                      >
                                        SAVE_CHANGES
                                      </button>
                                    </div>
                                  </form>
                                </td>
                              ) : (
                                <>
                                  <td className="py-4 px-3 text-left">
                                    <span className="block font-bold text-white text-sm tracking-tight">{user.name}</span>
                                    <span className="block text-[10px] font-mono text-gray-400 mt-0.5">{user.email}</span>
                                  </td>
                                  <td className="py-4 px-3 font-medium text-gray-350">
                                    {user.college || <span className="italic text-gray-650">No college set</span>}
                                  </td>
                                  <td className="py-4 px-3 text-left">
                                    <div className="font-mono font-bold text-cyan-400">
                                      Lvl {user.level} <span className="text-[10px] text-gray-500">({user.xp} XP)</span>
                                    </div>
                                    <div className="text-[10px] font-semibold text-gray-450 mt-0.5">
                                      🔬 {user.labsCompleted} simulation labs
                                    </div>
                                  </td>
                                  <td className="py-4 px-3 text-center">
                                    <div className="flex flex-col items-center gap-2">
                                      {/* Cert verification badge */}
                                      {userCertified ? (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-bold tracking-wider font-mono animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.1)]">
                                          <Award className="w-3.5 h-3.5 shrink-0" />
                                          🏆 GRADUATE CERTIFIED ({completedCount}/5)
                                        </span>
                                      ) : (
                                        <div className="flex items-center gap-2">
                                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-gray-500/15 border border-white/5 text-gray-400 text-[9.5px] font-mono font-bold">
                                            UNGRADUATED ({completedCount}/5 Milestone)
                                          </span>
                                          <button
                                            onClick={() => handleFastTrackCertify(user)}
                                            className="px-2 py-0.5 rounded bg-amber-500/10 hover:bg-amber-500 hover:text-black border border-amber-500/30 font-mono text-[9px] font-black text-amber-300 transition-all cursor-pointer shadow-sm shadow-amber-500/5 uppercase"
                                            title="Directly complete all milestones, level-up to 15, and issue credentials."
                                          >
                                            ⚡ CERTIFY STUD
                                          </button>
                                        </div>
                                      )}

                                      {/* Interactive specializations unlocked indicator tag list */}
                                      <div className="flex flex-wrap justify-center gap-1">
                                        {PROGRAMS.map(prog => {
                                          const owns = user.purchasedPrograms?.includes(prog.id);
                                          const shortCode = prog.id.replace('prog-', '').toUpperCase();
                                          return (
                                            <button
                                              key={prog.id}
                                              onClick={() => handleToggleProgramAccess(user, prog.id)}
                                              className={`px-1.5 py-0.5 rounded text-[8.5px] font-bold transition-all cursor-pointer ${
                                                owns 
                                                  ? 'bg-indigo-500/20 border border-indigo-400/30 text-indigo-300' 
                                                  : 'bg-black/40 border border-white/5 text-gray-600 hover:text-gray-400 hover:border-gray-500'
                                              }`}
                                              title={`Specialization: ${prog.title}. Click to unlock or lock.`}
                                            >
                                              {owns ? '🔓 ' : '🔒 '} {shortCode}
                                            </button>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  </td>
                                  <td className="py-4 px-3 text-right">
                                    <button
                                      onClick={() => handleStartEdit(user)}
                                      className="px-3 py-1.5 text-xs font-bold rounded-lg bg-white/5 border border-white/10 hover:bg-indigo-500/20 hover:border-indigo-555/40 hover:text-cyan-300 transition-all font-mono cursor-pointer"
                                    >
                                      ⚙️ Edit parameters
                                    </button>
                                  </td>
                                </>
                              )}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })()}

          {/* tab 3. LIVE LOGIN AUDITS */}
          {activeTab === 'logins' && (
            <div className="space-y-3 text-left">
              {loginAudits.length === 0 ? (
                <div className="text-center py-16 text-gray-500 font-mono text-xs">
                  NO_LOGIN_AUDITS_REPORTED
                </div>
              ) : (
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center px-1 mb-2">
                    <span className="text-[10px] font-mono font-bold text-gray-500 tracking-wider">CHRONOLOGICAL_STREAM</span>
                    <span className="text-[10px] font-mono text-cyan-400">Total logs: {loginAudits.length}</span>
                  </div>
                  {loginAudits.map((audit, idx) => (
                    <div 
                      key={audit.id || idx}
                      className="p-3.5 rounded-xl bg-black/45 hover:bg-black/60 border border-white/5 font-mono text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <Key className="w-3.5 h-3.5 text-purple-400" />
                        <div>
                          <span className="text-gray-200 font-sans font-bold">{audit.name || "Enrolled Student"}</span>
                          <span className="text-gray-500 mx-2">|</span>
                          <span className="text-gray-400">{audit.email}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-3">
                        <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-purple-300">
                          {audit.provider}
                        </span>
                        <span className="text-[11px] text-gray-500">
                          {new Date(audit.timestamp).toLocaleTimeString() || audit.timestamp}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* tab 4. COURSE PURCHASE TRANSACTIONS (BOTH PHONEPE AND CASHFREE SUCCESS/FAILURE RECORDS) */}
          {activeTab === 'transactions' && (() => {
            const successTxns = transactions.filter(t => t.status === 'success');
            const failedTxns = transactions.filter(t => t.status === 'failed');
            const totalVol = successTxns.reduce((sum, t) => sum + (t.amount || 0), 0);
            const failedVol = failedTxns.reduce((sum, t) => sum + (t.amount || 0), 0);
            const rate = transactions.length > 0 ? Math.round((successTxns.length / transactions.length) * 100) : 100;

            const filteredTxns = transactions.filter(t => {
              if (txnFilter === 'success' && t.status !== 'success') return false;
              if (txnFilter === 'failed' && t.status !== 'failed') return false;
              
              if (!searchQuery.trim()) return true;
              const q = searchQuery.toLowerCase();
              return (
                t.userName.toLowerCase().includes(q) ||
                t.userEmail.toLowerCase().includes(q) ||
                t.programTitle.toLowerCase().includes(q) ||
                t.paymentGateway.toLowerCase().includes(q) ||
                t.id.toLowerCase().includes(q)
              );
            });

            return (
              <div className="space-y-6 text-left">
                {/* Visual telemetry metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                    <span className="block text-[10px] font-mono text-emerald-400 uppercase tracking-widest mb-1">Success Volume (Earned)</span>
                    <strong className="text-xl md:text-2xl font-black text-emerald-300 font-display">₹{totalVol.toLocaleString()}</strong>
                    <span className="block text-[10px] text-gray-500 mt-1">{successTxns.length} settled orders</span>
                  </div>
                  <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/20">
                    <span className="block text-[10px] font-mono text-rose-400 uppercase tracking-widest mb-1">Failed Attempts volume</span>
                    <strong className="text-xl md:text-2xl font-black text-rose-300 font-display">₹{failedVol.toLocaleString()}</strong>
                    <span className="block text-[10px] text-gray-500 mt-1">{failedTxns.length} unsuccessful logs</span>
                  </div>
                  <div className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20">
                    <span className="block text-[10px] font-mono text-cyan-400 uppercase tracking-widest mb-1">Ledger Conversion Rate</span>
                    <strong className="text-xl md:text-2xl font-black text-cyan-300 font-display">{rate}%</strong>
                    <span className="block text-[10px] text-gray-500 mt-1">{transactions.length} total orders processed</span>
                  </div>
                </div>

                {/* Subpill filters */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex gap-2 p-1 bg-black/45 rounded-xl border border-white/5">
                    <button
                      onClick={() => setTxnFilter('all')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                        txnFilter === 'all'
                          ? 'bg-white/10 text-white'
                          : 'text-gray-400 hover:text-gray-200'
                      }`}
                    >
                      All ({transactions.length})
                    </button>
                    <button
                      onClick={() => setTxnFilter('success')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5 ${
                        txnFilter === 'success'
                          ? 'bg-emerald-500/25 text-emerald-200 border border-emerald-500/20'
                          : 'text-gray-400 hover:text-gray-200'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      Success ({successTxns.length})
                    </button>
                    <button
                      onClick={() => setTxnFilter('failed')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5 ${
                        txnFilter === 'failed'
                          ? 'bg-red-500/25 text-red-200 border border-red-500/20'
                          : 'text-gray-400 hover:text-gray-200'
                      }`}
                    >
                      <XCircle className="w-3.5 h-3.5 text-red-400" />
                      Failed ({failedTxns.length})
                    </button>
                  </div>
                  <span className="text-[10px] font-mono text-gray-500">
                    Showing {filteredTxns.length} records
                  </span>
                </div>

                {/* Main Table view */}
                {filteredTxns.length === 0 ? (
                  <div className="text-center py-16 bg-[#0D0B14]/40 rounded-xl border border-white/5">
                    <AlertCircle className="w-8 h-8 text-gray-600 mx-auto mb-2 animate-pulse" />
                    <span className="block font-mono text-xs text-gray-500">NO_MATCHING_TRANSACTION_ENTRIES_FOUND</span>
                    <p className="text-[11px] text-gray-600 font-sans mt-1">Adjust search metrics or filters to reveal hidden ledger logs.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-xl border border-white/5 bg-[#0D0B14]/30">
                    <table className="w-full text-left font-sans text-xs">
                      <thead>
                        <tr className="bg-black/45 border-b border-white/5 font-mono text-[10px] text-gray-500 uppercase tracking-wider">
                          <th className="py-3 px-4">TXN REFERENCE / TIME</th>
                          <th className="py-3 px-4">STUDENT INFORMATION</th>
                          <th className="py-3 px-4">COHORT COURSE SPECIALIZATION</th>
                          <th className="py-3 px-4">AMOUNT</th>
                          <th className="py-3 px-4">GATEWAY PLATFORM</th>
                          <th className="py-3 px-4">{txnFilter === 'failed' ? 'FAILURE CAUSE' : 'STATUS'}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.03]">
                        {filteredTxns.map((txn, index) => {
                          const isSuccess = txn.status === 'success';
                          const isPhonePe = txn.paymentGateway?.toLowerCase() === 'phonepe';
                          return (
                            <tr key={txn.id || index} className="hover:bg-white/[0.02] transition-colors">
                              <td className="py-3.5 px-4 font-mono">
                                <span className="block text-gray-300 font-bold tracking-tight">{(txn.id || '').replace('txn-', 'TXN-')}</span>
                                <span className="block text-[10px] text-gray-500 mt-0.5">
                                  {txn.timestamp ? new Date(txn.timestamp).toLocaleString("en-IN", {
                                    dateStyle: 'short',
                                    timeStyle: 'short'
                                  }) : 'N/A'}
                                </span>
                              </td>
                              <td className="py-3.5 px-4">
                                <span className="block text-white font-bold">{txn.userName}</span>
                                <span className="block text-[10.5px] text-gray-400 font-mono mt-0.5">{txn.userEmail}</span>
                              </td>
                              <td className="py-3.5 px-4">
                                <span className="block text-indigo-200 font-semibold max-w-xs sm:truncate">{txn.programTitle}</span>
                                <span className="block text-[10px] text-gray-500 mt-0.5 font-mono">ID: {txn.programId}</span>
                              </td>
                              <td className="py-3.5 px-4 font-mono">
                                <strong className={`text-sm ${isSuccess ? 'text-emerald-400' : 'text-rose-400'}`}>
                                  ₹{txn.amount?.toLocaleString()}
                                </strong>
                              </td>
                              <td className="py-3.5 px-4">
                                {isPhonePe ? (
                                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#5F259F]/20 border border-[#5F259F]/40 text-[#A370F7]">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#A370F7] animate-pulse"></span>
                                    PhonePe
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-950/20 border border-cyan-500/30 text-cyan-400">
                                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                                    Cashfree
                                  </span>
                                )}
                              </td>
                              <td className="py-3.5 px-4">
                                {isSuccess ? (
                                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10.5px] font-medium">
                                    <CheckCircle2 className="w-3 h-3 shrink-0" />
                                    SUCCESSFUL PAID
                                  </span>
                                ) : (
                                  <div className="space-y-0.5 select-text">
                                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-405 border border-rose-500/20 text-[10.5px] font-medium text-rose-400">
                                      <XCircle className="w-3 h-3 shrink-0" />
                                      FAILED ATTEMPT
                                    </span>
                                    {txn.errorMessage && (
                                      <p className="text-[10px] text-rose-400/80 font-mono max-w-[180px] break-words">
                                        ❌ {txn.errorMessage}
                                      </p>
                                    )}
                                  </div>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })()}

        </div>
      </div>

    </div>
  );
}
