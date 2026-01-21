
import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Info,
  MoreVertical,
  Trash2,
  Edit3,
  ExternalLink,
  BellRing,
  FileCode,
  CheckCircle2,
  Clock,
  ChevronRight,
  Eye
} from 'lucide-react';
import { FirmwareIdentifier, FirmwareVersion, PromptMethod } from '../types';
import { PublishConfirmModal } from './PublishConfirmModal';
import { FirmwareFormModal } from './FirmwareFormModal';
import { FirmwareDetailModal } from './FirmwareDetailModal';
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
    downloadUrl: 'http://ota.cloud.com/fw_v13.bin',
    size: '1.02',
    promptMethod: PromptMethod.WEAK,
    description: '核心功能优化，提升弱网连接率',
    updateTime: '2026-06-01 12:06:06',
    isLatest: true,
    status: 'published'
  },
  {
    id: 'V2',
    versionNumber: '20.122.159.14',
    downloadUrl: 'http://ota.cloud.com/fw_v14_test.bin',
    size: '1.05',
    promptMethod: PromptMethod.NONE,
    description: '内部测试版本，修复已知Bug',
    updateTime: '2026-06-05 10:00:00',
    isLatest: false,
    status: 'draft'
  },
  {
    id: 'V3',
    versionNumber: '20.122.159.15',
    downloadUrl: 'http://ota.cloud.com/fw_v15_alpha.bin',
    size: '1.08',
    promptMethod: PromptMethod.NONE,
    description: 'Alpha测试版本，包含实验室功能',
    updateTime: '2026-06-10 15:30:00',
    isLatest: false,
    status: 'draft'
  }
];

