import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  FileText,
  ShieldCheck,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import AppShell from '../components/AppShell';
import StatusBadge from '../components/StatusBadge';

/* ─── Mock applicant ─────────────────────────────────────── */
const MOCK_APPLICANT = {
  id: 'APP-2024-003',
  name: 'Amit Kumar',
  status: 'Deficient',
  score: 82,
  dob: '14 March 2001',
  category: 'Scheduled Tribe',
  gender: 'Male',
  email: 'amit.kumar@gmail.com',
  phone: '+91 98765 43210',
  state: 'Chhattisgarh',
  district: 'Raipur',
  scheme: 'NFST',
  course: 'B.Tech – Computer Science',
  institution: 'NIT Raipur',
  submitted: '13 Sep 2024',
};

const DOCUMENTS = [
  { name: 'Caste Certificate',  verified: true  },
  { name: 'Income Certificate', verified: true  },
  { name: 'Marksheet (10+2)',   verified: false },
  { name: 'Admission Letter',   verified: true  },
  { name: 'Bank Passbook',      verified: false },
];

const AI_CHECKS = [
  { label: 'Income within scheme limit',      pass: true  },
  { label: 'Category matches ST records',     pass: true  },
  { label: 'Marks meet minimum cutoff',       pass: true  },
  { label: 'All required documents present',  pass: false },
];

const TIMELINE = [
  { stage: 'Submitted',     date: '13 Sep 2024', done: true  },
  { stage: 'AI Verified',   date: '14 Sep 2024', done: true  },
  { stage: 'Admin Review',  date: null,           done: false, current: true  },
  { stage: 'Decision',      date: null,           done: false, current: false },
];
/* ─────────────────────────────────────────────────────────── */

/* Reusable card wrapper */
function Card({ title, children }) {
  return (
    <div className="bg-white border border-[#dde1e7] rounded-lg overflow-hidden">
      <div className="px-5 py-4 border-b border-[#dde1e7]">
        <h2 className="text-[13px] font-semibold text-[#1c2b3a] uppercase tracking-wide">
          {title}
        </h2>
      </div>
      {children}
    </div>
  );
}

/* Two-column label/value row used inside Applicant Information */
function InfoRow({ label, value }) {
  return (
    <div>
      <div className="text-[12px] text-[#6b7a8d] mb-0.5">{label}</div>
      <div className="text-[13px] font-medium text-[#1c2b3a]">{value}</div>
    </div>
  );
}

