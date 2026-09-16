import AppShell from '../components/AppShell';
import { BarChart2 } from 'lucide-react';

export default function Analytics() {
  return (
    <AppShell title="Analytics">
      <div className="flex flex-col items-center justify-center h-64 bg-white border border-[#dde1e7] rounded-lg text-center">
        <BarChart2 size={36} className="text-[#c0c8d2] mb-3" />
        <div className="text-[15px] font-semibold text-[#1c2b3a]">Analytics</div>
        <div className="text-[13px] text-[#9aa3af] mt-1">
          Scheme-wise statistics, trends, and reports will appear here.
        </div>
      </div>
    </AppShell>
  );
}
