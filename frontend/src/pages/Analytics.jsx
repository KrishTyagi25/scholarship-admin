import { useState } from 'react';
import {
  Download,
  FileText,
  IndianRupee,
  Award,
  Clock,
  Check,
  X
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import AppShell from '../components/AppShell';
import StatCard from '../components/StatCard';

/* ─── Mock Data ────────────────────────────────────────────────────────── */

// Chart 1: Application Volume & Approval Trend
const MONTHLY_DATA = [
  { month: 'Apr', Received: 1200, Sanctioned: 850 },
  { month: 'May', Received: 1800, Sanctioned: 1100 },
  { month: 'Jun', Received: 2400, Sanctioned: 1600 },
  { month: 'Jul', Received: 3100, Sanctioned: 2100 },
  { month: 'Aug', Received: 2600, Sanctioned: 1800 },
  { month: 'Sep', Received: 1380, Sanctioned: 560 },
];

// Chart 2: Scheme-Wise Budget Allocation vs Utilisation
const BUDGET_DATA = [
  { scheme: 'NFST', Allocated: 30, Utilised: 22.4 },
  { scheme: 'NOS', Allocated: 20, Utilised: 14.8 },
  { scheme: 'Post-Doc', Allocated: 10, Utilised: 7.2 },
  { scheme: 'Top Class', Allocated: 8, Utilised: 4.2 },
];

// Chart 3: Application Status Breakdown
const STATUS_DATA = [
  { name: 'Approved & Sanctioned', value: 5420, color: '#16a34a' },
  { name: 'Under Review', value: 3100, color: '#3b82f6' },
  { name: 'Pending Verification', value: 1860, color: '#1a3557' },
  { name: 'Deficient / Action Required', value: 1240, color: '#d97706' },
  { name: 'Rejected / Ineligible', value: 860, color: '#dc2626' },
];

// Chart 4: Demographic Breakdown
const CATEGORY_DATA = [
  { category: 'ST', Applications: 4800 },
  { category: 'SC', Applications: 3200 },
  { category: 'OBC', Applications: 2400 },
  { category: 'EWS', Applications: 1200 },
  { category: 'Gen / PwD', Applications: 880 },
];

// Bottom Table: Top Institutions
const TOP_INSTITUTIONS = [
  { name: 'IIT Delhi', state: 'Delhi', beneficiaries: 342, amount: '₹4.10 Cr', rate: 96 },
  { name: 'IISc Bangalore', state: 'Karnataka', beneficiaries: 289, amount: '₹3.80 Cr', rate: 98 },
  { name: 'JNU New Delhi', state: 'Delhi', beneficiaries: 265, amount: '₹2.45 Cr', rate: 92 },
  { name: 'IIT Bombay', state: 'Maharashtra', beneficiaries: 240, amount: '₹3.20 Cr', rate: 95 },
  { name: 'BHU Varanasi', state: 'Uttar Pradesh', beneficiaries: 215, amount: '₹1.95 Cr', rate: 89 },
];

export default function Analytics() {
  const [schemeFilter, setSchemeFilter] = useState('All');
  const [fyFilter, setFyFilter] = useState('FY 2025-26');
  const [showExportToast, setShowExportToast] = useState(false);

  const handleExport = () => {
    setShowExportToast(true);
    setTimeout(() => {
      setShowExportToast(false);
    }, 4000);
  };

  return (
    <AppShell title="Analytics Dashboard">
      {/* ── Top Control Bar ────────────────────────────────────────────── */}
      <div className="bg-white border border-[#dde1e7] rounded-lg p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div>
            <label className="block text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider mb-1">
              Scheme Filter
            </label>
            <select
              value={schemeFilter}
              onChange={(e) => setSchemeFilter(e.target.value)}
              className="bg-white border border-[#dde1e7] text-[#1c2b3a] text-xs rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#1a3557]/20 focus:border-[#1a3557]"
            >
              <option value="All">All Schemes</option>
              <option value="NFST">NFST — National Fellowship for ST Students</option>
              <option value="NOS">NOS — National Overseas Scholarship</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider mb-1">
              Financial Year
            </label>
            <select
              value={fyFilter}
              onChange={(e) => setFyFilter(e.target.value)}
              className="bg-white border border-[#dde1e7] text-[#1c2b3a] text-xs rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#1a3557]/20 focus:border-[#1a3557]"
            >
              <option value="FY 2025-26">FY 2025-26</option>
              <option value="FY 2024-25">FY 2024-25</option>
              <option value="FY 2023-24">FY 2023-24</option>
            </select>
          </div>
        </div>

        <div className="self-end sm:self-center">
          <button
            onClick={handleExport}
            className="border border-[#dde1e7] bg-white text-[#1c2b3a] hover:bg-[#f8fafc] text-xs font-semibold px-3 py-1.5 rounded-md flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Download size={14} className="text-[#6b7280]" />
            Export Report
          </button>
        </div>
      </div>

      {/* ── Inline Toast Notification ──────────────────────────────────── */}
      {showExportToast && (
        <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg p-3 flex items-center justify-between shadow-xs transition-all">
          <div className="flex items-center gap-2">
            <Check size={16} className="text-emerald-600" />
            <span className="font-semibold">Report exported as CSV successfully.</span>
          </div>
          <button
            onClick={() => setShowExportToast(false)}
            className="text-emerald-600 hover:text-emerald-800 p-0.5"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* ── Top Stat Cards ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={FileText}
          value="12,480"
          iconBg="bg-blue-50"
          iconColor="text-[#1a3557]"
          label={
            <div className="flex items-center justify-between gap-1 flex-wrap">
              <span>Total Applications</span>
              <span className="text-[#16a34a] font-semibold">+14% vs last year</span>
            </div>
          }
        />
        <StatCard
          icon={IndianRupee}
          value="₹48.6 Cr"
          iconBg="bg-emerald-50"
          iconColor="text-[#16a34a]"
          label={
            <div className="flex items-center justify-between gap-1 flex-wrap">
              <span>Total Sanctioned Amount</span>
              <span className="text-[#16a34a] font-semibold">+8% vs last year</span>
            </div>
          }
        />
        <StatCard
          icon={Award}
          value="64.2%"
          iconBg="bg-amber-50"
          iconColor="text-[#d97706]"
          label={
            <div className="flex items-center justify-between gap-1 flex-wrap">
              <span>Selection Rate</span>
              <span className="text-[#dc2626] font-semibold">-2% vs target</span>
            </div>
          }
        />
        <StatCard
          icon={Clock}
          value="14 Days"
          iconBg="bg-purple-50"
          iconColor="text-purple-600"
          label={
            <div className="flex items-center justify-between gap-1 flex-wrap">
              <span>Avg. Processing Time</span>
              <span className="text-[#16a34a] font-semibold">-3 days vs last year</span>
            </div>
          }
        />
      </div>

      {/* ── Charts Grid (2x2) ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Chart 1: Application Volume & Approval Trend */}
        <div className="bg-white border border-[#dde1e7] rounded-lg p-5">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-[#1c2b3a]">
              Monthly Application Flow ({fyFilter})
            </h3>
            <p className="text-xs text-[#6b7280]">
              Received vs Sanctioned applications by month
            </p>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={MONTHLY_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="month" stroke="#6b7280" fontSize={12} tickLine={false} />
              <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  borderColor: '#dde1e7',
                  borderRadius: '6px',
                  fontSize: '12px'
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
              <Bar dataKey="Received" fill="#1a3557" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Sanctioned" fill="#16a34a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Chart 2: Scheme-Wise Budget Allocation vs Utilisation */}
        <div className="bg-white border border-[#dde1e7] rounded-lg p-5">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-[#1c2b3a]">
              Budget Allocation vs Utilisation
            </h3>
            <p className="text-xs text-[#6b7280]">
              In ₹ Crores by scheme
            </p>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={BUDGET_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="scheme" stroke="#6b7280" fontSize={12} tickLine={false} />
              <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} unit=" Cr" />
              <Tooltip
                formatter={(val) => `₹${val} Cr`}
                contentStyle={{
                  backgroundColor: '#fff',
                  borderColor: '#dde1e7',
                  borderRadius: '6px',
                  fontSize: '12px'
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
              <Bar dataKey="Allocated" fill="#1a3557" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Utilised" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Chart 3: Application Status Breakdown */}
        <div className="bg-white border border-[#dde1e7] rounded-lg p-5">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-[#1c2b3a]">
              Current Application Status Distribution
            </h3>
            <p className="text-xs text-[#6b7280]">
              Breakdown of all 12,480 active applications
            </p>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={STATUS_DATA}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
              >
                {STATUS_DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(val) => val.toLocaleString()}
                contentStyle={{
                  backgroundColor: '#fff',
                  borderColor: '#dde1e7',
                  borderRadius: '6px',
                  fontSize: '12px'
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Chart 4: Demographic Breakdown */}
        <div className="bg-white border border-[#dde1e7] rounded-lg p-5">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-[#1c2b3a]">
              Demographic Breakdown
            </h3>
            <p className="text-xs text-[#6b7280]">
              Applications by Category / Reservation Group
            </p>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={CATEGORY_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="category" stroke="#6b7280" fontSize={12} tickLine={false} />
              <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  borderColor: '#dde1e7',
                  borderRadius: '6px',
                  fontSize: '12px'
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
              <Bar dataKey="Applications" fill="#1a3557" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Bottom Table Panel: Top Institutions ────────────────────────── */}
      <div className="bg-white border border-[#dde1e7] rounded-lg p-5">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-[#1c2b3a]">
            Top Institutions by Beneficiary Count
          </h3>
          <p className="text-xs text-[#6b7280]">
            Institutions with highest approved scholarship applications
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#dde1e7] bg-[#f8fafc]">
                <th className="py-2.5 px-3 text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">
                  Institution Name
                </th>
                <th className="py-2.5 px-3 text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">
                  State
                </th>
                <th className="py-2.5 px-3 text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider text-right">
                  Active Beneficiaries
                </th>
                <th className="py-2.5 px-3 text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider text-right">
                  Total Sanctioned Amount
                </th>
                <th className="py-2.5 px-3 text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider text-right">
                  Disbursement Rate
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#dde1e7]">
              {TOP_INSTITUTIONS.map((inst, index) => (
                <tr key={index} className="hover:bg-[#f8fafc] text-xs text-[#1c2b3a] transition-colors">
                  <td className="py-3 px-3 font-semibold">{inst.name}</td>
                  <td className="py-3 px-3 text-[#6b7280]">{inst.state}</td>
                  <td className="py-3 px-3 text-right font-medium">{inst.beneficiaries.toLocaleString()}</td>
                  <td className="py-3 px-3 text-right font-semibold text-[#1a3557]">{inst.amount}</td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 bg-[#f3f4f6] h-2 rounded-full overflow-hidden hidden sm:block">
                        <div
                          className="bg-[#16a34a] h-full rounded-full"
                          style={{ width: `${inst.rate}%` }}
                        />
                      </div>
                      <span className="font-semibold text-emerald-700">{inst.rate}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
