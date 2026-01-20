
import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Info,
  MoreVertical,
  Trash2,
  Edit3,
  ExternalLink,
  BellRing
} from 'lucide-react';
import { FirmwareIdentifier, FirmwareVersion, PromptMethod } from '../types';
import { PublishConfirmModal } from './PublishConfirmModal';
import { FirmwareFormModal } from './FirmwareFormModal';
import { DingTalkApprovalMock } from './DingTalkApprovalMock';

const INITIAL_FID_IDS: FirmwareIdentifier[] = [
  { id: '10.20.11', name: 'IPC', associatedModel: '测试机型001ABC', createTime: '2026-06-01 12:06:06' },
  { id: '20.122.159', name: '车机', associatedModel: 'Test_Model_V2', createTime: '2026-06-01 12:06:06' },
  { id: '10.101.311', name: 'NVR', associatedModel: 'Recorder_Series', createTime: '2026-06-01 12:06:06' }
];

const INITIAL_VERSIONS: FirmwareVersion[] = [
  {
    id: 'V1',
    versionNumber: '20.122.159.13',
    downloadUrl: 'http://doraemon.camera666.com/firmware_20.122.159.13.bin',
    size: '1.02',
    promptMethod: PromptMethod.WEAK,
    description: '核心功能优化，提升连接成功率',
    updateTime: '2026-06-01 12:06:06',
    isLatest: true,
    status: 'published'
  },
  {
    id: 'V2',
    versionNumber: '20.122.159.14',
    downloadUrl: 'http://doraemon.camera666.com/firmware_20.122.159.14.bin',
    size: '1.05',
    promptMethod: PromptMethod.NONE,
    description: '新增夜视增强模式预览',
    updateTime: '2026-06-05 10:00:00',
    isLatest: false,
    status: 'draft'
  },
  {
    id: 'V3',
    versionNumber: '20.122.159.15',
    downloadUrl: 'http://doraemon.camera666.com/firmware_20.122.159.15.bin',
    size: '1.08',
    promptMethod: PromptMethod.NONE,
    description: '灰度测试版本，包含实验室功能',
    updateTime: '2026-06-10 15:30:00',
    isLatest: false,
    status: 'draft'
  },
  {
    id: 'V4',
    versionNumber: '20.122.159.12',
    downloadUrl: 'http://doraemon.camera666.com/firmware_20.122.159.12.bin',
    size: '0.98',
    promptMethod: PromptMethod.NONE,
    description: '常规维护更新',
    updateTime: '2026-05-20 10:00:00',
    isLatest: false,
    status: 'published'
  },
  {
    id: 'V5',
    versionNumber: '20.122.159.11',
    downloadUrl: 'http://doraemon.camera666.com/firmware_20.122.159.11.bin',
    size: '1.01',
    promptMethod: PromptMethod.STRONG,
    description: '紧急修复音频丢包问题',
    updateTime: '2026-05-10 09:00:00',
    isLatest: false,
    status: 'published'
  }
];

