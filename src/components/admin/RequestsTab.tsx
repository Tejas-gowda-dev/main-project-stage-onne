import React from 'react';
import { Check, X } from 'lucide-react';
import PaginationControls from './PaginationControls';

export interface ProfileRequest {
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

interface RequestsTabProps {
  paginatedProfileRequests: ProfileRequest[];
  reqPage: number;
  reqTotalPages: number;
  setReqPage: (page: number) => void;
  handleRequestAction: (requestId: string, action: 'approve' | 'reject') => void;
}

export default function RequestsTab({
  paginatedProfileRequests,
  reqPage,
  reqTotalPages,
  setReqPage,
  handleRequestAction
}: RequestsTabProps) {
  return (
    <div className="space-y-4">
      {paginatedProfileRequests.length === 0 ? (
        <div className="text-center py-16 text-gray-500 font-mono text-xs">
          NO_PROFILE_CHANGE_REQUESTS_LOGGED
        </div>
      ) : (
        <>
          {paginatedProfileRequests.map((req) => (
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
                    <div className="font-sans font-semibold text-gray-300 font-bold">Name: <span className="line-through text-gray-500">{req.currentName || 'Not Set'}</span></div>
                    <div className="font-sans font-semibold text-gray-300 font-bold">College: <span className="line-through text-gray-500">{req.currentCollege || 'Not Set'}</span></div>
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
                    type="button"
                    onClick={() => handleRequestAction(req.id, 'approve')}
                    className="flex items-center gap-1.5 px-3 py-1.5 font-mono text-[10px] font-bold text-emerald-400 hover:text-white bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500 hover:border-emerald-500 rounded-lg transition-all cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    APPROVE
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRequestAction(req.id, 'reject')}
                    className="flex items-center gap-1.5 px-3 py-1.5 font-mono text-[10px] font-bold text-red-400 hover:text-white bg-red-500/10 border border-red-500/20 hover:bg-red-500 hover:border-red-500 rounded-lg transition-all cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    REJECT
                  </button>
                </div>
              )}
            </div>
          ))}
          <PaginationControls 
            currentPage={reqPage} 
            totalPages={reqTotalPages} 
            onPageChange={setReqPage} 
          />
        </>
      )}
    </div>
  );
}
