
import React, { useState, useRef } from 'react';
import { 
  ArrowLeft, 
  Upload, 
  X, 
  Trash2,
  Plus,
  Loader2,
  Download,
  Check,
  Calendar,
  Save,
  Rocket,
  FileText,
  RefreshCcw,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { OTATask, TaskStatus, Region, Device, UpgradeStrategy, VersionRow } from '../types';
import { PreCheckModal } from './PreCheckModal';

interface CreateTaskProps {
  onCancel: () => void;
  onSubmit: (task: OTATask) => void;
}

type UploadStep = 'IDLE' | 'UPLOADING' | 'PARSING' | 'VALIDATING' | 'DONE';

export const CreateTask: React.FC<CreateTaskProps> = ({ onCancel, onSubmit }) => {
  const [taskName, setTaskName] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<Region>(Region.HZ);
  const [targetVersion, setTargetVersion] = useState('');
  const [strategy, setStrategy] = useState<UpgradeStrategy>(UpgradeStrategy.VERSION);
  const [description, setDescription] = useState('');
  
  // 指定版本号配置
  const [batchMethod, setBatchMethod] = useState('批量');
  const [versionRows, setVersionRows] = useState<VersionRow[]>([{ sourceVersion: '', count: 99 }]);
  
  // 策略条件
  const [filterRegion, setFilterRegion] = useState({ enabled: true, operator: '等于', value: '广东-深圳' });
  const [filterDistributor, setFilterDistributor] = useState({ enabled: true, operator: '等于', value: '深圳市维拍物联' });

  // 文件导入配置
  const [devices, setDevices] = useState<Device[]>([]);
  const [uploadStep, setUploadStep] = useState<UploadStep>('IDLE');
  const [progress, setProgress] = useState(0);
  const [uploadedFileName, setUploadedFileName] = useState('');
  
  // 手动录入配置
  const [manualDevices, setManualDevices] = useState<Device[]>([
    { id: '', currentVersion: '10.1.123.1', currentRegion: '-', status: 'online' }
  ]);

  const [showPreCheck, setShowPreCheck] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 模拟导入过程
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    setUploadStep('UPLOADING');
    setProgress(0);
    let p = 0;
    const interval = setInterval(() => {
      p += 10;
      setProgress(p);
      if (p === 40) setUploadStep('PARSING');
      if (p === 80) setUploadStep('VALIDATING');
      if (p >= 100) {
        clearInterval(interval);
        // 模拟校验逻辑：前几台成功，后面几台大区不匹配
        const mockDevices: Device[] = Array.from({ length: 12 }).map((_, i) => {
          const deviceRegion = i < 8 ? selectedRegion : (i < 10 ? '中国/成都' : '欧洲/法兰克福');
          const isValid = deviceRegion === selectedRegion;
          return {
            id: `LAI-CAM-${828700 + i}`,
            currentVersion: '10.11.1.12',
            currentRegion: deviceRegion,
            status: 'online' as const,
            isValid: isValid,
            errorReason: isValid ? '校验通过' : `大区不匹配：该设备位于 ${deviceRegion}`
          };
        });
        setDevices(mockDevices);
        setUploadStep('DONE');
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    }, 100);
  };

  const handleReplaceFile = () => {
    fileInputRef.current?.click();
  };

  const addVersionRow = () => setVersionRows([...versionRows, { sourceVersion: '', count: 99 }]);
  const removeVersionRow = (index: number) => {
    if (versionRows.length > 1) {
      setVersionRows(versionRows.filter((_, i) => i !== index));
    }
  };

  const addManualRow = () => setManualDevices([...manualDevices, { id: '', currentVersion: '10.1.123.1', currentRegion: '-', status: 'online' }]);
  const removeManualRow = (index: number) => {
    if (manualDevices.length > 1) {
      setManualDevices(manualDevices.filter((_, i) => i !== index));
    }
  };

  const handleManualIdChange = (index: number, val: string) => {
    const newList = [...manualDevices];
    newList[index].id = val;
    if (val.length > 8) {
      newList[index].currentRegion = index === 1 ? selectedRegion : '中国/成都';
      newList[index].isValid = newList[index].currentRegion === selectedRegion;
      newList[index].errorReason = newList[index].isValid ? '校验通过' : '大区不匹配';
    } else {
      newList[index].currentRegion = '-';
    }
    setManualDevices(newList);
  };

  const handlePublish = () => {
    const hasInvalid = (strategy === UpgradeStrategy.FILE && devices.some(d => !d.isValid)) || 
                      (strategy === UpgradeStrategy.MANUAL && manualDevices.some(d => d.id && !d.isValid));
    if (hasInvalid) {
      setShowPreCheck(true);
    } else {
      finalizeTask();
    }
  };

  const finalizeTask = () => {
    onSubmit({
      id: `OTA-${Date.now()}`,
      name: taskName,
      targetVersion,
      region: selectedRegion,
      totalDevices: strategy === UpgradeStrategy.FILE ? devices.length : 100,
      successRate: 0,
      status: TaskStatus.DRAFT,
      createTime: new Date().toLocaleString(),
      strategy: strategy
    });
  };

  return (
    <div className="bg-[#F5F7FA] min-h-screen">
      {/* 顶部 Header */}
      <div className="h-14 bg-white border-b border-gray-200 flex items-center px-6 sticky top-0 z-30 shadow-sm">
        <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-full mr-4 text-gray-500 transition-colors">
          <ArrowLeft size={18} />
        </button>
        <span className="text-sm font-bold text-gray-800">新建升级任务</span>
      </div>

      <div className="max-w-6xl mx-auto p-6 space-y-6 pb-32">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-8 space-y-10">
            {/* 基础配置区块 */}
            <div className="space-y-8">
              <div className="flex items-center gap-2">
                <div className="w-1 h-4 bg-blue-600 rounded-full"></div>
                <h3 className="font-bold text-gray-800">任务基础配置</h3>
              </div>

              <div className="grid grid-cols-1 gap-y-6 max-w-4xl">
                {/* 任务大区 */}
                <div className="flex items-center gap-6">
                  <label className="w-32 text-sm font-medium text-gray-600 text-right">
                    <span className="text-red-500 mr-1">*</span>任务所属大区
                  </label>
                  <div className="flex-1">
                    <span className="text-sm font-bold text-gray-900 px-4 py-2 border border-gray-200 rounded-lg bg-white inline-block">
                      {selectedRegion}
                    </span>
                  </div>
                </div>

                {/* 任务名称 */}
                <div className="flex items-center gap-6">
                  <label className="w-32 text-sm font-medium text-gray-600 text-right">
                    <span className="text-red-500 mr-1">*</span>任务名称
                  </label>
                  <input 
                    type="text" 
                    placeholder="请输入任务名称" 
                    value={taskName}
                    onChange={e => setTaskName(e.target.value)}
                    className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white outline-none focus:border-blue-500 transition-all"
                  />
                </div>

                {/* 目标版本 */}
                <div className="flex items-center gap-6">
                  <label className="w-32 text-sm font-medium text-gray-600 text-right">
                    <span className="text-red-500 mr-1">*</span>目标固件版本
                  </label>
                  <input 
                    type="text" 
                    placeholder="请输入目标固件版本号" 
                    value={targetVersion}
                    onChange={e => setTargetVersion(e.target.value)}
                    className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white outline-none focus:border-blue-500 transition-all font-mono font-bold text-blue-600"
                  />
                </div>

                {/* 升级策略选择 */}
                <div className="flex items-start gap-6">
                  <label className="w-32 text-sm font-medium text-gray-600 text-right pt-2">
                    <span className="text-red-500 mr-1">*</span>升级策略
                  </label>
                  <div className="flex-1 grid grid-cols-3 gap-4">
                    {[
                      { id: UpgradeStrategy.VERSION, title: '指定版本号升级', desc: '按旧版本筛选' },
                      { id: UpgradeStrategy.FILE, title: '文件导入升级', desc: '上传.csv批量导入' },
                      { id: UpgradeStrategy.MANUAL, title: '手动导入升级', desc: '手动输入设备ID' }
                    ].map(s => (
                      <button
                        key={s.id}
                        onClick={() => setStrategy(s.id)}
                        className={`p-4 text-left rounded-xl border transition-all relative ${
                          strategy === s.id ? 'border-blue-600 bg-blue-50/20' : 'border-gray-200 bg-white hover:border-blue-300'
                        }`}
                      >
                        <h4 className={`text-sm font-bold mb-1 ${strategy === s.id ? 'text-blue-600' : 'text-gray-900'}`}>{s.title}</h4>
                        <p className="text-[11px] text-gray-400 font-medium">{s.desc}</p>
                        {strategy === s.id && <div className="absolute top-2 right-2 text-blue-600"><Check size={16} strokeWidth={3} /></div>}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* 动态策略逻辑区块 */}
            <div className="min-h-[400px]">
              {/* 1. 指定版本号配置 */}
              {strategy === UpgradeStrategy.VERSION && (
                <div className="space-y-6 max-w-4xl animate-in fade-in duration-300">
                  <div className="flex items-center gap-6">
                    <label className="w-32 text-sm font-medium text-gray-600 text-right">升级方式</label>
                    <div className="flex-1 flex items-center gap-4">
                      <select 
                        value={batchMethod}
                        onChange={e => setBatchMethod(e.target.value)}
                        className="w-32 px-3 py-2 border border-gray-200 rounded-lg text-sm font-bold outline-none bg-white focus:border-blue-500"
                      >
                        <option>批量</option>
                        <option>全量</option>
                      </select>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">数量限制</span>
                        <div className="flex items-center border border-gray-200 rounded-lg bg-white">
                          <button className="px-3 py-1 hover:bg-gray-50 text-gray-400">-</button>
                          <input type="text" value="99" readOnly className="w-10 text-center text-xs font-bold bg-white" />
                          <button className="px-3 py-1 hover:bg-gray-50 text-gray-400">+</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-6">
                    <div className="w-32"></div>
                    <div className="flex-1 border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold">
                          <tr>
                            <th className="px-6 py-3">源固件版本</th>
                            <th className="px-6 py-3">数量上限</th>
                            <th className="px-6 py-3 text-right">操作</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {versionRows.map((row, idx) => (
                            <tr key={idx}>
                              <td className="px-6 py-2">
                                <input type="text" placeholder="源版本" className="w-full px-3 py-2 border border-gray-100 rounded-lg bg-white focus:border-blue-500 outline-none" />
                              </td>
                              <td className="px-6 py-2 font-bold text-gray-700">99</td>
                              <td className="px-6 py-2 text-right">
                                {versionRows.length > 1 && <button onClick={() => removeVersionRow(idx)} className="text-gray-400 hover:text-red-500 p-1"><Trash2 size={16} /></button>}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <button onClick={addVersionRow} className="w-full py-3 text-blue-600 text-xs font-bold hover:bg-blue-50 flex items-center justify-center gap-2 border-t border-gray-100 bg-white">
                        <Plus size={14} /> 添加一行
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. 文件导入升级配置 */}
              {strategy === UpgradeStrategy.FILE && (
                <div className="space-y-6 animate-in fade-in duration-300 max-w-5xl">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-gray-700">导入并校验设备列表</p>
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-xs font-bold hover:bg-gray-50 bg-white">
                      <Download size={14} /> 下载模版
                    </button>
                  </div>

                  <input ref={fileInputRef} type="file" className="hidden" onChange={handleImport} accept=".csv" />

                  {uploadStep === 'IDLE' ? (
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-200 rounded-xl p-12 flex flex-col items-center justify-center bg-white hover:border-blue-400 hover:bg-blue-50/20 transition-all cursor-pointer group"
                    >
                      <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-100 transition-colors">
                        <Upload className="text-gray-400 group-hover:text-blue-600" size={24} />
                      </div>
                      <span className="text-sm font-bold text-gray-500 group-hover:text-blue-700">点击或将文件拖拽至此处上传</span>
                      <p className="text-xs text-gray-400 mt-2">支持 .csv 格式，最大支持 1000 台设备导入校验</p>
                    </div>
                  ) : uploadStep !== 'DONE' ? (
                    <div className="p-16 border border-blue-100 bg-white rounded-xl flex flex-col items-center justify-center gap-4">
                       <Loader2 size={40} className="animate-spin text-blue-600" />
                       <div className="text-center space-y-2">
                         <p className="text-sm font-bold text-blue-800">正在与云端同步大区信息并校验...</p>
                         <div className="w-64 h-2 bg-gray-100 rounded-full overflow-hidden">
                           <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${progress}%` }}></div>
                         </div>
                       </div>
                    </div>
                  ) : (
                    <div className="space-y-4 animate-in slide-in-from-top-4 duration-400">
                      {/* 文件摘要与重新上传 */}
                      <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 border border-blue-100">
                            <FileText size={20} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900">{uploadedFileName}</p>
                            <div className="flex items-center gap-3 text-[11px] font-medium mt-1">
                              <span className="text-gray-500">总计: {devices.length} 台</span>
                              <span className="text-green-600 flex items-center gap-0.5"><CheckCircle2 size={12} /> 成功: {devices.filter(d => d.isValid).length}</span>
                              <span className="text-red-500 flex items-center gap-0.5"><XCircle size={12} /> 异常: {devices.filter(d => !d.isValid).length}</span>
                            </div>
                          </div>
                        </div>
                        <button 
                          onClick={handleReplaceFile}
                          className="flex items-center gap-2 px-4 py-2 border border-blue-200 rounded-lg text-xs font-bold text-blue-600 hover:bg-blue-50 transition-all bg-white"
                        >
                          <RefreshCcw size={14} /> 重新上传文件
                        </button>
                      </div>

                      {/* 直接在列表中展示详情 */}
                      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider">
                            <tr>
                              <th className="px-6 py-4">设备ID</th>
                              <th className="px-6 py-4">当前固件</th>
                              <th className="px-6 py-4">所属大区</th>
                              <th className="px-6 py-4">校验状态</th>
                              <th className="px-6 py-4">校验说明/原因</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {devices.map((d, i) => (
                              <tr key={i} className={`hover:bg-gray-50 transition-colors ${!d.isValid ? 'bg-red-50/20' : ''}`}>
                                <td className="px-6 py-4 font-mono font-medium text-gray-700">{d.id}</td>
                                <td className="px-6 py-4 text-gray-500">{d.currentVersion}</td>
                                <td className={`px-6 py-4 font-bold ${!d.isValid ? 'text-red-500' : 'text-gray-900'}`}>{d.currentRegion}</td>
                                <td className="px-6 py-4">
                                  {d.isValid ? (
                                    <span className="inline-flex items-center gap-1 text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded border border-green-100">
                                      <CheckCircle2 size={12} /> 成功
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded border border-red-100">
                                      <AlertCircle size={12} /> 异常
                                    </span>
                                  )}
                                </td>
                                <td className={`px-6 py-4 font-medium ${!d.isValid ? 'text-red-500' : 'text-gray-400'}`}>
                                  {d.errorReason}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <div className="p-3 bg-gray-50/50 border-t border-gray-100 text-right">
                          <p className="text-[10px] text-gray-400 font-bold">显示最近 100 条记录</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 3. 手动录入配置 */}
              {strategy === UpgradeStrategy.MANUAL && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm max-w-4xl">
                    <table className="w-full text-left text-xs">
                       <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold">
                          <tr>
                             <th className="px-6 py-4">设备ID</th>
                             <th className="px-6 py-4">源版本号</th>
                             <th className="px-6 py-4">所属大区</th>
                             <th className="px-6 py-4 text-right">操作</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-gray-100">
                         {manualDevices.map((d, i) => (
                           <tr key={i} className={d.id && !d.isValid ? 'bg-red-50/10' : ''}>
                             <td className="px-6 py-2">
                               <input 
                                 type="text" 
                                 placeholder="输入设备ID" 
                                 value={d.id}
                                 onChange={e => handleManualIdChange(i, e.target.value)}
                                 className="w-full px-3 py-2 border border-gray-100 rounded-lg bg-white outline-none focus:border-blue-500 font-mono"
                               />
                             </td>
                             <td className="px-6 py-2 text-gray-500 font-mono">{d.currentVersion}</td>
                             <td className={`px-6 py-2 font-bold ${d.id && !d.isValid ? 'text-red-500' : (d.id ? 'text-gray-900' : 'text-gray-300')}`}>
                                {d.currentRegion}
                             </td>
                             <td className="px-6 py-2 text-right">
                                {manualDevices.length > 1 && <button onClick={() => removeManualRow(i)} className="text-gray-400 hover:text-red-500 p-2"><Trash2 size={16} /></button>}
                             </td>
                           </tr>
                         ))}
                       </tbody>
                    </table>
                    <button onClick={addManualRow} className="w-full py-3 text-blue-600 text-xs font-bold hover:bg-blue-50 flex items-center justify-center gap-2 border-t border-gray-100 bg-white">
                      <Plus size={14} /> 添加一行
                    </button>
                  </div>
                </div>
              )}
            </div>

            <hr className="border-gray-100" />

            {/* 底部表单项 */}
            <div className="space-y-6 max-w-4xl pb-10">
               <div className="flex items-center gap-6">
                  <label className="w-32 text-sm font-medium text-gray-600 text-right">
                    <span className="text-red-500 mr-1">*</span>升级时间
                  </label>
                  <div className="flex-1 flex items-center gap-3">
                     <div className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white text-gray-400 flex items-center gap-2 hover:border-blue-500 cursor-pointer transition-all">
                        <Calendar size={14} /> <span>选择开始时间</span>
                     </div>
                     <span className="text-gray-300">~</span>
                     <div className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white text-gray-400 flex items-center gap-2 hover:border-blue-500 cursor-pointer transition-all">
                        <Calendar size={14} /> <span>选择结束时间</span>
                     </div>
                  </div>
               </div>

               <div className="flex items-start gap-6">
                  <label className="w-32 text-sm font-medium text-gray-600 text-right pt-2">升级说明</label>
                  <textarea 
                    placeholder="请输入升级详细描述信息（可选）"
                    rows={3}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-lg text-sm bg-white outline-none focus:border-blue-500 transition-all resize-none"
                  />
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* 底部固定操作栏 */}
      <div className="fixed bottom-0 left-64 right-0 bg-white border-t border-gray-200 px-10 py-4 flex items-center gap-4 z-40 shadow-lg">
        <button 
          onClick={handlePublish}
          className="px-8 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 shadow-md transition-all active:scale-95 flex items-center gap-2"
        >
          <Rocket size={18} /> 预览并发布
        </button>
        <button className="px-8 py-2.5 border border-gray-200 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50 flex items-center gap-2 bg-white transition-all">
          <Save size={18} /> 保存草稿
        </button>
        <div className="flex-1"></div>
        <button onClick={onCancel} className="px-6 py-2.5 text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors">
          取消
        </button>
      </div>

      {showPreCheck && (
        <PreCheckModal 
          devices={strategy === UpgradeStrategy.FILE ? devices : manualDevices.filter(d => d.id)}
          targetRegion={selectedRegion}
          onClose={() => setShowPreCheck(false)}
          onTidyAndPublish={() => {
            setShowPreCheck(false);
            finalizeTask();
          }}
        />
      )}
    </div>
  );
};