export const FirmwareManagement: React.FC = () => {
  const [fidList, setFidList] = useState<FirmwareIdentifier[]>(INITIAL_FID_IDS);
  const [selectedId, setSelectedId] = useState<string>(INITIAL_FID_IDS[0].id);
  const [versions, setVersions] = useState<FirmwareVersion[]>(INITIAL_VERSIONS);
  const [activeProductLine, setActiveProductLine] = useState<string>('IPC');
  
  // Modals state
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDingTalkMock, setShowDingTalkMock] = useState(false);
  const [editingVersion, setEditingVersion] = useState<FirmwareVersion | null>(null);
  const [pendingVersion, setPendingVersion] = useState<FirmwareVersion | null>(null);

  const productLines = ['IPC', '车载', 'NVR', 'BK', 'AI玩具', '其他'];

  const latestVersion = useMemo(() => versions.find(v => v.isLatest), [versions]);
  const historyVersions = useMemo(() => versions.filter(v => !v.isLatest), [versions]);

  const handlePublishClick = (version: FirmwareVersion) => {
    setPendingVersion(version);
    setShowPublishModal(true);
  };

  const handleAddVersion = () => {
    setEditingVersion(null);
    setShowFormModal(true);
  };

  const handleEditVersion = (version: FirmwareVersion) => {
    setEditingVersion(version);
    setShowFormModal(true);
  };

  const handleDeleteVersion = (id: string) => {
    if (confirm('确定要删除该固件版本吗？')) {
      setVersions(versions.filter(v => v.id !== id));
    }
  };

  const handleFormSubmit = (data: Partial<FirmwareVersion>) => {
    if (editingVersion) {
      setVersions(versions.map(v => v.id === editingVersion.id ? { ...v, ...data, updateTime: new Date().toLocaleString() } as FirmwareVersion : v));
    } else {
      const newVersion: FirmwareVersion = {
        id: `V${Date.now()}`,
        versionNumber: data.versionNumber || '',
        downloadUrl: data.downloadUrl || '',
        size: data.size || '1.00',
        promptMethod: PromptMethod.NONE,
        description: data.description || '',
        updateTime: new Date().toLocaleString(),
        isLatest: false,
        status: 'draft'
      };
      setVersions([newVersion, ...versions]);
    }
    setShowFormModal(false);
  };

  const handleConfirmPublish = (promptMethod: PromptMethod) => {
    if (!pendingVersion) return;
    
    // Step 1: Update status to 'reviewing'
    setVersions(versions.map(v => {
      if (v.id === pendingVersion.id) {
        return { ...v, status: 'reviewing', promptMethod };
      }
      return v;
    }));

    // Step 2: Show simulated DingTalk Notification
    setShowPublishModal(false);
    setTimeout(() => {
      setShowDingTalkMock(true);
    }, 500);
  };

  const handleFinalApprove = () => {
    if (!pendingVersion) return;

    // Final update: previous latest becomes history, current becomes latest published
    setVersions(versions.map(v => {
      if (v.id === pendingVersion.id) {
        return { ...v, status: 'published', isLatest: true, updateTime: new Date().toLocaleString() };
      }
      return { ...v, isLatest: false };
    }));
    
    setShowDingTalkMock(false);
    alert('审批通过！固件已完成线上发布。');
  };

  const renderPromptTag = (method: PromptMethod) => {
    switch (method) {
      case PromptMethod.WEAK:
        return <span className="px-2 py-0.5 bg-[#fdf6ec] text-[#e6a23c] text-[11px] rounded border border-[#faecd8]">弱提醒</span>;
      case PromptMethod.STRONG:
        return <span className="px-2 py-0.5 bg-[#fdf6ec] text-[#e6a23c] text-[11px] rounded border border-[#faecd8]">强提醒</span>;
      case PromptMethod.MANDATORY:
        return <span className="px-2 py-0.5 bg-[#fef0f0] text-[#f56c6c] text-[11px] rounded border border-[#fde2e2]">强制升级</span>;
      default:
        return <span className="px-2 py-0.5 bg-[#f4f4f5] text-[#909399] text-[11px] rounded border border-[#e9e9eb]">不提醒</span>;
    }
  };

  return (
    <div className="flex h-full bg-white overflow-hidden">
      {/* 1. 产品线 */}
      <div className="w-48 border-r border-[#EBEEF5] flex flex-col">
        <div className="p-4 border-b border-[#F5F7FA]">
           <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#C0C4CC]" size={14} />
             <input type="text" placeholder="搜索分类" className="w-full pl-8 pr-3 py-2 bg-white border border-[#DCDFE6] rounded-lg text-xs outline-none focus:ring-1 focus:ring-[#409EFF] transition-all" />
           </div>
        </div>
        <div className="flex-1 py-2 overflow-y-auto">
          {productLines.map(line => (
            <button
              key={line}
              onClick={() => setActiveProductLine(line)}
              className={`w-full text-left px-6 py-3.5 text-sm transition-all ${
                activeProductLine === line 
                ? 'text-[#409EFF] bg-[#ECF5FF] font-bold border-r-4 border-[#409EFF]' 
                : 'text-[#606266] hover:text-[#409EFF] hover:bg-[#F5F7FA]'
              }`}
            >
              {line}
            </button>
          ))}
        </div>
      </div>

      {/* 2. FID 列表 */}
      <div className="w-56 border-r border-[#EBEEF5] flex flex-col bg-white">
        <div className="p-4 flex items-center justify-between border-b border-[#F5F7FA]">
          <h3 className="font-bold text-[#303133] text-sm">固件标识 (FID)</h3>
          <button className="p-1.5 bg-[#409EFF] text-white rounded-lg hover:bg-[#66b1ff] transition-all">
            <Plus size={14} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {fidList.map(fid => (
            <button
              key={fid.id}
              onClick={() => setSelectedId(fid.id)}
              className={`w-full text-left px-6 py-5 border-b border-[#F5F7FA] text-sm transition-colors relative group ${
                selectedId === fid.id ? 'bg-[#ECF5FF] text-[#409EFF] font-bold' : 'text-[#606266] hover:bg-[#F5F7FA]'
              }`}
            >
              {fid.id}
              {selectedId === fid.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#409EFF]"></div>}
            </button>
          ))}
        </div>
      </div>

      {/* 3. 详情内容区 */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#F5F7FA] overflow-y-auto">
        <div className="p-6">
          <div className="bg-white rounded-xl shadow-sm border border-[#EBEEF5] overflow-hidden">
            {/* Header */}
            <div className="p-8 border-b border-[#F5F7FA]">
              <div className="flex justify-between items-start mb-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-black text-[#303133] tracking-tight">{selectedId}</h1>
                    <span className="px-2 py-0.5 bg-[#F4F4F5] text-[#909399] text-[10px] font-bold rounded">FID 详情</span>
                  </div>
                  <div className="flex flex-wrap gap-x-10 gap-y-2 text-sm">
                    <div className="flex gap-2">
                      <span className="text-[#909399]">产品线:</span>
                      <span className="text-[#303133] font-medium">IPC</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-[#909399]">关联机型:</span>
                      <span className="text-[#409EFF] cursor-pointer hover:underline font-medium">测试机型001ABC</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-[#909399]">创建时间:</span>
                      <span className="text-[#303133]">2026-06-01 12:06:06</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button className="px-4 py-2 border border-[#DCDFE6] text-[#606266] rounded-lg hover:bg-[#F5F7FA] text-sm font-medium">删除FID</button>
                  <button 
                    onClick={handleAddVersion}
                    className="px-5 py-2 bg-[#409EFF] text-white rounded-lg text-sm font-bold hover:bg-[#66b1ff] flex items-center gap-2 shadow-lg shadow-blue-100 transition-all active:scale-95"
                  >
                    <Plus size={16} /> 新增版本
                  </button>
                </div>
              </div>
            </div>

            <div className="p-8 space-y-10">
              {/* 最新版本 */}
              <section className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-4 bg-[#409EFF] rounded-full"></div>
                  <h3 className="font-bold text-[#303133]">最新发布版本</h3>
                </div>
                <div className="border border-[#EBEEF5] rounded-xl overflow-hidden shadow-sm">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-[#F5F7FA] border-b border-[#EBEEF5] text-[#909399]">
                      <tr>
                        <th className="px-6 py-4 font-bold">固件版本号</th>
                        <th className="px-6 py-4 font-bold">下载地址</th>
                        <th className="px-6 py-4 font-bold">文件大小 (M)</th>
                        <th className="px-6 py-4 font-bold">APP提醒方式</th>
                        <th className="px-6 py-4 font-bold">说明</th>
                        <th className="px-6 py-4 font-bold">操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {latestVersion ? (
                        <tr className="hover:bg-[#F5F7FA] transition-colors">
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-[#303133]">{latestVersion.versionNumber}</span>
                              <span className="px-2 py-0.5 bg-[#f0f9eb] text-[#67c23a] text-[11px] font-bold rounded border border-[#e1f3d8]">最新</span>
                            </div>
                          </td>
                          <td className="px-6 py-5 text-[#409EFF] max-w-xs truncate font-mono text-xs hover:underline cursor-pointer">
                            {latestVersion.downloadUrl}
                          </td>
                          <td className="px-6 py-5 text-[#303133] font-medium">{latestVersion.size} MB</td>
                          <td className="px-6 py-5">
                            {renderPromptTag(latestVersion.promptMethod)}
                          </td>
                          <td className="px-6 py-5 text-[#909399] max-w-xs truncate">{latestVersion.description}</td>
                          <td className="px-6 py-5">
                            <button onClick={() => handleEditVersion(latestVersion)} className="text-[#409EFF] font-bold hover:underline">详情</button>
                          </td>
                        </tr>
                      ) : (
                        <tr>
                          <td colSpan={6} className="px-6 py-10 text-center text-[#909399]">暂无已发布版本</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* 历史版本 */}
              <section className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-4 bg-[#E6A23C] rounded-full"></div>
                  <h3 className="font-bold text-[#303133]">版本库管理</h3>
                </div>

                <div className="border border-[#EBEEF5] rounded-xl overflow-hidden shadow-sm">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-[#F5F7FA] border-b border-[#EBEEF5] text-[#909399]">
                      <tr>
                        <th className="px-6 py-4 font-bold">固件版本号</th>
                        <th className="px-6 py-4 font-bold">状态</th>
                        <th className="px-6 py-4 font-bold">文件大小 (M)</th>
                        <th className="px-6 py-4 font-bold">版本说明</th>
                        <th className="px-6 py-4 font-bold">操作时间</th>
                        <th className="px-6 py-4 font-bold text-right">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F5F7FA]">
                      {historyVersions.length > 0 ? historyVersions.map(version => (
                        <tr key={version.id} className="hover:bg-[#F5F7FA] transition-colors group">
                          <td className="px-6 py-5">
                            <span className="font-medium text-[#303133]">{version.versionNumber}</span>
                          </td>
                          <td className="px-6 py-5">
                            {version.status === 'reviewing' ? (
                              <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[11px] font-bold rounded flex items-center gap-1 w-fit animate-pulse">
                                <BellRing size={10} /> 审批中...
                              </span>
                            ) : version.status === 'published' ? (
                              <span className="px-2 py-0.5 bg-green-50 text-green-600 text-[11px] font-bold rounded w-fit">已发布</span>
                            ) : (
                              <span className="px-2 py-0.5 bg-gray-50 text-gray-400 text-[11px] font-bold rounded w-fit">草稿</span>
                            )}
                          </td>
                          <td className="px-6 py-5 text-[#606266]">{version.size} MB</td>
                          <td className="px-6 py-5 text-[#909399] max-w-xs truncate">{version.description}</td>
                          <td className="px-6 py-5 text-[#909399] text-xs">{version.updateTime}</td>
                          <td className="px-6 py-5 text-right">
                            <div className="flex items-center justify-end gap-5 text-[13px] font-bold">
                              {version.status !== 'reviewing' && (
                                <button 
                                  onClick={() => handlePublishClick(version)}
                                  className="text-[#409EFF] hover:text-[#66b1ff] transition-all flex items-center gap-1"
                                >
                                  发布
                                </button>
                              )}
                              <button onClick={() => handleEditVersion(version)} className="text-[#606266] hover:text-[#409EFF]">编辑</button>
                              <button onClick={() => handleDeleteVersion(version.id)} className="text-[#F56C6C] hover:text-red-700">删除</button>
                            </div>
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan={6} className="px-6 py-10 text-center text-[#909399]">暂无版本记录</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showPublishModal && pendingVersion && (
        <PublishConfirmModal 
          version={pendingVersion.versionNumber}
          onClose={() => setShowPublishModal(false)}
          onConfirm={(method) => handleConfirmPublish(method)}
        />
      )}

      {showFormModal && (
        <FirmwareFormModal 
          selectedFid={selectedId}
          initialData={editingVersion}
          onClose={() => setShowFormModal(false)}
          onSubmit={handleFormSubmit}
        />
      )}

      {showDingTalkMock && pendingVersion && (
        <DingTalkApprovalMock 
          version={pendingVersion}
          fid={selectedId}
          onClose={() => setShowDingTalkMock(false)}
          onApprove={handleFinalApprove}
        />
      )}
    </div>
  );
};
