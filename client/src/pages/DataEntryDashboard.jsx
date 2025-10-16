import React from 'react';
import { ClipboardList, Database, Edit3 } from 'lucide-react';

const DataEntryDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/95 to-emerald-500/90" />
        <div className="relative p-6 sm:p-8 text-white rounded-2xl">
          <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-white/15 text-white text-xs font-medium mb-2">
            <Database size={14} className="mr-1" /> Data Entry Center
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Data Entry Dashboard</h1>
          <p className="text-emerald-50/90 text-sm sm:text-base mt-1">Quick access to add and update records</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
          <div className="flex items-center mb-3 text-gray-900 font-semibold"><Edit3 size={18} className="mr-2"/> Add Member</div>
          <p className="text-gray-600 text-sm">Create new family members and relationships.</p>
        </div>
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
          <div className="flex items-center mb-3 text-gray-900 font-semibold"><ClipboardList size={18} className="mr-2"/> Update Records</div>
          <p className="text-gray-600 text-sm">Edit existing family data and details.</p>
        </div>
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
          <div className="flex items-center mb-3 text-gray-900 font-semibold"><Database size={18} className="mr-2"/> Imports</div>
          <p className="text-gray-600 text-sm">Bulk import options (coming soon).</p>
        </div>
      </div>
    </div>
  );
};

export default DataEntryDashboard;