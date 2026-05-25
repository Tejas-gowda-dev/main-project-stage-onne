import React from 'react';
import { Key } from 'lucide-react';
import PaginationControls from './PaginationControls';

export interface LoginAudit {
  id: string;
  email: string;
  name: string;
  timestamp: string;
  provider: string;
}

interface LoginsTabProps {
  paginatedLoginAudits: LoginAudit[];
  loginPage: number;
  loginTotalPages: number;
  setLoginPage: (page: number) => void;
}

export default function LoginsTab({
  paginatedLoginAudits,
  loginPage,
  loginTotalPages,
  setLoginPage
}: LoginsTabProps) {
  return (
    <div className="space-y-3 text-left">
      {paginatedLoginAudits.length === 0 ? (
        <div className="text-center py-16 text-gray-500 font-mono text-xs">
          NO_LOGIN_AUDITS_REPORTED
        </div>
      ) : (
        <>
          <div className="space-y-2.5">
            <div className="flex justify-between items-center px-1 mb-2 font-mono">
              <span className="text-[10px] font-bold text-gray-500 tracking-wider">CHRONOLOGICAL_STREAM</span>
              <span className="text-[10px] text-cyan-400">Showing page entries ({paginatedLoginAudits.length} logs)</span>
            </div>
            {paginatedLoginAudits.map((audit, idx) => (
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
          <PaginationControls 
            currentPage={loginPage} 
            totalPages={loginTotalPages} 
            onPageChange={setLoginPage} 
          />
        </>
      )}
    </div>
  );
}
