import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Users, History, FileText, Check, X, ShieldCheck, 
  Search, RefreshCw, Key, ArrowRight, UserCheck, AlertCircle 
} from 'lucide-react';
import GlowButton from './GlowButton';

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

export default function AdminPanel({ onBackToClass }: AdminPanelProps) {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [profileRequests, setProfileRequests] = useState<ProfileRequest[]>([]);
  const [loginAudits, setLoginAudits] = useState<LoginAudit[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'users' | 'requests' | 'logins'>('requests');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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
        </div>

        {/* Central Display Feed */}
        <div className="lg:col-span-3 bg-[#111827]/75 p-6 rounded-2xl border border-white/5 min-h-[420px] relative">
          
          {/* SEARCH BAR COMPONENT */}
          <div className="w-full flex items-center justify-between gap-4 pb-4 border-b border-white/5 mb-6">
            <h3 className="font-display text-sm font-extrabold uppercase text-gray-300 tracking-wider">
              {activeTab === 'users' && "Registered Candidates (Total View)"}
              {activeTab === 'requests' && "Pending Profile Correction Tickets"}
              {activeTab === 'logins' && "Live Logins Telemetry Records"}
            </h3>
            {activeTab === 'users' && (
              <div className="relative max-w-xs w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input 
                  type="text"
                  placeholder="Search students..."
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
          {activeTab === 'users' && (
            <div className="space-y-3">
              {filteredUsers.length === 0 ? (
                <div className="text-center py-16 text-gray-500 font-mono text-xs">
                  NO_COHORT_STUDENTS_MATCHING_SPEC
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/5 font-mono text-[10px] text-gray-500 uppercase tracking-widest">
                        <th className="py-3 px-2">Student Name / Email</th>
                        <th className="py-3 px-2">College Name</th>
                        <th className="py-3 px-2">Level / XP</th>
                        <th className="py-3 px-2 text-center">Milestones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-white/5 transition-colors">
                          <td className="py-4 px-2">
                            <span className="block font-bold text-white text-sm">{user.name}</span>
                            <span className="block text-[10px] font-mono text-gray-500">{user.email}</span>
                          </td>
                          <td className="py-4 px-2 font-medium text-gray-300">
                            {user.college || <span className="italic text-gray-600">No college set</span>}
                          </td>
                          <td className="py-4 px-2 font-mono text-cyan-400 font-bold">
                            Lvl {user.level} <span className="text-[10px] text-gray-500">({user.xp} XP)</span>
                          </td>
                          <td className="py-4 px-2 text-center font-mono">
                            <span className="px-2 py-0.5 rounded bg-indigo-500/15 border border-indigo-500/25 text-indigo-300 font-bold">
                              {user.labsCompleted} labs
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

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

        </div>
      </div>

    </div>
  );
}
