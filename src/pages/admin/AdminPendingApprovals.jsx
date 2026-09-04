import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AdminLayout } from './AdminLayout';
import { 
  UserCheck, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  ShieldCheck, 
  Phone, 
  Wrench, 
  MapPin, 
  Sparkles,
  Search
} from 'lucide-react';

export const AdminPendingApprovals = () => {
  const { shramiks, approveShramik, rejectShramik, switchRole, setSelectedWorkerId, setCurrentScreen } = useApp();
  const [selectedModalWorker, setSelectedModalWorker] = useState(null);

  const pendingList = shramiks.filter(s => !s.verified);
  const verifiedList = shramiks.filter(s => s.verified);

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900">
              Shramik Verification Queue
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Review candidate background and issue official Shramik IDs (`SS-XXXXXX`).
            </p>
          </div>

          <span className="bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs px-3.5 py-1.5 rounded-full flex items-center gap-1.5">
            <UserCheck className="w-4 h-4 text-amber-700" />
            {pendingList.length} Pending Approval(s)
          </span>
        </div>

        {/* Verification Queue Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          
          <div className="p-5 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
            <h3 className="font-bold text-slate-900 text-sm font-heading uppercase tracking-wider">
              Pending Registrations
            </h3>
            <span className="text-xs text-slate-500">Live Management</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100/70 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-600">
                  <th className="py-3.5 px-4 sm:px-6">Shramik</th>
                  <th className="py-3.5 px-4">Skill</th>
                  <th className="py-3.5 px-4">Experience</th>
                  <th className="py-3.5 px-4">Phone</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 text-sm">
                {pendingList.length > 0 ? (
                  pendingList.map((worker) => (
                    <tr key={worker.id} className="hover:bg-slate-50/80 transition-colors">
                      
                      {/* Name & Photo */}
                      <td className="py-4 px-4 sm:px-6">
                        <div className="flex items-center space-x-3">
                          <img
                            src={worker.photo}
                            alt={worker.name}
                            className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                          />
                          <div>
                            <p className="font-bold text-slate-900">{worker.name}</p>
                            <p className="text-xs text-slate-500">{worker.city}, {worker.area}</p>
                          </div>
                        </div>
                      </td>

                      {/* Skill */}
                      <td className="py-4 px-4 font-semibold text-slate-800">
                        {worker.skill}
                      </td>

                      {/* Experience */}
                      <td className="py-4 px-4 text-slate-600 font-mono text-xs">
                        {worker.experience}
                      </td>

                      {/* Phone */}
                      <td className="py-4 px-4 text-slate-600 font-mono text-xs">
                        {worker.phone}
                      </td>

                      {/* Status Badge */}
                      <td className="py-4 px-4">
                        <span className="badge-pending px-2.5 py-1 rounded-full text-xs font-bold">
                          Pending
                        </span>
                      </td>

                      {/* Action Buttons */}
                      <td className="py-4 px-4 sm:px-6 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          
                          <button
                            onClick={() => setSelectedModalWorker(worker)}
                            className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200 transition-colors text-xs flex items-center space-x-1"
                            title="View Document Details"
                          >
                            <Eye className="w-4 h-4" />
                            <span className="hidden sm:inline">View</span>
                          </button>

                          <button
                            onClick={() => approveShramik(worker.id)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3.5 py-2 rounded-xl shadow-xs transition-all text-xs flex items-center space-x-1"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Approve</span>
                          </button>

                          <button
                            onClick={() => rejectShramik(worker.id)}
                            className="p-2 rounded-xl text-red-600 hover:bg-red-50 border border-red-200 transition-colors text-xs"
                            title="Reject Registration"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>

                        </div>
                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500 space-y-2">
                      <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                      <p className="font-bold text-slate-900 text-base">No pending approvals in queue.</p>
                      <p className="text-xs text-slate-400">All registered Shramiks are verified!</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>

        {/* Verified Directory Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h3 className="font-bold text-slate-900 text-lg font-heading">
            Verified Shramiks Directory ({verifiedList.length})
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {verifiedList.map((worker) => (
              <div 
                key={worker.id} 
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50 hover:border-emerald-300 transition-all space-y-2 group"
              >
                <div className="flex items-center space-x-3">
                  <img src={worker.photo} alt={worker.name} className="w-10 h-10 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 text-sm truncate group-hover:text-emerald-700 transition-colors">{worker.name}</p>
                    <p className="text-xs text-emerald-700 font-semibold font-mono">{worker.shramikId || 'SS-10101'}</p>
                  </div>
                </div>
                <div className="flex justify-between text-xs text-slate-600 pt-1 border-t border-slate-200">
                  <span>Skill: <strong>{worker.skill}</strong></span>
                  <span className="text-emerald-700 font-semibold font-mono text-[11px]">Verified Active</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* View Details Modal */}
      {selectedModalWorker && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-scale-up">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-lg font-heading">
                Shramik Profile Application
              </h3>
              <button 
                onClick={() => setSelectedModalWorker(null)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <img 
                src={selectedModalWorker.photo} 
                alt={selectedModalWorker.name} 
                className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500"
              />
              <div>
                <h4 className="font-bold text-slate-900 text-base">{selectedModalWorker.name}</h4>
                <p className="text-xs font-semibold text-emerald-700">{selectedModalWorker.skill}</p>
                <p className="text-xs text-slate-500 font-mono">{selectedModalWorker.phone}</p>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl space-y-2 text-xs text-slate-700">
              <p>Experience: <strong>{selectedModalWorker.experience}</strong></p>
              <p>City & Area: <strong>{selectedModalWorker.city}, {selectedModalWorker.area}</strong></p>
              <p>Services Offered: <strong>{selectedModalWorker.services?.join(', ')}</strong></p>
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                onClick={() => {
                  approveShramik(selectedModalWorker.id);
                  setSelectedModalWorker(null);
                }}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-md transition-all text-xs flex items-center justify-center space-x-1"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Approve & Issue ID</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </AdminLayout>
  );
};
