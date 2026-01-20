
import React, { useState } from 'react';
import { 
  X, 
  HelpCircle, 
  Eye, 
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Search,
  User,
  List,
  Maximize2,
  MessageSquare,
  Play,
  Settings,
  Trash2,
  Image as ImageIcon,
  Home,
  Package // Fix: Added missing Package import
} from 'lucide-react';
import { PromptMethod } from '../types';

interface PublishConfirmModalProps {
  version: string;
  onClose: () => void;
  onConfirm: (method: PromptMethod) => void;
}

export const PublishConfirmModal: React.FC<PublishConfirmModalProps> = ({ version, onClose, onConfirm }) => {
  const [selectedPrompt, setSelectedPrompt] = useState<PromptMethod>(PromptMethod.WEAK);

  const promptOptions = [
    { value: PromptMethod.NONE, label: '静默更新', description: '后台自动更新，用户无感知' },
    { value: PromptMethod.WEAK, label: '弱提醒', description: '设置按钮展示红色更新标记' },
    { value: PromptMethod.STRONG, label: '强提醒', description: '卡片底部展示橙色引导横幅' },
    { value: PromptMethod.MANDATORY, label: '强制升级', description: '卡片锁定遮罩，必须点击升级' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-[6px] p-4">
      <div className="bg-white rounded-[32px] shadow-[0_32px_128px_-16px_rgba(0,0,0,0.15)] w-full max-w-5xl overflow-hidden animate-in fade-in zoom-in duration-500 border border-gray-100 flex flex-col md:flex-row max-h-[90vh]">
        
        {/* Left: Configuration Form */}
        <div className="flex-[1.2] p-8 md:p-10 border-r border-gray-100 flex flex-col overflow-y-auto bg-white">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">发布预检确认</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
              <X size={20} />
            </button>
          </div>

          <div className="space-y-8 flex-1">
            {/* Version Info */}
            <div className="flex items-center gap-4 p-5 bg-blue-50/40 rounded-2xl border border-blue-100/50 shadow-sm">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200 shrink-0">
                {/* Fix: Replaced undefined PackageIcon with Package */}
                <Package />
              </div>
              <div>
                <p className="text-[10px] text-blue-500 font-black uppercase tracking-widest mb-0.5">即将发布版本</p>
                <p className="text-xl font-black text-gray-900">{version}</p>
              </div>
            </div>

            {/* Prompt Mode Selection */}
            <div className="space-y-5">
              <div className="flex items-center justify-between px-1">
                <label className="text-sm font-black text-gray-700 flex items-center gap-2">
                  APP 交互提醒模式
                  <HelpCircle size={14} className="text-gray-300 cursor-help" />
                </label>
                <span className="text-[11px] text-gray-400 font-bold">选择不同强度查看实时预览</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {promptOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setSelectedPrompt(opt.value)}
                    className={`text-left p-4 rounded-2xl border-2 transition-all group relative ${
                      selectedPrompt === opt.value 
                        ? 'border-blue-600 bg-blue-50/30 ring-4 ring-blue-50/50 shadow-sm' 
                        : 'border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-sm font-black ${selectedPrompt === opt.value ? 'text-blue-600' : 'text-gray-800'}`}>
                        {opt.label}
                      </span>
                      {selectedPrompt === opt.value && <CheckCircle size={18} className="text-blue-600 animate-in zoom-in duration-200" />}
                    </div>
                    <p className="text-[11px] text-gray-500 leading-snug font-medium">{opt.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Note Section */}
            <div className="p-5 bg-amber-50/60 rounded-2xl border border-amber-100 flex gap-4">
              <AlertCircle size={20} className="text-amber-600 shrink-0" />
              <div className="space-y-1">
                <p className="text-xs text-amber-900 font-black tracking-tight">安全策略提示</p>
                <p className="text-[11px] text-amber-800/80 leading-relaxed font-medium">
                  {selectedPrompt === PromptMethod.MANDATORY 
                    ? '强制升级将锁定设备卡片交互，直至用户完成升级。建议仅在修复重大安全隐患或版本兼容性断层时使用。'
                    : '该发布策略将按既定流程推送至用户端，请务必确认当前版本的灰度稳定性。'}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-10 flex gap-4">
            <button 
              onClick={onClose}
              className="flex-1 py-3.5 bg-gray-50 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-100 border border-gray-200 transition-colors"
            >
              取消并返回
            </button>
            <button 
              onClick={() => onConfirm(selectedPrompt)}
              className="flex-[2] py-3.5 bg-blue-600 text-white rounded-xl text-sm font-black hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all active:scale-95"
            >
              确认发布版本
            </button>
          </div>
        </div>

        {/* Right: APP Preview Mockup */}
        <div className="flex-1 bg-slate-50 p-6 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] z-20 whitespace-nowrap">
            <Eye size={12} /> APP 端交互实时预览
          </div>

          {/* iPhone Scaled Container */}
          <div className="relative transform scale-[0.82] lg:scale-[0.88] xl:scale-100 transition-transform duration-500 origin-center flex flex-col items-center">
            {/* Phone Body */}
            <div className="w-[280px] h-[560px] bg-black rounded-[48px] border-[10px] border-slate-800 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)] relative overflow-hidden flex flex-col ring-1 ring-slate-900/10">
              
              {/* Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-slate-800 rounded-b-2xl z-40"></div>
              
              <div className="flex-1 bg-[#F8F9FB] relative flex flex-col overflow-hidden">
                {/* Status Bar */}
                <div className="pt-8 px-6 flex justify-between items-center z-10">
                  <span className="text-[10px] font-black text-slate-900">17:14</span>
                  <div className="flex gap-1.5 items-center">
                     <div className="flex gap-[1.5px] items-end">
                       <div className="w-[2px] h-[3px] bg-slate-900"></div>
                       <div className="w-[2px] h-[5px] bg-slate-900"></div>
                       <div className="w-[2px] h-[7px] bg-slate-900"></div>
                       <div className="w-[2px] h-[9px] bg-slate-900"></div>
                     </div>
                     <span className="text-[9px] font-black text-slate-900">4G</span>
                     <div className="w-5 h-2.5 rounded-[2px] border border-slate-900 p-[1px] flex items-center">
                        <div className="w-3/4 h-full bg-[#34C759] rounded-[1px]"></div>
                     </div>
                  </div>
                </div>

                {/* Header */}
                <div className="mt-4 px-5 flex items-center justify-between">
                  <h4 className="text-[11px] font-bold text-slate-900">观看台</h4>
                  <div className="flex gap-3 text-slate-400">
                    <User size={12} />
                    <Search size={12} />
                    <List size={12} />
                    <Maximize2 size={12} />
                  </div>
                </div>

                {/* Card Container */}
                <div className="mt-4 mx-4 flex flex-col flex-1">
                  <div className="bg-white rounded-2xl shadow-[0_2px_15px_rgba(0,0,0,0.02)] border border-slate-100 overflow-hidden relative">
                    
                    {/* Device Header */}
                    <div className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 bg-slate-900 rounded-full flex items-center justify-center overflow-hidden border-2 border-slate-50 shrink-0">
                          <img 
                            src="https://images.unsplash.com/photo-1551817670-692135688090?w=120&h=120&fit=crop" 
                            className="w-full h-full object-cover opacity-90" 
                            alt="Camera"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="text-[11px] font-bold text-slate-800 truncate">无GPS设备</div>
                          <div className="text-[9px] text-slate-400 font-mono truncate">DCDG0012000GUFQ</div>
                        </div>
                      </div>
                      <ChevronRight size={14} className="text-slate-300" />
                    </div>

                    {/* Action Bar */}
                    <div className="px-4 pb-4 flex justify-between items-center">
                      <div className="flex gap-5">
                        <MessageSquare size={16} className="text-slate-400" />
                        <Play size={16} className="text-slate-400" />
                        <div className="relative">
                          <div className={`p-1.5 transition-all ${selectedPrompt === PromptMethod.WEAK ? 'border border-red-500 rounded-lg bg-red-50/20' : ''}`}>
                             <Settings size={16} className={selectedPrompt === PromptMethod.WEAK ? "text-red-500" : "text-slate-400"} />
                          </div>
                          {selectedPrompt === PromptMethod.WEAK && (
                            <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white shadow-sm"></div>
                          )}
                        </div>
                      </div>
                      <Trash2 size={16} className="text-slate-400" />
                    </div>

                    {/* Strong Reminder: Banner UI */}
                    {selectedPrompt === PromptMethod.STRONG && (
                      <div className="bg-[#ED6A14] text-white p-2.5 flex items-center justify-between animate-in slide-in-from-bottom-4 duration-300">
                        <span className="text-[9px] font-bold pl-2 tracking-tight">发现新的固件版本，请尽快升级</span>
                        <ChevronRight size={12} className="mr-1" />
                      </div>
                    )}

                    {/* Mandatory Reminder: Card Overlay UI */}
                    {selectedPrompt === PromptMethod.MANDATORY && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] flex items-center justify-center z-50 animate-in fade-in duration-300">
                        <div className="text-center p-4">
                           <h5 className="text-[14px] font-black text-white mb-1.5 tracking-tight">发现新固件</h5>
                           <p className="text-[9px] text-slate-300 leading-relaxed mb-5 font-medium px-4">为了不影响您的正常使用，请尽快升级</p>
                           <button className="px-10 py-2.5 bg-[#ED6A14] text-white rounded-full text-[11px] font-black shadow-lg shadow-orange-900/40 active:scale-95 transition-all">
                             立即升级
                           </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Dummy Card for Context */}
                  <div className="mt-4 bg-white rounded-2xl shadow-sm border border-slate-50 p-4 opacity-20 transition-opacity">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 bg-slate-200 rounded-full"></div>
                        <div className="space-y-2 flex-1">
                          <div className="w-16 h-2 bg-slate-100 rounded"></div>
                          <div className="w-full h-1.5 bg-slate-50 rounded"></div>
                        </div>
                      </div>
                  </div>
                </div>

                {/* Nav Bar */}
                <div className="bg-white border-t border-slate-50 px-10 pt-2 pb-6 flex justify-between items-center z-10">
                  <div className="flex flex-col items-center gap-1">
                    <ImageIcon size={16} className="text-slate-300" />
                    <span className="text-[8px] text-slate-400 font-bold">相册</span>
                  </div>
                  <div className="w-11 h-11 bg-[#ED6A14] rounded-full flex items-center justify-center text-white shadow-lg shadow-orange-100 -mt-7 ring-4 ring-white relative active:scale-95 transition-transform">
                     <Home size={20} fill="currentColor" />
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <User size={16} className="text-slate-300" />
                    <span className="text-[8px] text-slate-400 font-bold">我的</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
