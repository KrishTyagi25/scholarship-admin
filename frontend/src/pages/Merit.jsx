import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, X } from 'lucide-react';
import AppShell from '../components/AppShell';

/* ─── Mock candidates ─────────────────────────────────────── */
// Each candidate has passed AI verification and admin review.
// Raw sub-scores are out of 100.
const ALL_CANDIDATES = [
  { id: 'APP-2024-101', name: 'Ananya Mishra',     state: 'Odisha',        scheme: 'NFST', academic: 88, exam: 76, socioEconomic: 92, interview: 80 },
  { id: 'APP-2024-102', name: 'Suresh Baiga',      state: 'Chhattisgarh',  scheme: 'NFST', academic: 74, exam: 82, socioEconomic: 95, interview: 70 },
  { id: 'APP-2024-103', name: 'Priya Patel',       state: 'Jharkhand',     scheme: 'NFST', academic: 91, exam: 88, socioEconomic: 78, interview: 85 },
  { id: 'APP-2024-104', name: 'Deepak Oraon',      state: 'Jharkhand',     scheme: 'NFST', academic: 65, exam: 70, socioEconomic: 98, interview: 60 },
  { id: 'APP-2024-105', name: 'Kavya Nayak',       state: 'Odisha',        scheme: 'NFST', academic: 80, exam: 79, socioEconomic: 85, interview: 78 },
  { id: 'APP-2024-106', name: 'Ramesh Gond',       state: 'Madhya Pradesh',scheme: 'NFST', academic: 70, exam: 65, socioEconomic: 90, interview: 72 },
  { id: 'APP-2024-107', name: 'Sneha Munda',       state: 'Jharkhand',     scheme: 'NFST', academic: 85, exam: 83, socioEconomic: 80, interview: 88 },
  { id: 'APP-2024-108', name: 'Vikram Bhil',       state: 'Rajasthan',     scheme: 'NFST', academic: 77, exam: 74, socioEconomic: 88, interview: 65 },
  { id: 'APP-2024-109', name: 'Meena Korku',       state: 'Madhya Pradesh',scheme: 'NFST', academic: 60, exam: 55, socioEconomic: 96, interview: 58 },
  { id: 'APP-2024-110', name: 'Arjun Halbi',       state: 'Chhattisgarh',  scheme: 'NFST', academic: 82, exam: 80, socioEconomic: 83, interview: 76 },
  { id: 'APP-2024-201', name: 'Sita Devi Santali', state: 'West Bengal',   scheme: 'NOS',  academic: 79, exam: 72, socioEconomic: 91, interview: 82 },
  { id: 'APP-2024-202', name: 'Mohan Kol',         state: 'Uttar Pradesh', scheme: 'NOS',  academic: 68, exam: 60, socioEconomic: 94, interview: 63 },
];

const SEATS = { NFST: 8, NOS: 3 };

/* ─── Helpers ────────────────────────────────────────────── */
function computeWeighted(c, w) {
  return (
    (c.academic       * w.academic      / 100) +
    (c.exam           * w.exam          / 100) +
    (c.socioEconomic  * w.socioEconomic / 100) +
    (c.interview      * w.interview     / 100)
  );
}

/* ─── Sub-components ──────────────────────────────────────── */
function CardHeader({ title, right }) {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-[#dde1e7]">
      <h2 className="text-[13px] font-semibold text-[#1c2b3a] uppercase tracking-wide">
        {title}
      </h2>
      {right}
    </div>
  );
}

function SummaryChip({ label, value }) {
  return (
    <div className="flex flex-col">
      <span className="text-[11px] text-[#6b7a8d] uppercase tracking-wide leading-none mb-1">
        {label}
      </span>
      <span className="text-[15px] font-semibold text-[#1c2b3a] leading-none">
        {value}
      </span>
    </div>
  );
}

