
import React from 'react';
import { 
  CheckCircle,
  Clock,
  User,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface DingTalkAuditCardProps {
  user: string;
  version: string;
  description: string;
  approver: string;
  time: string;
  reason: string;
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
}

export const DingTalkAuditCard: React.FC<DingTalkAuditCardProps> = ({
  user,
  version,
  description,
  approver,
  time,
  reason,
  status
}) => {
  return (
    <div className="max-w-[480px] bg-[#F7F9FB] p-6 rounded-2xl border border-gray-100 shadow-sm animate-in fade-in zoom-in duration-300">
      <div className="bg-white rounded-[18px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 flex items-center gap-2">
          <div className="w-5 h-5 bg-[#FF9800] rounded-md flex items-center justify-center">
            <User size={12} className="text-white" fill="currentColor" />
          </div>
          <span className="text-[15px] font-medium text-gray-800">审批</span>
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-6">
          <div className="space-y-1">
            <h3 className="text-[17px] font-bold text-gray-900 leading-tight">
               {user} 提交的固件版本发布
            </h3>
          </div>

          <div className="space-y-5">
            <div className="flex items-start">
               <span className="text-[15px] text-gray-500 w-28 shrink-0">发布固件版本：</span>
               <span className="text-[15px] text-gray-900 font-medium">{version}</span>
            </div>

            <div className="flex items-start">
               <span className="text-[15px] text-gray-500 w-28 shrink-0">发布说明：</span>
               <span className="text-[15px] text-gray-900">{description}</span>
            </div>

            <div className="space-y-1 pt-1">
               <div className="flex items-center text-[13px] text-gray-400">
                  <span className="w-20">当前审批人：</span>
                  <span className="text-gray-500">{approver}</span>
               </div>
               <div className="flex items-center text-[13px] text-gray-400">
                  <span className="w-20">申请原因：</span>
                  <span className="text-gray-500">{reason}</span>
               </div>
               <div className="flex items-center text-[13px] text-gray-400">
                  <span className="w-20">申请时间：</span>
                  <span className="text-gray-500">{time}</span>
               </div>
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="px-5 py-3 border-t border-gray-50 bg-[#F9FAFB]/50">
           <div className="w-full h-11 bg-[#F1F2F4] rounded-full flex items-center justify-center gap-1.5 text-[#9CA3AF] font-medium text-[15px] cursor-not-allowed">
              <span>{approver} 已同意</span>
           </div>
        </div>
      </div>
      
      {/* Simulation context deco */}
      <div className="mt-4 flex justify-end">
         <div className="flex gap-2 text-gray-300">
            <ExternalLink size={16} />
            <Clock size={16} />
         </div>
      </div>
    </div>
  );
};
