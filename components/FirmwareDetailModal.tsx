
import React from 'react';
import { 
  X, 
  Download, 
  FileCode, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  Info,
  ExternalLink,
  Layers,
  FileText
} from 'lucide-react';
import { FirmwareVersion, PromptMethod } from '../types';

interface FirmwareDetailModalProps {
  version: FirmwareVersion;
  selectedFid: string;
  onClose: () => void;
}

export const FirmwareDetailModal: React.FC<FirmwareDetailModalProps> = ({ version, selectedFid, onClose }) => {
  const renderPromptTag = (method: PromptMethod) => {
    switch (method) {
      case PromptMethod.WEAK:
        return <span className="px-2 py-0.5 bg-orange-50 text-orange-600 text-[11px] rounded border border-orange-100 font-bold">弱提醒</span>;
      case PromptMethod.STRONG:
        return <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-[11px] rounded border border-orange-200 font-bold">强提醒</span>;
      case PromptMethod.MANDATORY:
        return <span className="px-2 py-0.5 bg-red-50 text-red-600 text-[11px] rounded border border-red-100 font-bold">强制提醒</span>;
      default:
        return <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[11px] rounded border border-gray-200 font-bold">不提醒</span>;
    }
  };

  const associatedFunctions = [
    { id: '1', name: '夜视增强模式', type: '属性', desc: '支持在弱光环境下自动开启红外补光' },
    { id: '2', name: '移动侦测预警', type: '事件', desc: '检测到异常移动时主动推送告警' }
  ];

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in duration-300 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-8 py-5 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
              <FileCode size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">固件版本详情</h2>
              <p className="text-[11px] text-gray-400 font-medium">版本标识: {selectedFid}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-50 rounded-full">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-10 bg-[#FBFBFC]/50">
          {/* 状态总览 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">当前审批状态</span>
              <div className="flex items-center gap-2">
                {version.status === 'published' ? (
                  <span className="text-green-600 font-black flex items-center gap-1.5"><CheckCircle2 size={16} /> 已发布上线</span>
                ) : version.status === 'reviewing' ? (
                  <span className="text-blue-600 font-black flex items-center gap-1.5 animate-pulse"><Clock size={16} /> 审批流程中</span>
                ) : (
                  <span className="text-gray-400 font-black flex items-center gap-1.5"><Info size={16} /> 待发起发布</span>
                )}
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">版本包大小</span>
              <p className="text-lg font-black text-gray-900">{version.size} MB</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">APP 提醒强度</span>
              <div className="pt-1">{renderPromptTag(version.promptMethod)}</div>
            </div>
          </div>

          {/* 详细字段 */}
          <div className="space-y-6">
             <div className="flex items-center gap-3 border-b border-gray-100 pb-2">
                <Layers size={18} className="text-blue-600" />
                <h3 className="font-bold text-gray-900">核心配置信息</h3>
             </div>
             
             <div className="grid grid-cols-1 gap-y-6 max-w-4xl">
                <DetailRow label="固件版本号" value={version.versionNumber} isMono bold />
                <DetailRow label="MD5 校验值" value="8f9a2b3c4d5e6f7g8h9i0j1k2l3m4n5o" isMono />
                <div className="flex items-start gap-8">
                  <span className="w-24 text-sm font-bold text-gray-400 text-right shrink-0 pt-1">固件包地址</span>
                  <div className="flex-1 bg-gray-50 p-3 rounded-xl border border-gray-200 flex items-center justify-between group">
                    <span className="text-xs font-mono text-blue-600 truncate">{version.downloadUrl}</span>
                    <button className="flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:text-blue-800 shrink-0">
                      <ExternalLink size={12} /> 点击跳转
                    </button>
                  </div>
                </div>
                <div className="flex items-start gap-8">
                  <span className="w-24 text-sm font-bold text-gray-400 text-right shrink-0">更新说明</span>
                  <p className="flex-1 text-sm text-gray-700 leading-relaxed bg-white p-4 rounded-xl border border-gray-100">
                    {version.description || '该版本暂无详细更新说明。'}
                  </p>
                </div>
                <DetailRow label="最后操作时间" value={version.updateTime} />
             </div>
          </div>

          {/* 关联物模型 */}
          <div className="space-y-6">
             <div className="flex items-center gap-3 border-b border-gray-100 pb-2">
                <FileText size={18} className="text-blue-600" />
                <h3 className="font-bold text-gray-900">关联功能物模型 (T-SL)</h3>
             </div>

             <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200 text-gray-400 font-bold uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="px-6 py-3">功能名称</th>
                      <th className="px-6 py-3">功能类型</th>
                      <th className="px-6 py-3">功能描述</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {associatedFunctions.map(f => (
                      <tr key={f.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-bold text-gray-900">{f.name}</td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px] font-bold border border-blue-100">{f.type}</span>
                        </td>
                        <td className="px-6 py-4 text-xs text-gray-500">{f.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-gray-100 flex justify-end gap-3 bg-white">
          <button 
            onClick={onClose}
            className="px-8 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-95"
          >
            确定
          </button>
        </div>
      </div>
    </div>
  );
};

const DetailRow = ({ label, value, isMono, bold }: { label: string, value: string, isMono?: boolean, bold?: boolean }) => (
  <div className="flex items-center gap-8">
    <span className="w-24 text-sm font-bold text-gray-400 text-right shrink-0">{label}</span>
    <span className={`text-sm ${isMono ? 'font-mono' : ''} ${bold ? 'font-black text-gray-900' : 'text-gray-700'}`}>{value}</span>
  </div>
);
