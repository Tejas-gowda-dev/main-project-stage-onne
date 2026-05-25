import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Users, History, FileText, ShieldCheck, 
  Search, RefreshCw, UserCheck, AlertCircle,
  CreditCard, Settings
} from 'lucide-react';
import GlowButton from './GlowButton';

// Imported modular components
import RequestsTab, { ProfileRequest } from './admin/RequestsTab';
import UsersTab, { UserRecord } from './admin/UsersTab';
import LoginsTab, { LoginAudit } from './admin/LoginsTab';
import TransactionsTab, { TransactionRecord } from './admin/TransactionsTab';

interface AdminPanelProps {
  onBackToClass: () => void;
}

// Re-export types for backward compatibility across the codebase
export type { UserRecord, ProfileRequest, LoginAudit, TransactionRecord };

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

  // Paginated states
  const [paginatedUsers, setPaginatedUsers] = useState<UserRecord[]>([]);
  const [paginatedTransactions, setPaginatedTransactions] = useState<TransactionRecord[]>([]);
  const [paginatedLoginAudits, setPaginatedLoginAudits] = useState<LoginAudit[]>([]);
  const [paginatedProfileRequests, setPaginatedProfileRequests] = useState<ProfileRequest[]>([]);

  // Page index tracking structures
  const [userPage, setUserPage] = useState(1);
  const [userTotalPages, setUserTotalPages] = useState(1);

  const [txnPage, setTxnPage] = useState(1);
  const [txnTotalPages, setTxnTotalPages] = useState(1);

  const [loginPage, setLoginPage] = useState(1);
  const [loginTotalPages, setLoginTotalPages] = useState(1);

  const [reqPage, setReqPage] = useState(1);
  const [reqTotalPages, setReqTotalPages] = useState(1);

  const ITEMS_PER_PAGE = 10;

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

  const fetchPaginatedUsers = async (page: number, search: string) => {
    try {
      const res = await fetch(`/api/admin/users/paginated?page=${page}&limit=${ITEMS_PER_PAGE}&search=${encodeURIComponent(search)}`);
      if (res.ok) {
        const data = await res.json();
        setPaginatedUsers(data.items || []);
        setUserTotalPages(data.totalPages || 1);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchPaginatedTransactions = async (page: number, search: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/transactions/paginated?page=${page}&limit=${ITEMS_PER_PAGE}&search=${encodeURIComponent(search)}&status=${status}`);
      if (res.ok) {
        const data = await res.json();
        setPaginatedTransactions(data.items || []);
        setTxnTotalPages(data.totalPages || 1);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchPaginatedLogins = async (page: number, search: string) => {
    try {
      const res = await fetch(`/api/admin/logins/paginated?page=${page}&limit=${ITEMS_PER_PAGE}&search=${encodeURIComponent(search)}`);
      if (res.ok) {
        const data = await res.json();
        setPaginatedLoginAudits(data.items || []);
        setLoginTotalPages(data.totalPages || 1);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchPaginatedRequests = async (page: number) => {
    try {
      const res = await fetch(`/api/admin/requests/paginated?page=${page}&limit=${ITEMS_PER_PAGE}`);
      if (res.ok) {
        const data = await res.json();
        setPaginatedProfileRequests(data.items || []);
        setReqTotalPages(data.totalPages || 1);
      }
    } catch (e) {
      console.error(e);
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

      // Refresh paginated values
      fetchPaginatedUsers(userPage, searchQuery);
      fetchPaginatedTransactions(txnPage, searchQuery, txnFilter);
      fetchPaginatedLogins(loginPage, searchQuery);
      fetchPaginatedRequests(reqPage);
    } catch (err: any) {
      console.error(err);
      setStatusMsg({ type: 'error', text: err.message || "Endpoint error retrieving telemetry feeds." });
    } finally {
      setIsLoading(false);
    }
  };

  // Reset page index on filter/search modifications for flawless interaction UX
  useEffect(() => {
    setUserPage(1);
    setTxnPage(1);
    setLoginPage(1);
    setReqPage(1);
  }, [searchQuery, txnFilter, activeTab]);

  // Load paginated data when selectors modify
  useEffect(() => {
    if (activeTab === 'users') {
      fetchPaginatedUsers(userPage, searchQuery);
    } else if (activeTab === 'transactions') {
      fetchPaginatedTransactions(txnPage, searchQuery, txnFilter);
    } {
      fetchPaginatedLogins(loginPage, searchQuery);
    } if (activeTab === 'requests') {
      fetchPaginatedRequests(reqPage);
    }
  }, [activeTab, searchQuery, txnFilter, userPage, txnPage, loginPage, reqPage]);

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
            <span className="text-[10px] font-mono tracking-widest text-indigo-400 font-bold uppercase block mb-0.5">Control Center Mode</span>
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
          
          <GlowButton onClick={onBackToClass} variant="cyan" className="text-xs font-semibold py-2 px-4 shadow-[0_0_12px_rgba(6,182,212,0.15)] animate-shimmer">
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
          <UserCheck className="w-5 h-5 shrink-0" />
          <span>{statusMsg.text}</span>
        </motion.div>
      )}

      {/* Internal Control Tabs Row */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Navigation panel */}
        <div className="space-y-3 bg-[#111827]/75 p-4 rounded-2xl border border-white/5 backdrop-blur-sm">
          <span className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest px-2 mb-2 font-bold">TELEMETRY_FEEDS</span>
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
            <span className="font-mono text-[10px] bg-cyan-500/15 border border-cyan-500/20 text-cyan-200 px-2 py-0.5 rounded-full font-bold">
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
            <span className="font-mono text-[10px] bg-purple-500/15 border border-purple-500/20 text-purple-200 px-2 py-0.5 rounded-full font-bold">
              {loginAudits.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('transactions')}
            className={`w-full flex items-center justify-between p-3.5 rounded-xl transition-all font-display text-xs font-semibold uppercase tracking-wider ${
              activeTab === 'transactions'
                ? 'bg-gradient-to-r from-indigo-500/15 to-cyan-500/5 border border-indigo-500/40 text-cyan-300 shadow-[0_0_12px_rgba(99,102,241,0.2)]'
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

          {/* Conditional rendering of modular tabs */}
          {activeTab === 'requests' && (
            <RequestsTab 
              paginatedProfileRequests={paginatedProfileRequests}
              reqPage={reqPage}
              reqTotalPages={reqTotalPages}
              setReqPage={setReqPage}
              handleRequestAction={handleRequestAction}
            />
          )}

          {activeTab === 'users' && (
            <UsersTab 
              users={users}
              paginatedUsers={paginatedUsers}
              editingUserId={editingUserId}
              showAddForm={showAddForm}
              setShowAddForm={setShowAddForm}
              newUserName={newUserName}
              setNewUserName={setNewUserName}
              newUserEmail={newUserEmail}
              setNewUserEmail={setNewUserEmail}
              newUserPassword={newUserPassword}
              setNewUserPassword={setNewUserPassword}
              newUserCollege={newUserCollege}
              setNewUserCollege={setNewUserCollege}
              handleCreateUser={handleCreateUser}
              handleUpdateUser={handleUpdateUser}
              handleStartEdit={handleStartEdit}
              handleCancelEdit={handleCancelEdit}
              handleToggleProgramAccess={handleToggleProgramAccess}
              handleFastTrackCertify={handleFastTrackCertify}
              userPage={userPage}
              userTotalPages={userTotalPages}
              setUserPage={setUserPage}
              isLoading={isLoading}
              editName={editName}
              setEditName={setEditName}
              editEmail={editEmail}
              setEditEmail={setEditEmail}
              editPassword={editPassword}
              setEditPassword={setEditPassword}
              editCollege={editCollege}
              setEditCollege={setEditCollege}
              editLevel={editLevel}
              setEditLevel={setEditLevel}
              editXp={editXp}
              setEditXp={setEditXp}
              editLabsCompleted={editLabsCompleted}
              setEditLabsCompleted={setEditLabsCompleted}
              editPurchasedPrograms={editPurchasedPrograms}
              setEditPurchasedPrograms={setEditPurchasedPrograms}
              editCompletedNodes={editCompletedNodes}
              setEditCompletedNodes={setEditCompletedNodes}
            />
          )}

          {activeTab === 'logins' && (
            <LoginsTab 
              paginatedLoginAudits={paginatedLoginAudits}
              loginPage={loginPage}
              loginTotalPages={loginTotalPages}
              setLoginPage={setLoginPage}
            />
          )}

          {activeTab === 'transactions' && (
            <TransactionsTab 
              transactions={transactions}
              paginatedTransactions={paginatedTransactions}
              txnFilter={txnFilter}
              setTxnFilter={setTxnFilter}
              txnPage={txnPage}
              txnTotalPages={txnTotalPages}
              setTxnPage={setTxnPage}
              searchQuery={searchQuery}
            />
          )}

        </div>
      </div>

    </div>
  );
}