export default function ApplicationDetail() {
  const app = MOCK_APPLICANT;
  const [remark, setRemark] = useState('');

  const scorePct = app.score;
  const scoreBar =
    scorePct >= 70 ? 'bg-green-500' : scorePct >= 40 ? 'bg-amber-500' : 'bg-red-500';

  return (
    <AppShell title={app.name}>

      {/* ── Top bar ─────────────────────────────────────────── */}
      <div className="mb-5">
        {/* Back link */}
        <Link
          to="/queue"
          className="inline-flex items-center gap-1.5 text-[12px] text-[#6b7a8d] hover:text-[#1a3557] transition-colors mb-4"
        >
          <ArrowLeft size={13} />
          Back to Review Queue
        </Link>

        {/* Name / ID / badge row + actions */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-lg font-semibold text-[#1c2b3a]">{app.name}</span>
            <span className="text-[13px] text-[#9aa3af]">{app.id}</span>
            <StatusBadge status={app.status} />
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 bg-white border border-[#dde1e7] rounded text-[13px] text-[#4b5563] hover:bg-gray-50 transition-colors">
              Reject
            </button>
            <button className="px-3 py-1.5 bg-[#1a3557] text-white rounded text-[13px] hover:bg-[#102540] transition-colors">
              Approve
            </button>
          </div>
        </div>
      </div>

      {/* ── Two-column grid ─────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* ── LEFT COLUMN ─────────────────────────────────── */}
        <div className="xl:col-span-2 flex flex-col gap-5">

          {/* a) Applicant Information */}
          <Card title="Applicant Information">
            <div className="grid grid-cols-2 gap-4 px-5 py-4">
              <InfoRow label="Full name"          value={app.name}        />
              <InfoRow label="Date of birth"      value={app.dob}         />
              <InfoRow label="Category"           value={app.category}    />
              <InfoRow label="Gender"             value={app.gender}      />
              <InfoRow label="Email"              value={app.email}       />
              <InfoRow label="Phone"              value={app.phone}       />
              <InfoRow label="State"              value={app.state}       />
              <InfoRow label="District"           value={app.district}    />
              <InfoRow label="Scheme"             value={app.scheme}      />
              <InfoRow label="Course / Programme" value={app.course}      />
              <InfoRow label="Institution name"   value={app.institution} />
              <InfoRow label="Submitted on"       value={app.submitted}   />
            </div>
          </Card>

          {/* b) Documents */}
          <Card title="Documents">
            <div className="divide-y divide-[#f0f2f5]">
              {DOCUMENTS.map((doc) => (
                <div
                  key={doc.name}
                  className="flex items-center justify-between px-5 py-3"
                >
                  <div className="flex items-center gap-3">
                    <FileText size={15} className="text-[#9aa3af] shrink-0" />
                    <span className="text-[13px] text-[#1c2b3a]">{doc.name}</span>
                    {doc.verified ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-green-50 text-green-700 border border-green-200">
                        <ShieldCheck size={11} />
                        Verified via DigiLocker
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                        Manually uploaded
                      </span>
                    )}
                  </div>
                  <button className="text-[12px] text-[#1a3557] font-medium hover:underline px-1">
                    View
                  </button>
                </div>
              ))}
            </div>
          </Card>

          {/* c) AI Verification Result */}
          <Card title="AI Verification Result">
            <div className="px-5 py-4">
              {/* Eligibility checklist */}
              <div className="space-y-2.5 mb-5">
                {AI_CHECKS.map((item) => (
                  <div key={item.label} className="flex items-center gap-2.5">
                    {item.pass ? (
                      <CheckCircle2 size={16} className="text-green-600 shrink-0" />
                    ) : (
                      <XCircle size={16} className="text-red-500 shrink-0" />
                    )}
                    <span className={`text-[13px] ${item.pass ? 'text-[#1c2b3a]' : 'text-red-600'}`}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div className="border-t border-[#f0f2f5] mb-4" />

              {/* Eligibility score */}
              <div className="flex items-end justify-between mb-2">
                <span className="text-[12px] text-[#6b7a8d] uppercase tracking-wide font-medium">
                  Eligibility Score
                </span>
                <span className="text-2xl font-semibold text-[#1c2b3a] leading-none">
                  {app.score}
                  <span className="text-[14px] font-normal text-[#9aa3af]">/100</span>
                </span>
              </div>
              <div className="h-1.5 bg-[#f0f2f5] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${scoreBar}`}
                  style={{ width: `${scorePct}%` }}
                />
              </div>
            </div>
          </Card>
        </div>

        {/* ── RIGHT COLUMN ─────────────────────────────────── */}
        <div className="flex flex-col gap-5">

          {/* d) Application Timeline */}
          <Card title="Application Timeline">
            <div className="px-5 py-4">
              <div className="relative">
                {/* Vertical connector line */}
                <div className="absolute left-[7px] top-3 bottom-3 w-px bg-[#dde1e7]" />

                <div className="space-y-5">
                  {TIMELINE.map((step, i) => {
                    const isDone    = step.done;
                    const isCurrent = step.current;

                    return (
                      <div key={i} className="flex items-start gap-3.5 relative">
                        {/* Circle */}
                        <div className={`
                          w-3.5 h-3.5 rounded-full border-2 shrink-0 mt-0.5 z-10 flex items-center justify-center
                          ${isDone
                            ? 'bg-[#1a3557] border-[#1a3557]'
                            : isCurrent
                              ? 'bg-blue-500 border-blue-500'
                              : 'bg-white border-[#c0c8d2]'}
                        `}>
                          {isDone && (
                            <svg width="7" height="6" viewBox="0 0 7 6" fill="none">
                              <path d="M1 3L2.5 4.5L6 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </div>

                        {/* Label + date */}
                        <div>
                          <div className={`text-[13px] font-medium leading-tight ${
                            isDone || isCurrent ? 'text-[#1c2b3a]' : 'text-[#9aa3af]'
                          }`}>
                            {step.stage}
                          </div>
                          {step.date ? (
                            <div className="text-[11px] text-[#9aa3af] mt-0.5">{step.date}</div>
                          ) : isCurrent ? (
                            <div className="text-[11px] text-blue-500 mt-0.5">In progress</div>
                          ) : (
                            <div className="text-[11px] text-[#c0c8d2] mt-0.5">Pending</div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </Card>

          {/* e) Admin Remarks */}
          <Card title="Admin Remarks">
            <div className="px-5 py-4">
              <textarea
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                rows={4}
                placeholder="Add a note before approving or rejecting…"
                className="w-full border border-[#dde1e7] rounded px-3 py-2 text-[13px] text-[#1c2b3a] bg-white outline-none placeholder-[#b0b8c4] focus:border-[#1a3557] transition-colors resize-none"
              />
              <div className="flex justify-end mt-3">
                <button className="px-3 py-1.5 bg-white border border-[#dde1e7] rounded text-[13px] text-[#4b5563] hover:bg-gray-50 transition-colors">
                  Save note
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
