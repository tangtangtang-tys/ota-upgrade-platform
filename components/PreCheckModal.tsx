
import React from 'react';
import { 
  AlertTriangle, 
  X, 
  Download, 
  CheckCircle, 
  Info,
  ChevronRight
} from 'lucide-react';
import { Device, Region } from '../types';

interface PreCheckModalProps {
  devices: Device[];
  targetRegion: Region;
  onClose: () => void;
  onTidyAndPublish: () => void;
}

export const PreCheckModal: React.FC<PreCheckModalProps> = ({ 
  devices, 
  targetRegion, 
  onClose, 
  onTidyAndPublish 
}) => {
  const invalidDevices = devices.filter(d => !d.isValid);
  const regionMismatched = invalidDevices.filter(d => d.errorReason === '大区不匹配');
  const versionMismatched = invalidDevices.filter(d => d.errorReason === '版本不支持升级');
  
  const allInvalid = invalidDevices.length === devices.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-orange-50 px-8 py-6 flex items-center justify-between border-b border-orange-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">发布预检警示</h2>
              <p className="text-sm text-orange-700 font-medium">检测到部分设备不符合发布条件</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="px-8 py-6 space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">总导入设备</span>
              <span className="text-2xl font-bold text-gray-900">{devices.length}</span>
            </div>
            <div className="bg-red-50 p-4 rounded-xl border border-red-100">
              <span className="text-[10px] font-bold text-red-400 uppercase block mb-1">异常待剔除</span>
              <span className="text-2xl font-bold text-red-600">{invalidDevices.length}</span>
            </div>
            <div className="bg-green-50 p-4 rounded-xl border border-green-100">
              <span className="text-[10px] font-bold text-green-400 uppercase block mb-1">可升级设备</span>
              <span className="text-2xl font-bold text-green-600">{devices.length - invalidDevices.length}</span>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-800">异常分类明细：</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg group hover:border-orange-300 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <span className="text-sm text-gray-700"><b>大区不匹配</b>：设备位于其他集群，无法在此任务执行</span>
                </div>
                <span className="text-sm font-bold text-gray-900 px-3 py-1 bg-gray-100 rounded-full group-hover:bg-red-50 group-hover:text-red-600 transition-colors">{regionMismatched.length} 台</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg group hover:border-orange-300 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                  <span className="text-sm text-gray-700"><b>版本不支持</b>：源版本过低或不满足平滑升级白名单</span>
                </div>
                <span className="text-sm font-bold text-gray-900 px-3 py-1 bg-gray-100 rounded-full group-hover:bg-red-50 group-hover:text-red-600 transition-colors">{versionMismatched.length} 台</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 flex gap-3">
            <Info className="text-blue-500 shrink-0 mt-0.5" size={18} />
            <div className="space-y-1">
              <p className="text-sm text-blue-900 font-medium">建议方案：</p>
              <p className="text-xs text-blue-700 leading-relaxed">
                点击「剔除异常并发布」将自动移除上述不符合条件的设备，并对剩余合规设备立即启动升级流程。您也可以下载明细进行排查。
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <button 
            className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
          >
            <Download size={18} />
            下载异常明细 (Excel)
          </button>
          
          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="px-5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
            >
              取消并返回
            </button>
            <button 
              disabled={allInvalid}
              onClick={onTidyAndPublish}
              className={`px-8 py-2.5 rounded-lg text-sm font-bold text-white transition-all shadow-md active:scale-95 flex items-center gap-2 ${
                allInvalid ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              <CheckCircle size={18} />
              剔除异常并发布
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
