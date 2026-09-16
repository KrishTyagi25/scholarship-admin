import AppShell from '../components/AppShell';
import { Award } from 'lucide-react';

export default function Merit() {
  return (
    <AppShell title="Merit & Selection">
      <div className="flex flex-col items-center justify-center h-64 bg-white border border-[#dde1e7] rounded-lg text-center">
        <Award size={36} className="text-[#c0c8d2] mb-3" />
        <div className="text-[15px] font-semibold text-[#1c2b3a]">Merit & Selection</div>
        <div className="text-[13px] text-[#9aa3af] mt-1">
          Merit lists, ranking, and final selection will appear here.
        </div>
      </div>
    </AppShell>
  );
}