function SliderRow({ label, value, onChange }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-[12px] text-[#4b5563]">{label}</span>
        <span className="text-[13px] font-semibold text-[#1c2b3a]">{value}%</span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        step={5}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none bg-[#e5e9ef] accent-[#1a3557] cursor-pointer"
      />
    </div>
  );
}

function RankBadge({ rank, isWaitlist }) {
  if (isWaitlist) {
    return (
      <div className="flex items-center gap-1.5">
        <span className="text-[13px] text-[#9aa3af]">{rank}</span>
        <span className="text-[10px] text-[#9aa3af] border border-[#dde1e7] rounded px-1.5 py-0.5">
          Waitlist
        </span>
      </div>
    );
  }
  if (rank <= 3) {
    return (
      <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-[#1a3557] text-white text-[12px] font-semibold">
        {rank}
      </span>
    );
  }
  return <span className="text-[13px] text-[#6b7a8d]">{rank}</span>;
}

/* ─── Main component ──────────────────────────────────────── */
export default function Merit() {
  const navigate = useNavigate();

  const [scheme, setScheme] = useState('NFST');
  const [weights, setWeights] = useState({
    academic: 40,
    exam: 30,
    socioEconomic: 20,
    interview: 10,
  });
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [showModal, setShowModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const totalWeight = weights.academic + weights.exam + weights.socioEconomic + weights.interview;
  const weightValid = totalWeight === 100;
  const seats = SEATS[scheme] ?? 0;

  /* Filtered + ranked candidates, recomputed whenever scheme or weights change */
  const rankedCandidates = useMemo(() => {
    const filtered = ALL_CANDIDATES.filter((c) => c.scheme === scheme);
    return filtered
      .map((c) => ({ ...c, weightedScore: computeWeighted(c, weights) }))
      .sort((a, b) => b.weightedScore - a.weightedScore)
      .map((c, i) => ({ ...c, rank: i + 1, isWaitlist: i + 1 > seats }));
  }, [scheme, weights]);

  /* Reset selections when scheme changes */
  const handleSchemeChange = (val) => {
    setScheme(val);
    setSelectedIds(new Set());
    setSuccessMsg('');
  };

  const toggleRow = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const allPageChecked =
    rankedCandidates.length > 0 &&
    rankedCandidates.every((c) => selectedIds.has(c.id));

  const toggleAll = () => {
    if (allPageChecked) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(rankedCandidates.map((c) => c.id)));
    }
  };

  const handleFinalise = () => {
    const n = selectedIds.size;
    setShowModal(false);
    setSuccessMsg(`Selection finalised. ${n} candidate${n !== 1 ? 's' : ''} marked as selected.`);
    setSelectedIds(new Set());
  };

  const setWeight = (key) => (val) =>
    setWeights((prev) => ({ ...prev, [key]: val }));

  return (
    <AppShell title="Merit & Selection">

      {/* ── a) Scheme selector bar ─────────────────────────── */}
      <div className="flex flex-wrap items-center gap-5 mb-5 pb-5 border-b border-[#dde1e7]">
        <select
          value={scheme}
          onChange={(e) => handleSchemeChange(e.target.value)}
          className="border border-[#dde1e7] rounded px-3 py-2 text-[13px] text-[#1c2b3a] bg-white outline-none focus:border-[#1a3557] transition-colors cursor-pointer"
        >
          <option value="NFST">Scheme: NFST</option>
          <option value="NOS">Scheme: NOS</option>
        </select>

        <div className="flex flex-wrap gap-6">
          <SummaryChip
            label="Eligible candidates"
            value={rankedCandidates.length}
          />
          <SummaryChip
            label="Available seats"
            value={seats}
          />
          <SummaryChip
            label="Currently selected"
            value={selectedIds.size}
          />
        </div>

        <button
          onClick={() => setShowModal(true)}
          disabled={selectedIds.size === 0}
          className={`ml-auto px-4 py-2 bg-[#1a3557] text-white rounded text-[13px] transition-colors
            ${selectedIds.size === 0 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-[#102540]'}`}
        >
          Finalise Selection
        </button>
      </div>

      {/* ── b) Weightage configuration card ────────────────── */}
      <div className="bg-white border border-[#dde1e7] rounded-lg mb-5">
        <CardHeader title="Merit Weightage Configuration" />
        <div className="px-5 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <SliderRow
              label="Academic marks"
              value={weights.academic}
              onChange={setWeight('academic')}
            />
            <SliderRow
              label="Entrance / qualifying exam score"
              value={weights.exam}
              onChange={setWeight('exam')}
            />
            <SliderRow
              label="Socio-economic criteria"
              value={weights.socioEconomic}
              onChange={setWeight('socioEconomic')}
            />
            <SliderRow
              label="Interview / presentation"
              value={weights.interview}
              onChange={setWeight('interview')}
            />
          </div>
          <div className="mt-4 flex items-center gap-2 text-[13px]">
            <span className="text-[#4b5563]">Total:</span>
            <span className={`font-semibold ${weightValid ? 'text-[#1c2b3a]' : 'text-red-600'}`}>
              {totalWeight}%
            </span>
            {!weightValid && (
              <span className="text-red-500 text-[12px]">— Weightage must total 100%</span>
            )}
          </div>
        </div>
      </div>

      {/* ── Success banner ─────────────────────────────────── */}
      {successMsg && (
        <div className="flex items-center justify-between mb-4 px-4 py-2.5 bg-green-50 border border-green-200 text-green-800 text-[13px] rounded">
          <span>{successMsg}</span>
          <button
            onClick={() => setSuccessMsg('')}
            className="ml-4 text-green-600 hover:text-green-800 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* ── c) Merit list table card ───────────────────────── */}
      <div className="bg-white border border-[#dde1e7] rounded-lg overflow-hidden">
        <CardHeader
          title="Merit List"
          right={
            <span className="text-[11px] text-[#9aa3af]">Ranked by weighted score</span>
          }
        />

        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="bg-[#f9fafb] border-b border-[#dde1e7] text-[#6b7a8d] font-medium text-[12px] uppercase tracking-wide">
                <th className="px-4 py-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={allPageChecked}
                    onChange={toggleAll}
                    className="rounded border-[#c0c8d2] cursor-pointer"
                  />
                </th>
                <th className="text-left px-4 py-3 w-16">Rank</th>
                <th className="text-left px-4 py-3">Applicant</th>
                <th className="text-left px-4 py-3 hidden md:table-cell">State</th>
                <th className="text-left px-4 py-3 hidden md:table-cell">Academic</th>
                <th className="text-left px-4 py-3 hidden lg:table-cell">Exam</th>
                <th className="text-left px-4 py-3 hidden lg:table-cell">Socio-eco</th>
                <th className="text-left px-4 py-3">Weighted</th>
                <th className="text-right px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f2f5]">
              {rankedCandidates.map((c) => (
                <tr
                  key={c.id}
                  className={`transition-colors ${c.isWaitlist ? 'bg-[#fcfcfd] hover:bg-[#f9f9fb]' : 'hover:bg-[#fafbfc]'}`}
                >
                  <td className="px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(c.id)}
                      onChange={() => toggleRow(c.id)}
                      className="rounded border-[#c0c8d2] cursor-pointer"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <RankBadge rank={c.rank} isWaitlist={c.isWaitlist} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-[#1c2b3a]">{c.name}</div>
                    <div className="text-[11px] text-[#9aa3af] mt-0.5">{c.id}</div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-[#4b5563]">{c.state}</td>
                  <td className="px-4 py-3 hidden md:table-cell text-[#4b5563]">{c.academic}</td>
                  <td className="px-4 py-3 hidden lg:table-cell text-[#4b5563]">{c.exam}</td>
                  <td className="px-4 py-3 hidden lg:table-cell text-[#4b5563]">{c.socioEconomic}</td>
                  <td className="px-4 py-3 font-semibold text-[#1c2b3a]">
                    {c.weightedScore.toFixed(1)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      title="View application"
                      onClick={() => navigate(`/application/${c.id}`)}
                      className="p-1.5 rounded text-[#6b7a8d] hover:text-[#1a3557] hover:bg-slate-100 transition-colors"
                    >
                      <Eye size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table footer */}
        <div className="px-4 py-3 border-t border-[#dde1e7] bg-[#f9fafb] text-[12px] text-[#6b7a8d]">
          {rankedCandidates.length} candidates · seats available: {seats} · waitlisted:{' '}
          {Math.max(0, rankedCandidates.length - seats)}
        </div>
      </div>

      {/* ── d) Finalise confirmation modal ─────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-lg">
            <h3 className="text-[15px] font-semibold text-[#1c2b3a] mb-2">
              Finalise selection?
            </h3>
            <p className="text-[13px] text-[#4b5563] mb-6 leading-relaxed">
              <strong>{selectedIds.size}</strong> candidate
              {selectedIds.size !== 1 ? 's' : ''} will be marked as selected for{' '}
              <strong>{scheme}</strong>. Selected applicants will be notified automatically.
              This action can be reviewed but not undone in bulk.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-3 py-1.5 bg-white border border-[#dde1e7] rounded text-[13px] text-[#4b5563] hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleFinalise}
                className="px-3 py-1.5 bg-[#1a3557] text-white rounded text-[13px] hover:bg-[#102540] transition-colors"
              >
                Confirm selection
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
