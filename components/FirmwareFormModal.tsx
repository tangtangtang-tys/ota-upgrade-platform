
import React, { useState, useEffect } from 'react';
import { X, Upload, Trash2, Plus, Info } from 'lucide-react';
import { FirmwareVersion, PromptMethod } from '../types';

interface FirmwareFormModalProps {
  initialData?: FirmwareVersion | null;
  selectedFid: string;
  onClose: () => void;
  onSubmit: (data: Partial<FirmwareVersion>) => void;
}

export const FirmwareFormModal: React.FC<FirmwareFormModalProps> = ({ initialData, selectedFid, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<Partial<FirmwareVersion>>({
    versionNumber: '',
    downloadUrl: '',
    size: '',
    description: '',
  });

  const [associatedFunctions, setAssociatedFunctions] = useState([
    { id: '1', name: '夜视模式', preview: '示例图' },
    { id: '2', name: '运动侦测', preview: '示例图' }
  ]);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...formData, promptMethod: PromptMethod.NONE });
  };

  const removeFunction = (id: string) => {
    if (confirm('确认要移除这个功能项吗？')) {
      setAssociatedFunctions(associatedFunctions.filter(f => f.id !== id));
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/45 backdrop-blur-[4px] p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in duration-300 border border-[#EBEEF5] flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-8 py-5 border-b border-[#F5F7FA] flex items-center justify-between bg-white">
          <h2 className="text-lg font-bold text-[#303133]">新增固件版本号</h2>
          <button onClick={onClose} className="text-[#909399] hover:text-[#409EFF] transition-colors p-1 hover:bg-gray-100 rounded-full">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-10 space-y-12 bg-[#FBFBFC]/30">
          {/* Section 1: Basic Info */}
          <div className="space-y-8">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-5 bg-[#409EFF] rounded-full"></div>
              <h3 className="font-bold text-[#303133] text-[15px] tracking-tight">基本信息</h3>
            </div>

            <div className="space-y-6 max-w-3xl">
              {/* FID */}
              <div className="flex items-center gap-6">
                <label className="w-28 text-sm font-bold text-[#606266] text-right">
                  <span className="text-red-500 mr-1">*</span>固件标识
                </label>
                <div className="flex-1 relative">
                  <input
                    disabled
                    type="text"
                    className="w-full px-4 py-2.5 bg-gray-50/80 border border-[#DCDFE6] rounded-lg text-sm text-gray-400 outline-none font-medium"
                    value={selectedFid}
                  />
                  <span className="absolute -right-10 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#FFC107] rounded-lg text-[11px] flex items-center justify-center font-black text-white shadow-sm">5</span>
                </div>
              </div>

              {/* Version Number */}
              <div className="flex items-center gap-6">
                <label className="w-28 text-sm font-bold text-[#606266] text-right">
                  <span className="text-red-500 mr-1">*</span>固件版本号
                </label>
                <div className="flex-1 relative">
                  <input
                    required
                    type="text"
                    placeholder="版本格式为xx.xx.xx,如1.0.0"
                    className="w-full px-4 py-2.5 bg-white border border-[#DCDFE6] rounded-lg text-sm focus:ring-2 focus:ring-blue-50 focus:border-[#409EFF] outline-none transition-all placeholder-[#C0C4CC] font-bold"
                    value={formData.versionNumber}
                    onChange={(e) => setFormData({ ...formData, versionNumber: e.target.value })}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[#C0C4CC]">0/20</span>
                </div>
              </div>

              {/* Upload */}
              <div className="flex items-start gap-6">
                <label className="w-28 text-sm font-bold text-[#606266] text-right pt-2.5">
                  <span className="text-red-500 mr-1">*</span>上传固件包
                </label>
                <div className="flex-1">
                  <button type="button" className="px-6 py-2.5 bg-white border border-[#DCDFE6] rounded-lg text-sm font-bold text-[#606266] flex items-center gap-2 hover:border-[#409EFF] hover:text-[#409EFF] transition-all shadow-sm">
                    <Upload size={16} className="text-[#909399]" />
                    <span>选择固件文件</span>
                    <span className="text-[#409EFF] animate-pulse">⚡</span>
                  </button>
                </div>
              </div>

              {/* MD5 */}
              <div className="flex items-center gap-6">
                <label className="w-28 text-sm font-bold text-[#606266] text-right">
                  <span className="text-red-500 mr-1">*</span>MD5值
                </label>
                <input
                  disabled
                  type="text"
                  placeholder="上传文件后自动生成"
                  className="flex-1 px-4 py-2.5 bg-gray-50/80 border border-[#DCDFE6] rounded-lg text-sm text-gray-400 outline-none font-mono"
                />
              </div>

              {/* Description */}
              <div className="flex items-start gap-6">
                <label className="w-28 text-sm font-bold text-[#606266] text-right pt-2.5">说明</label>
                <div className="flex-1 relative">
                  <textarea
                    rows={4}
                    placeholder="请输入适当的固件版本说明信息"
                    className="w-full px-4 py-3 bg-white border border-[#DCDFE6] rounded-xl text-sm focus:ring-2 focus:ring-blue-50 focus:border-[#409EFF] outline-none transition-all placeholder-[#C0C4CC] leading-relaxed"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                  <span className="absolute right-4 bottom-3 text-[10px] font-bold text-[#C0C4CC]">0/200</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Functional Model */}
          <div className="space-y-8">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-5 bg-[#409EFF] rounded-full"></div>
              <h3 className="font-bold text-[#303133] text-[15px] tracking-tight">功能物模型</h3>
            </div>

            <div className="px-6 space-y-6">
              <div className="flex items-center gap-6">
                <label className="w-28 text-sm font-bold text-[#606266] text-right">关联功能</label>
                <div className="flex-1 flex items-center gap-3">
                  <button type="button" className="px-4 py-2 border-2 border-dashed border-[#409EFF] bg-blue-50/30 rounded-lg text-[#409EFF] text-xs font-black flex items-center gap-2 hover:bg-[#ECF5FF] transition-all">
                    <Plus size={16} /> 选择功能 ⚡
                  </button>
                  <span className="w-6 h-6 bg-[#FFD740] rounded-lg text-[11px] flex items-center justify-center font-black text-white shadow-sm">13</span>
                </div>
              </div>

              {/* Mock Functions Table */}
              <div className="border border-[#EBEEF5] bg-white rounded-xl overflow-hidden shadow-sm max-w-3xl">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#F8F9FA] border-b border-[#EBEEF5] text-[#909399]">
                    <tr>
                      <th className="px-8 py-4 font-bold text-xs uppercase tracking-wider">功能项名称</th>
                      <th className="px-8 py-4 font-bold text-xs uppercase tracking-wider">功能示例图</th>
                      <th className="px-8 py-4 font-bold text-xs uppercase tracking-wider text-right">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F5F7FA]">
                    {associatedFunctions.map(func => (
                      <tr key={func.id} className="group hover:bg-gray-50/50 transition-colors">
                        <td className="px-8 py-5 text-[#303133] font-bold">{func.name}</td>
                        <td className="px-8 py-5 text-[#909399] font-medium">{func.preview}</td>
                        <td className="px-8 py-5 text-right">
                          <button 
                            type="button"
                            onClick={() => removeFunction(func.id)}
                            className="text-[#F56C6C] font-bold text-xs hover:underline decoration-2"
                          >
                            移除
                          </button>
                        </td>
                      </tr>
                    ))}
                    {associatedFunctions.length === 0 && (
                      <tr>
                        <td colSpan={3} className="px-8 py-12 text-center text-[#C0C4CC] font-bold italic">暂无关联功能</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-10 py-6 border-t border-[#EBEEF5] flex justify-end gap-4 bg-white">
          <button
            type="button"
            onClick={onClose}
            className="px-8 py-2.5 border border-[#DCDFE6] text-[#606266] rounded-lg text-sm font-bold hover:bg-[#F5F7FA] transition-colors bg-white"
          >
            取消
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-12 py-2.5 bg-[#409EFF] text-white rounded-lg text-sm font-black hover:bg-[#66b1ff] shadow-xl shadow-blue-100 transition-all flex items-center gap-2 active:scale-95"
          >
            完成新增 ⚡
          </button>
        </div>
      </div>
    </div>
  );
};
