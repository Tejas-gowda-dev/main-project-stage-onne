import React from 'react';
import { AlertCircle, CheckCircle2, XCircle, FileText } from 'lucide-react';
import PaginationControls from './PaginationControls';

export interface TransactionRecord {
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

interface TransactionsTabProps {
  transactions: TransactionRecord[];
  paginatedTransactions: TransactionRecord[];
  txnFilter: 'all' | 'success' | 'failed';
  setTxnFilter: (filter: 'all' | 'success' | 'failed') => void;
  txnPage: number;
  txnTotalPages: number;
  setTxnPage: (page: number) => void;
  searchQuery: string;
}

export default function TransactionsTab({
  transactions,
  paginatedTransactions,
  txnFilter,
  setTxnFilter,
  txnPage,
  txnTotalPages,
  setTxnPage,
  searchQuery
}: TransactionsTabProps) {
  const successTxns = transactions.filter(t => t.status === 'success');
  const failedTxns = transactions.filter(t => t.status === 'failed');
  const totalVol = successTxns.reduce((sum, t) => sum + (t.amount || 0), 0);
  const failedVol = failedTxns.reduce((sum, t) => sum + (t.amount || 0), 0);
  const rate = transactions.length > 0 ? Math.round((successTxns.length / transactions.length) * 100) : 100;

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
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex gap-2 p-1 bg-black/45 rounded-xl border border-white/5">
            <button
              type="button"
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
              type="button"
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
              type="button"
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

          <a
            href="/api/assets/export/transactions.csv"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 text-xs font-mono font-extrabold rounded-lg bg-cyan-500/10 hover:bg-cyan-500 text-cyan-400 hover:text-black border border-cyan-500/20 transition-all flex items-center gap-1.5 shadow-[0_0_12px_rgba(6,182,212,0.1)]"
            title="Download complete transaction journal directly to local CSV spreadsheet"
          >
            <FileText className="w-4 h-4 shrink-0" />
            EXPORT_CSV_JOURNAL
          </a>
        </div>

        <span className="text-[10px] font-mono text-gray-500">
          Showing page entries ({paginatedTransactions.length} items)
        </span>
      </div>

      {/* Main Table view */}
      {paginatedTransactions.length === 0 ? (
        <div className="text-center py-16 bg-[#0D0B14]/40 rounded-xl border border-white/5">
          <AlertCircle className="w-8 h-8 text-gray-600 mx-auto mb-2 animate-pulse" />
          <span className="block font-mono text-xs text-gray-500">NO_MATCHING_TRANSACTION_ENTRIES_FOUND</span>
          <p className="text-[11px] text-gray-600 font-sans mt-1">Adjust search metrics or filters to reveal hidden ledger logs.</p>
        </div>
      ) : (
        <>
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
                {paginatedTransactions.map((txn, index) => {
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
                            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                            SUCCESSFUL PAID
                          </span>
                        ) : (
                          <div className="space-y-0.5 select-text">
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-rose-500/10 text-[10.5px] font-medium text-rose-400 border border-rose-500/20">
                              <XCircle className="w-3.5 h-3.5 shrink-0" />
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
          <PaginationControls 
            currentPage={txnPage} 
            totalPages={txnTotalPages} 
            onPageChange={setTxnPage} 
          />
        </>
      )}
    </div>
  );
}
