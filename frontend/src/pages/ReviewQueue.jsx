import { useState } from 'react';
import { Search, Eye, Check, X, ChevronLeft, ChevronRight } from 'lucide-react';
import AppShell from '../components/AppShell';
import StatusBadge from '../components/StatusBadge';

/* ─── Mock data ─────────────────────────────────────────── */
const ALL_ROWS = [
  { id: 'APP-2024-001', name: 'Rahul Sharma',   scheme: 'NFST', state: 'Odisha',       submitted: '15 Sep 2024', status: 'Pending',   score: 85 },
  { id: 'APP-2024-002', name: 'Priya Patel',    scheme: 'NOS',  state: 'Jharkhand',    submitted: '14 Sep 2024', status: 'Eligible',  score: 92 },
  { id: 'APP-2024-003', name: 'Amit Kumar',     scheme: 'NFST', state: 'Chhattisgarh', submitted: '13 Sep 2024', status: 'Deficient', score: 65 },
  { id: 'APP-2024-004', name: 'Sneha Gupta',    scheme: 'NOS',  state: 'Odisha',       submitted: '12 Sep 2024', status: 'Selected',  score: 95 },
  { id: 'APP-2024-005', name: 'Ravi Singh',     scheme: 'NFST', state: 'Jharkhand',    submitted: '11 Sep 2024', status: 'Flagged',   score: 45 },
  { id: 'APP-2024-006', name: 'Neha Verma',     scheme: 'NOS',  state: 'Chhattisgarh', submitted: '10 Sep 2024', status: 'Pending',   score: 78 },
];
/* ─────────────────────────────────────────────────────────── */

const PER_PAGE = 6;

export default function ReviewQueue() {
  const [scheme, setScheme]       = useState('All');
  const [status, setStatus]       = useState('All');
  const [state, setState]         = useState('All');
  const [search, setSearch]       = useState('');
  const [selected, setSelected]   = useState([]);
  const [page, setPage]           = useState(1);

  const filtered = ALL_ROWS.filter((r) => {
    if (scheme !== 'All' && r.scheme !== scheme) return false;
    if (status !== 'All' && r.status !== status) return false;
    if (state  !== 'All' && r.state  !== state)  return false;
    if (search && !r.name.toLowerCase().includes(search.toLowerCase()) && !r.id.includes(search)) return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const pageRows   = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const allChecked = pageRows.length > 0 && pageRows.every((r) => selected.includes(r.id));

  const toggleRow = (id) =>
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  const toggleAll = () =>
    setSelected(allChecked ? selected.filter((id) => !pageRows.find((r) => r.id === id)) : [...new Set([...selected, ...pageRows.map((r) => r.id)])]);

  const SelectField = ({ value, onChange, children }) => (
    <select
      value={value}
      onChange={(e) => { onChange(e.target.value); setPage(1); }}
      className="border border-[#dde1e7] rounded px-3 py-2 text-[13px] text-[#1c2b3a] bg-white outline-none focus:border-[#1a3557] transition-colors cursor-pointer"
    >
      {children}
    </select>
  );

  return (
    <AppShell title="Review Queue">

      {/* Filters */}
      <div className="flex flex-wrap gap-2.5 mb-5">
        <SelectField value={scheme} onChange={setScheme}>
          <option value="All">Scheme: All</option>
          <option value="NFST">NFST</option>
          <option value="NOS">NOS</option>
        </SelectField>
        <SelectField value={status} onChange={setStatus}>
          <option value="All">Status: All</option>
          <option value="Eligible">Eligible</option>
          <option value="Pending">Pending</option>
          <option value="Deficient">Deficient</option>
          <option value="Flagged">Flagged</option>
          <option value="Selected">Selected</option>
        </SelectField>
        <SelectField value={state} onChange={setState}>
          <option value="All">State: All</option>
          <option value="Odisha">Odisha</option>
          <option value="Jharkhand">Jharkhand</option>
          <option value="Chhattisgarh">Chhattisgarh</option>
        </SelectField>
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9aa3af]" size={14} />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name or application ID…"
            className="w-full border border-[#dde1e7] rounded pl-8 pr-3 py-2 text-[13px] text-[#1c2b3a] bg-white outline-none placeholder-[#b0b8c4] focus:border-[#1a3557] transition-colors"
          />
        </div>
      </div>

      {/* Bulk action bar */}
      {selected.length > 0 && (
        <div className="flex items-center justify-between mb-3 px-4 py-2.5 bg-[#eef2f7] border border-[#c8d4e3] rounded text-[13px]">
          <span className="font-medium text-[#1a3557]">
            {selected.length} application{selected.length > 1 ? 's' : ''} selected
          </span>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 bg-white border border-[#dde1e7] rounded text-[13px] text-[#4b5563] hover:bg-gray-50 transition-colors">
              Reject
            </button>
            <button className="px-3 py-1.5 bg-[#1a3557] text-white rounded text-[13px] hover:bg-[#102540] transition-colors">
              Approve
            </button>
          </div>
        </div>
      )}

      {/* Table card */}
      <div className="bg-white border border-[#dde1e7] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="bg-[#f9fafb] border-b border-[#dde1e7] text-[#6b7a8d] font-medium text-[12px] uppercase tracking-wide">
                <th className="px-4 py-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={allChecked}
                    onChange={toggleAll}
                    className="rounded border-[#c0c8d2] cursor-pointer"
                  />
                </th>
                <th className="text-left px-4 py-3">Applicant</th>
                <th className="text-left px-4 py-3 hidden sm:table-cell">Scheme</th>
                <th className="text-left px-4 py-3 hidden md:table-cell">State</th>
                <th className="text-left px-4 py-3 hidden sm:table-cell">Submitted</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3 hidden lg:table-cell">Score</th>
                <th className="text-right px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f2f5]">
              {pageRows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-[#9aa3af]">
                    No applications match the selected filters.
                  </td>
                </tr>
              ) : (
                pageRows.map((row) => (
                  <tr key={row.id} className="hover:bg-[#fafbfc] transition-colors">
                    <td className="px-4 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={selected.includes(row.id)}
                        onChange={() => toggleRow(row.id)}
                        className="rounded border-[#c0c8d2] cursor-pointer"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-[#1c2b3a]">{row.name}</div>
                      <div className="text-[11px] text-[#9aa3af] mt-0.5">{row.id}</div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell text-[#4b5563]">{row.scheme}</td>
                    <td className="px-4 py-3 hidden md:table-cell text-[#4b5563]">{row.state}</td>
                    <td className="px-4 py-3 hidden sm:table-cell text-[#6b7a8d]">{row.submitted}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={row.status} />
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell font-medium text-[#1c2b3a]">
                      {row.score}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <button title="View" className="p-1.5 rounded text-[#6b7a8d] hover:text-[#1a3557] hover:bg-slate-100 transition-colors">
                          <Eye size={15} />
                        </button>
                        <button title="Approve" className="p-1.5 rounded text-[#6b7a8d] hover:text-green-700 hover:bg-green-50 transition-colors">
                          <Check size={15} />
                        </button>
                        <button title="Reject" className="p-1.5 rounded text-[#6b7a8d] hover:text-red-700 hover:bg-red-50 transition-colors">
                          <X size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 py-3 border-t border-[#dde1e7] bg-[#f9fafb] flex items-center justify-between text-[12px] text-[#6b7a8d]">
          <span>
            Showing {filtered.length === 0 ? 0 : (page - 1) * PER_PAGE + 1}–
            {Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded border border-[#dde1e7] bg-white text-[#6b7a8d] hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 rounded border border-[#dde1e7] bg-white text-[#6b7a8d] hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
