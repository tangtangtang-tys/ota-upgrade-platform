
import React from 'react';
import { 
  X, 
  Check, 
  MessageCircle, 
  User, 
  Clock, 
  FileText,
  ShieldCheck,
  ChevronRight,
  MoreHorizontal,
  ThumbsUp,
  ExternalLink
} from 'lucide-react';
import { FirmwareVersion, Region } from '../types';

interface DingTalkApprovalMockProps {
  version: FirmwareVersion;
  fid: string;
  onClose: () => void;
  onApprove: () => void;
}

export const DingTalkApprovalMock: React.FC<DingTalkApprovalMockProps> = ({ version, fid, onClose, onApprove }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
      {/* 模拟移动端 DingTalk 容器 */}
      <div className="w-[380px] bg-[#F7F8FA] rounded-[32px] border-[8px] border-gray-900 shadow-2xl overflow-hidden relative flex flex-col h-[700px] animate-in slide-in-from-bottom-10 duration-500">
        
        {/* 手机状态栏 */}
        <div className="h-10 flex justify-between items-center px-8 pt-4">
           <span className="text-xs font-bold">14:20</span>
           <div className="flex gap-1.5 items-end">
              <div className="w-1 h-2 bg-black rounded-full"></div>
              <div className="w-1 h-3 bg-black rounded-full"></div>
              <div className="w-4 h-2 rounded-sm border border-black p-[1px] flex">
                <div className="flex-1 bg-green-500 rounded-sm"></div>
              </div>
           </div>
        </div>

        {/* 顶部导航 */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-100">
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="text-gray-400">
              <X size={20} />
            </button>
            <span className="font-bold text-sm">审批详情</span>
          </div>
          <MoreHorizontal size={20} className="text-gray-400" />
        </div>

        {/* 审批主体 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          
          {/* 状态头 */}
          <div className="bg-white p-4 rounded-xl shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#0089FF] rounded-lg flex items-center justify-center text-white">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h4 className="font-bold text-sm">固件发布申请</h4>
                <p className="text-[11px] text-orange-500 font-bold">等待我审批</p>
              </div>
            </div>
            <span className="text-[10px] text-gray-400">编号: 20260601-0023</span>
          </div>

          {/* 详情内容 */}
          <div className="bg-white rounded-xl shadow-sm divide-y divide-gray-50 overflow-hidden">
            <div className="p-4 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs shrink-0">
                  Admin
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">发起人</p>
                  <p className="text-sm font-bold">系统管理员 (Admin)</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <DetailItem label="所属业务大区" value="中国/杭州集群 (HZ-01)" highlight />
                <DetailItem label="固件标识 (FID)" value={fid} />
                <DetailItem label="发布版本号" value={version.versionNumber} bold />
                <DetailItem label="文件大小" value={`${version.size} MB`} />
                <DetailItem label="MD5校验值" value="8f9a2b3c4d5e6f7g8h9i0j1k2l3m4n5o" mono />
                <DetailItem label="下载地址" value={version.downloadUrl} isLink />
                <DetailItem label="版本说明" value={version.description} />
              </div>
            </div>

            {/* 流程信息 */}
            <div className="p-4 space-y-3">
               <h5 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">审批流程</h5>
               <div className="space-y-4 relative">
                  <div className="absolute left-3 top-2 bottom-2 w-px bg-gray-100"></div>
                  <Step active user="Admin" action="发起申请" time="14:15" />
                  <Step user="研发主管" action="等待审批" />
               </div>
            </div>
          </div>

          {/* 底部备注区域 */}
          <div className="bg-white p-4 rounded-xl shadow-sm space-y-3">
            <p className="text-xs font-bold text-gray-700">审批备注</p>
            <textarea 
              placeholder="请输入审批意见"
              className="w-full bg-gray-50 border-none rounded-lg p-3 text-sm focus:ring-1 focus:ring-[#0089FF] outline-none min-h-[80px]"
            />
          </div>
        </div>

        {/* 底部操作栏 */}
        <div className="bg-white p-4 pb-10 flex gap-3 border-t border-gray-100">
          <button 
            onClick={onClose}
            className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 active:bg-gray-50 transition-colors"
          >
            转交
          </button>
          <button 
            onClick={onClose}
            className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-bold text-red-500 active:bg-red-50 transition-colors"
          >
            驳回
          </button>
          <button 
            onClick={onApprove}
            className="flex-[1.5] py-3 bg-[#0089FF] text-white rounded-xl text-sm font-black shadow-lg shadow-blue-200 active:scale-95 transition-all"
          >
            同意并发布
          </button>
        </div>

      </div>
    </div>
  );
};

const DetailItem = ({ label, value, highlight, bold, mono, isLink }: any) => (
  <div className="space-y-1">
    <p className="text-[11px] text-gray-400">{label}</p>
    <div className={`text-xs break-all leading-relaxed ${highlight ? 'text-blue-600 font-black' : 'text-gray-800'} ${bold ? 'font-bold' : ''} ${mono ? 'font-mono bg-gray-50 p-1 rounded' : ''} ${isLink ? 'text-blue-500 underline' : ''}`}>
      {value}
    </div>
  </div>
);

const Step = ({ active, user, action, time }: any) => (
  <div className="flex items-center justify-between relative pl-8">
     <div className={`absolute left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 bg-white z-10 ${active ? 'border-green-500' : 'border-gray-200'}`}></div>
     <div className="flex flex-col">
        <span className="text-xs font-bold">{user}</span>
        <span className="text-[10px] text-gray-400">{action}</span>
     </div>
     {time && <span className="text-[10px] text-gray-400">{time}</span>}
  </div>
);
