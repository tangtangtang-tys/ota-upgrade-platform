
import React, { useState } from 'react';
import { 
  Search, 
  Calendar, 
  Download, 
  Filter,
  CheckCircle,
  XCircle,
  User,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  // Add missing Info icon import
  Info
} from 'lucide-react';
import { AuditLog, OperationLog } from '../types';
import { DingTalkAuditCard } from './DingTalkAuditCard';

const MOCK_AUDIT_LOGS: AuditLog[] = Array.from({ length: 8 }).map((_, i) => ({
  id: `AL-${2024000 + i}`,
  taskName: `版本发布审批_${i + 1}`,
  applicant: 'Admin_OTA',
  reviewer: 'Manager_Zhang',
  result: i % 3 === 0 ? 'REJECT' : 'PASS',
  comment: i % 3 === 0 ? '版本说明不完整，请补充。' : '申请通过，准予下发。',
  time: `2026-01-${16 + i} 09:44:46`
}));

export const LogManagement: React.FC = () => {
  const [logType, setLogType] = useState<'AUDIT' | 'OPERATION'>('AUDIT');
  const [expandedId, setExpandedId] = useState<string | null>(MOCK_AUDIT_LOGS[0].id);

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
         <div className="flex bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
            <button 
              onClick={() => setLogType('AUDIT')}
              className={`px-6 py-2 text-sm font-bold rounded-md transition-all ${
                logType === 'AUDIT' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              审批日志
            </button>
            <button 
              onClick={() => setLogType('OPERATION')}
              className={`px-6 py-2 text-sm font-bold rounded-md transition-all ${
                logType === 'OPERATION' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              操作日志
            </button>
         </div>
         <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50">
            <Download size={16} /> 导出日志
         </button>
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-wrap gap-4 items-center">
         <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input type="text" placeholder="搜索..." className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm bg-white outline-none focus:border-[#409EFF]" />
         </div>
         <div className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg cursor-pointer bg-white hover:bg-gray-100">
            <Calendar size={16} className="text-gray-400" />
            <span className="text-sm text-gray-600">本月</span>
         </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-7 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">任务名称</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">申请人</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-center">审批结果</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {MOCK_AUDIT_LOGS.map((log) => (
                <tr 
                  key={log.id} 
                  onClick={() => setExpandedId(log.id)}
                  className={`hover:bg-gray-50 transition-colors cursor-pointer ${expandedId === log.id ? 'bg-blue-50/30' : ''}`}
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{log.taskName}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{log.applicant}</td>
                  <td className="px-6 py-4 text-center">
                    {log.result === 'PASS' ? (
                      <span className="px-2 py-1 bg-green-50 text-green-600 text-[10px] font-black rounded-full border border-green-100">通过</span>
                    ) : (
                      <span className="px-2 py-1 bg-red-50 text-red-600 text-[10px] font-black rounded-full border border-red-100">驳回</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-xs font-bold ml-auto">
                       查看钉钉单据 {expandedId === log.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="col-span-12 lg:col-span-5 space-y-4">
           {expandedId ? (
             <div className="sticky top-6">
                <div className="flex items-center gap-2 mb-4 text-gray-400">
                   <MessageSquare size={16} />
                   <span className="text-xs font-bold uppercase tracking-wider">钉钉审批推送模拟</span>
                </div>
                <DingTalkAuditCard 
                  user="系统管理员"
                  version="10.134.123.33"
                  description="1"
                  approver="Manager_Zhang"
                  reason="发布为最新固件版本"
                  time="2026-01-16 09:44:46"
                  status="APPROVED"
                />
             </div>
           ) : (
             <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl text-gray-300">
                <Info size={48} className="mb-2 opacity-20" />
                <p className="text-sm font-medium">请点击左侧列表项查看审批详情</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};
