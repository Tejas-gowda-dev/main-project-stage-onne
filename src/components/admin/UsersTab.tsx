import React from 'react';
import { Award, Users, GraduationCap, TrendingUp, Settings, BookOpen } from 'lucide-react';
import { PROGRAMS } from '../../data';
import PaginationControls from './PaginationControls';

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  college?: string;
  level: number;
  xp: number;
  streak: number;
  completedNodes: string[];
  activeNodeId?: string;
  badges: string[];
  labsCompleted: number;
  password?: string;
  purchasedPrograms?: string[];
}

interface UsersTabProps {
  users: UserRecord[];
  paginatedUsers: UserRecord[];
  editingUserId: string | null;
  showAddForm: boolean;
  setShowAddForm: (show: boolean) => void;
  newUserName: string;
  setNewUserName: (v: string) => void;
  newUserEmail: string;
  setNewUserEmail: (v: string) => void;
  newUserPassword: string;
  setNewUserPassword: (v: string) => void;
  newUserCollege: string;
  setNewUserCollege: (v: string) => void;
  handleCreateUser: (e: React.FormEvent) => void;
  handleUpdateUser: (e: React.FormEvent) => void;
  handleStartEdit: (u: any) => void;
  handleCancelEdit: () => void;
  handleToggleProgramAccess: (u: any, progId: string) => void;
  handleFastTrackCertify: (u: any) => void;
  userPage: number;
  userTotalPages: number;
  setUserPage: (v: number) => void;
  isLoading: boolean;

  // Edit fields
  editName: string;
  setEditName: (v: string) => void;
  editEmail: string;
  setEditEmail: (v: string) => void;
  editPassword: string;
  setEditPassword: (v: string) => void;
  editCollege: string;
  setEditCollege: (v: string) => void;
  editLevel: number;
  setEditLevel: (v: number) => void;
  editXp: number;
  setEditXp: (v: number) => void;
  editLabsCompleted: number;
  setEditLabsCompleted: (v: number) => void;
  editPurchasedPrograms: string[];
  setEditPurchasedPrograms: (v: string[]) => void;
  editCompletedNodes: string[];
  setEditCompletedNodes: (v: string[]) => void;
}

export default function UsersTab({
  users,
  paginatedUsers,
  editingUserId,
  showAddForm,
  setShowAddForm,
  newUserName,
  setNewUserName,
  newUserEmail,
  setNewUserEmail,
  newUserPassword,
  setNewUserPassword,
  newUserCollege,
  setNewUserCollege,
  handleCreateUser,
  handleUpdateUser,
  handleStartEdit,
  handleCancelEdit,
  handleToggleProgramAccess,
  handleFastTrackCertify,
  userPage,
  userTotalPages,
  setUserPage,
  isLoading,

  // edit fields
  editName,
  setEditName,
  editEmail,
  setEditEmail,
  editPassword,
  setEditPassword,
  editCollege,
  setEditCollege,
  editLevel,
  setEditLevel,
  editXp,
  setEditXp,
  editLabsCompleted,
  setEditLabsCompleted,
  editPurchasedPrograms,
  setEditPurchasedPrograms,
  editCompletedNodes,
  setEditCompletedNodes
}: UsersTabProps) {
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
            <span className="block text-[10px] font-mono text-cyan-400 uppercase tracking-widest mb-1.5 font-bold">Registered Cohort</span>
            <Users className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <strong className="text-2xl font-black text-white font-display block">{totalStudents}</strong>
          <span className="block text-[10px] text-gray-500 mt-1">Enrolled and verified students</span>
        </div>

        <div className="p-4 rounded-xl bg-amber-500/[0.03] border border-amber-500/20">
          <div className="flex justify-between items-start">
            <span className="block text-[10px] font-mono text-amber-400 uppercase tracking-widest mb-1.5 font-bold">Certified Graduates</span>
            <Award className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <strong className="text-2xl font-black text-amber-300 font-display block">
            {certifiedCount} <span className="text-xs text-gray-500 font-sans font-normal">/ {totalStudents}</span>
          </strong>
          <span className="block text-[10px] text-gray-500 mt-1 font-sans">Cleared all 5 sequential milestones</span>
        </div>

        <div className="p-4 rounded-xl bg-indigo-500/[0.03] border border-indigo-500/20">
          <div className="flex justify-between items-start">
            <span className="block text-[10px] font-mono text-indigo-400 uppercase tracking-widest mb-1.5 font-bold">Certification Goal Rate</span>
            <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <strong className="text-2xl font-black text-indigo-300 font-display block">{certRate}%</strong>
          <div className="w-full bg-indigo-950/40 rounded-full h-1 mt-2 overflow-hidden">
            <div className="bg-gradient-to-r from-cyan-400 to-indigo-500 h-1 rounded-full transition-all duration-500" style={{ width: `${certRate}%` }}></div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-purple-500/[0.03] border border-purple-500/20">
          <div className="flex justify-between items-start">
            <span className="block text-[10px] font-mono text-purple-400 uppercase tracking-widest mb-1.5 font-bold">Simulation Velocity</span>
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
        <div className="text-xs text-gray-400 font-mono flex items-center gap-1.5">
          <Settings className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
          COHORT_PROFILES_AND_CERTIFICATION_DECIDER
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-3 py-1.5 font-mono text-[10px] font-bold text-cyan-400 hover:text-white bg-cyan-500/15 border border-cyan-500/25 hover:bg-cyan-500 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 animate-pulse"
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

      {paginatedUsers.length === 0 ? (
        <div className="text-center py-16 text-gray-500 font-mono text-xs">
          NO_COHORT_STUDENTS_MATCHING_SPEC
        </div>
      ) : (
        <>
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
                {paginatedUsers.map((user) => {
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
                          <td className="py-4 px-3 font-medium text-gray-300">
                            {user.college || <span className="italic text-gray-600">No college set</span>}
                          </td>
                          <td className="py-4 px-3 text-left">
                            <div className="font-mono font-bold text-cyan-400">
                              Lvl {user.level} <span className="text-[10px] text-gray-500">({user.xp} XP)</span>
                            </div>
                            <div className="text-[10px] font-semibold text-gray-400 mt-0.5">
                              🔬 {user.labsCompleted} simulation labs
                            </div>
                          </td>
                          <td className="py-4 px-3 text-center">
                            <div className="flex flex-col items-center gap-2">
                              {/* Cert verification badge */}
                              {userCertified ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-bold tracking-wider font-mono animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.1)]">
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
                            <div className="flex items-center justify-end gap-1.5">
                              <a
                                href={`/api/assets/badge/b3.svg?userId=${user.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2.5 py-1.5 text-[10px] font-mono font-bold rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/20 hover:text-white transition-all text-center"
                                title="View verified achievement badge credentials in a new tab"
                              >
                                Badge Vector
                              </a>
                              <button
                                type="button"
                                onClick={() => handleStartEdit(user)}
                                className="px-3 py-1.5 text-xs font-bold rounded-lg bg-white/5 border border-white/10 hover:bg-indigo-500/20 hover:border-indigo-500/40 hover:text-cyan-300 transition-all font-mono cursor-pointer"
                              >
                                ⚙️ Edit parameters
                              </button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <PaginationControls 
            currentPage={userPage} 
            totalPages={userTotalPages} 
            onPageChange={setUserPage} 
          />
        </>
      )}
    </div>
  );
}