export const FirmwareManagement: React.FC = () => {
  const [fidList, setFidList] = useState<FirmwareIdentifier[]>(INITIAL_FID_IDS);
  const [selectedId, setSelectedId] = useState<string>(INITIAL_FID_IDS[0].id);
  const [versions, setVersions] = useState<FirmwareVersion[]>(INITIAL_VERSIONS);
  const [activeProductLine, setActiveProductLine] = useState<string>('IPC');
  
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDingTalkMock, setShowDingTalkMock] = useState(false);
  const [editingVersion, setEditingVersion] = useState<FirmwareVersion | null>(null);
  const [detailVersion, setDetailVersion] = useState<FirmwareVersion | null>(null);
  const [pendingVersion, setPendingVersion] = useState<FirmwareVersion | null>(null);

  const productLines = ['IPC', '车载', 'NVR', 'AI', 'IoT', '其他'];

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

  const handleViewDetail = (version: FirmwareVersion) => {
    setDetailVersion(version);
    setShowDetailModal(true);
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
    setVersions(versions.map(v => v.id === pendingVersion.id ? { ...v, status: 'reviewing', promptMethod } : v));
    setShowPublishModal(false);
    setTimeout(() => setShowDingTalkMock(true), 500);
  };

  const handleFinalApprove = () => {
    if (!pendingVersion) return;
    setVersions(versions.map(v => {
      if (v.id === pendingVersion.id) return { ...v, status: 'published', isLatest: true, updateTime: new Date().toLocaleString() };
      return { ...v, isLatest: false };
    }));
    setShowDingTalkMock(false);
  };

  const renderApprovalStatus = (status: 'published' | 'reviewing' | 'draft') => {
    switch (status) {
      case 'published':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-md border border-green-100">
            <CheckCircle2 size={12} /> 已发布
          </span>
        );
      case 'reviewing':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-md border border-blue-100 animate-pulse">
            <Clock size={12} /> 审批中
          </span>
        );
      default:
        return <span className="text-gray-300 font-medium px-2.5">-</span>;
    }
  };

  return (
    <div className="flex h-full bg-white overflow-hidden">
      {/* 1. 分类导航 */}
      <div className="w-52 border-r border-gray-100 flex flex-col shrink-0">
        <div className="p-4 border-b border-gray-50 bg-gray-50/20">
           <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
             <input type="text" placeholder="搜索产品线" className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all" />
           </div>
        </div>
        <div className="flex-1 py-2 overflow-y-auto">
          {productLines.map(line => (
            <button
              key={line}
              onClick={() => setActiveProductLine(line)}
              className={`w-full text-left px-6 py-3.5 text-sm transition-all ${
                activeProductLine === line 
                ? 'text-blue-600 bg-blue-50/30 font-bold border-r-4 border-blue-600' 
                : 'text-gray-500 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              {line}
            </button>
          ))}
        </div>
      </div>

      {/* 2. FID 列表 */}
      <div className="w-64 border-r border-gray-100 flex flex-col shrink-0 bg-white">
        <div className="p-5 flex items-center justify-between border-b border-gray-50">
          <h3 className="font-bold text-gray-900 text-sm">固件标识 (FID)</h3>
          <button className="p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-sm">
            <Plus size={14} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {fidList.map(fid => (
            <button
              key={fid.id}
              onClick={() => setSelectedId(fid.id)}
              className={`w-full text-left px-6 py-5 border-b border-gray-50 text-sm transition-all relative group ${
                selectedId === fid.id ? 'bg-blue-50/20 text-blue-600 font-bold' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                 <FileCode size={16} className={selectedId === fid.id ? 'text-blue-600' : 'text-gray-400'} />
                 <span className="truncate">{fid.id}</span>
              </div>
              {selectedId === fid.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600"></div>}
            </button>
          ))}
        </div>
      </div>

      {/* 3. 详情与版本库列表 */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#F5F7FA] overflow-y-auto">
        <div className="p-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="p-8 border-b border-gray-100">
              <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight">{selectedId}</h1>
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded">FID 详情</span>
                  </div>
                  <div className="flex flex-wrap gap-x-10 gap-y-2 text-[13px]">
                    <div className="flex gap-2">
                      <span className="text-gray-400">产品线:</span>
                      <span className="text-gray-700 font-medium">{activeProductLine}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-gray-400">关联机型:</span>
                      <span className="text-blue-600 cursor-pointer hover:underline font-bold">Model_X_001</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={handleAddVersion} className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 flex items-center gap-2 shadow-lg shadow-blue-100 transition-all active:scale-95">
                    <Plus size={18} /> 新增版本
                  </button>
                </div>
              </div>
            </div>

            <div className="p-8 space-y-12">
              {/* 最新发布版本 */}
              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-5 bg-green-500 rounded-full"></div>
                  <h3 className="font-bold text-gray-900">当前线上版本</h3>
                </div>
                {latestVersion ? (
                  <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 hover:border-green-200 transition-all group">
                    <div className="flex items-center gap-6">
                       <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 border border-green-100">
                          <CheckCircle2 size={32} />
                       </div>
                       <div className="space-y-1">
                          <p className="text-xl font-black text-gray-900">{latestVersion.versionNumber}</p>
                          <p className="text-xs text-gray-400 font-medium">发布于 {latestVersion.updateTime}</p>
                       </div>
                    </div>
                    <div className="flex gap-10">
                       <div className="text-center">
                          <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">文件大小</p>
                          <p className="text-sm font-bold text-gray-800">{latestVersion.size} MB</p>
                       </div>
                       <div className="text-center">
                          <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">提醒模式</p>
                          <span className="px-2 py-0.5 bg-orange-50 text-orange-600 text-[10px] font-black rounded border border-orange-100">强提醒</span>
                       </div>
                    </div>
                    <button 
                      onClick={() => handleViewDetail(latestVersion)}
                      className="px-6 py-2 border border-blue-600 rounded-lg text-sm font-bold text-blue-600 hover:bg-blue-600 hover:text-white transition-all bg-white"
                    >
                       查看版本详情
                    </button>
                  </div>
                ) : (
                  <div className="p-12 border-2 border-dashed border-gray-100 rounded-xl flex flex-col items-center justify-center text-gray-300">
                     <Clock size={32} className="mb-2 opacity-20" />
                     <p className="text-sm font-medium">当前 FID 暂无正式发布版本</p>
                  </div>
                )}
              </section>

              {/* 版本库列表 */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-5 bg-blue-600 rounded-full"></div>
                    <h3 className="font-bold text-gray-900">版本库列表</h3>
                  </div>
                  <div className="text-[11px] text-gray-400 flex items-center gap-1.5">
                    <Info size={14} />
                    <span>草稿/测试包不计入审批流程，点击“发布”即可发起正式审批</span>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm min-w-[800px]">
                      <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider">
                        <tr>
                          <th className="px-6 py-4">固件版本号</th>
                          <th className="px-6 py-4">审批状态</th>
                          <th className="px-6 py-4">文件大小 (M)</th>
                          <th className="px-6 py-4">上传时间</th>
                          <th className="px-6 py-4 text-right">操作</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {historyVersions.map(version => (
                          <tr key={version.id} className="hover:bg-gray-50/50 transition-colors group">
                            <td className="px-6 py-5">
                              <span className="font-mono font-bold text-gray-900">{version.versionNumber}</span>
                            </td>
                            <td className="px-6 py-5">
                              {renderApprovalStatus(version.status)}
                            </td>
                            <td className="px-6 py-5 text-gray-600">{version.size} MB</td>
                            <td className="px-6 py-5 text-gray-400 text-xs">{version.updateTime}</td>
                            <td className="px-6 py-5">
                              <div className="flex items-center justify-end gap-5">
                                {version.status === 'draft' ? (
                                  <button 
                                    onClick={() => handlePublishClick(version)}
                                    className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 shadow-sm shadow-blue-50 transition-all flex items-center gap-1"
                                  >
                                    发布
                                  </button>
                                ) : (
                                  <button className="text-gray-400 text-xs font-bold cursor-default">
                                    流程进行中
                                  </button>
                                )}
                                <div className="h-4 w-px bg-gray-200"></div>
                                <button 
                                  onClick={() => handleViewDetail(version)}
                                  className="text-gray-600 hover:text-blue-600 text-xs font-bold flex items-center gap-1"
                                >
                                  <Eye size={14} /> 详情
                                </button>
                                <button className="text-gray-600 hover:text-blue-600 text-xs font-bold">编辑</button>
                                <button className="text-red-500 hover:text-red-700 text-xs font-bold">删除</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
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
          onConfirm={handleConfirmPublish}
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

      {showDetailModal && detailVersion && (
        <FirmwareDetailModal 
          version={detailVersion}
          selectedFid={selectedId}
          onClose={() => setShowDetailModal(false)}
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
