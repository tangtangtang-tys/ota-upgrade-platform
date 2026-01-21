
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
  AlertCircle,
  HelpCircle
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
        // 模拟更真实的校验逻辑
        const mockDevices: Device[] = Array.from({ length: 15 }).map((_, i) => {
          // 模拟不同的异常情况
          let currentRegion = selectedRegion as string;
          let isValid = true;
          let errorReason = '校验通过';
          let currentVersion = '10.1.1.12';

          if (i === 2 || i === 5 || i === 8) {
             currentRegion = i === 2 ? '中国/成都' : '北美/弗吉尼亚';
             isValid = false;
             errorReason = `大区不匹配：该设备所属大区为 ${currentRegion}`;
          } else if (i === 10) {
             currentVersion = '9.0.0.1';
             isValid = false;
             errorReason = '版本不支持：源版本过低，不满足平滑升级要求';
          }

          return {
            id: `LAICAM-D-00${880 + i}`,
            currentVersion,
            currentRegion,
            status: 'online' as const,
            isValid,
            errorReason
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
    // 模拟手动输入后的后端实时校验
    if (val.length >= 10) {
      const isOk = index % 2 === 0;
      newList[index].currentRegion = isOk ? selectedRegion : '中国/成都集群';
      newList[index].isValid = isOk;
      newList[index].errorReason = isOk ? '校验通过' : '大区不匹配：该设备不属于当前任务大区';
    } else {
      newList[index].currentRegion = '-';
      newList[index].isValid = undefined;
      newList[index].errorReason = undefined;
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
    <div className="bg-[#F5F7FA] min-h-full pb-32">
      {/* Page Header */}
      <div className="h-14 bg-white border-b border-gray-200 flex items-center px-6 sticky top-0 z-30 shadow-sm">
        <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-full mr-4 text-gray-500 transition-colors">
          <ArrowLeft size={18} />
        </button>
        <div className="flex items-center gap-2">
           <span className="text-sm font-bold text-gray-800">新建升级任务</span>
           <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded border border-blue-100">Step 1/2</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 sm:p-8 space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 sm:p-10 space-y-10">
            {/* 1. 基础信息配置 */}
            <section className="space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-5 bg-blue-600 rounded-full"></div>
                <h3 className="font-bold text-gray-900">任务基础配置</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 max-w-5xl">
                {/* 任务大区 - 核心痛点解决：显式展示 */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-1.5">
                    <span className="text-red-500">*</span> 任务所属大区
                    <HelpCircle size={14} className="text-gray-300 cursor-help" />
                  </label>
                  <div className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold text-blue-700 flex items-center justify-between">
                    <span>{selectedRegion} 集群</span>
                    <span className="text-[10px] bg-blue-100 px-1.5 rounded">不可更改</span>
                  </div>
                </div>

                {/* 任务名称 */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">
                    <span className="text-red-500">*</span> 任务名称
                  </label>
                  <input 
                    type="text" 
                    placeholder="请输入任务名称，建议包含日期和版本" 
                    value={taskName}
                    onChange={e => setTaskName(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white outline-none focus:border-blue-500 transition-all"
                  />
                </div>

                {/* 目标版本 */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">
                    <span className="text-red-500">*</span> 目标固件版本
                  </label>
                  <input 
                    type="text" 
                    placeholder="输入要升级到的目标版本号" 
                    value={targetVersion}
                    onChange={e => setTargetVersion(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white outline-none focus:border-blue-500 transition-all font-mono font-bold text-blue-600"
                  />
                </div>

                {/* 升级时间 */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">
                    <span className="text-red-500">*</span> 升级执行时间段
                  </label>
                  <div className="flex items-center gap-2">
                     <div className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-xs sm:text-sm bg-white text-gray-400 flex items-center gap-2 hover:border-blue-500 cursor-pointer">
                        <Calendar size={14} /> <span className="truncate">开始时间</span>
                     </div>
                     <span className="text-gray-300">~</span>
                     <div className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-xs sm:text-sm bg-white text-gray-400 flex items-center gap-2 hover:border-blue-500 cursor-pointer">
                        <Calendar size={14} /> <span className="truncate">结束时间</span>
                     </div>
                  </div>
                </div>
              </div>

              {/* 升级策略切换 */}
              <div className="space-y-4">
                <label className="text-sm font-bold text-gray-700">
                  <span className="text-red-500">*</span> 选择升级范围策略
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-5xl">
                  {[
                    { id: UpgradeStrategy.VERSION, title: '指定版本筛选', desc: '按现有固件版本号查询' },
                    { id: UpgradeStrategy.FILE, title: '文件批量导入', desc: '上传 ID 列表并校验大区' },
                    { id: UpgradeStrategy.MANUAL, title: '手动精确录入', desc: '手动输入设备 ID 校验' }
                  ].map(s => (
                    <button
                      key={s.id}
                      onClick={() => setStrategy(s.id)}
                      className={`p-4 text-left rounded-xl border transition-all relative ${
                        strategy === s.id ? 'border-blue-600 bg-blue-50/20 ring-1 ring-blue-600 shadow-sm' : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/5'
                      }`}
                    >
                      <h4 className={`text-sm font-bold mb-1 ${strategy === s.id ? 'text-blue-700' : 'text-gray-900'}`}>{s.title}</h4>
                      <p className="text-[11px] text-gray-400 leading-tight">{s.desc}</p>
                      {strategy === s.id && <div className="absolute top-2 right-2 text-blue-600"><CheckCircle2 size={16} /></div>}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            <hr className="border-gray-100" />

            {/* 2. 动态内容区 - 支持响应式滚动 */}
            <div className="min-h-[420px]">
              {/* 指定版本号配置 */}
              {strategy === UpgradeStrategy.VERSION && (
                <div className="space-y-6 max-w-5xl animate-in fade-in duration-300">
                  <div className="flex items-center gap-4">
                     <span className="text-sm font-bold text-gray-700">升级方式:</span>
                     <select className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white outline-none focus:border-blue-500">
                        <option>批量升级 (指定数量)</option>
                        <option>全量升级 (该版本下所有设备)</option>
                     </select>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs min-w-[600px]">
                        <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase">
                          <tr>
                            <th className="px-6 py-4">源固件版本 (待升级版本)</th>
                            <th className="px-6 py-4">计划升级台数</th>
                            <th className="px-6 py-4 text-right">操作</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {versionRows.map((row, idx) => (
                            <tr key={idx} className="hover:bg-gray-50/50">
                              <td className="px-6 py-3">
                                <input type="text" placeholder="例如: 1.0.0" className="w-full px-4 py-2 border border-gray-100 rounded-lg bg-white outline-none focus:border-blue-500 transition-all font-mono" />
                              </td>
                              <td className="px-6 py-3">
                                <input type="number" defaultValue={99} className="w-24 px-4 py-2 border border-gray-100 rounded-lg bg-white outline-none focus:border-blue-500 transition-all font-bold" />
                              </td>
                              <td className="px-6 py-3 text-right">
                                {versionRows.length > 1 && <button onClick={() => removeVersionRow(idx)} className="text-gray-400 hover:text-red-500 p-2"><Trash2 size={16} /></button>}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <button onClick={addVersionRow} className="w-full py-4 text-blue-600 text-xs font-bold hover:bg-blue-50 flex items-center justify-center gap-2 border-t border-gray-100 transition-colors">
                      <Plus size={14} /> 继续添加待升级版本
                    </button>
                  </div>
                </div>
              )}

              {/* 文件导入升级配置 - 核心需求点实现 */}
              {strategy === UpgradeStrategy.FILE && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm font-bold text-gray-700">导入 ID 列表并自动校验大区/版本信息</p>
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-xs font-bold hover:bg-gray-50 bg-white shrink-0">
                      <Download size={14} /> 下载 CSV 模版
                    </button>
                  </div>

                  <input ref={fileInputRef} type="file" className="hidden" onChange={handleImport} accept=".csv" />

                  {uploadStep === 'IDLE' ? (
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-200 rounded-xl p-16 flex flex-col items-center justify-center bg-white hover:border-blue-400 hover:bg-blue-50/20 transition-all cursor-pointer group"
                    >
                      <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                        <Upload className="text-gray-400 group-hover:text-blue-600" size={28} />
                      </div>
                      <span className="text-sm font-bold text-gray-500 group-hover:text-blue-700">点击或将文件拖拽至此处上传</span>
                      <p className="text-xs text-gray-400 mt-2">支持 .csv 格式，单次最多支持 1000 台设备同步校验</p>
                    </div>
                  ) : uploadStep !== 'DONE' ? (
                    <div className="p-20 border border-blue-100 bg-white rounded-xl flex flex-col items-center justify-center gap-6">
                       <Loader2 size={48} className="animate-spin text-blue-600" />
                       <div className="text-center space-y-3">
                         <p className="text-sm font-bold text-blue-800 tracking-wide">正在同步云端大区与设备白名单信息...</p>
                         <div className="w-72 h-2 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                           <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${progress}%` }}></div>
                         </div>
                       </div>
                    </div>
                  ) : (
                    <div className="space-y-4 animate-in slide-in-from-top-4 duration-500">
                      {/* 上传摘要 - 核心需求：闭环交互替换文件 */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 border border-blue-100">
                            <FileText size={24} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900">{uploadedFileName}</p>
                            <div className="flex flex-wrap items-center gap-3 text-[11px] font-bold mt-1.5">
                              <span className="text-gray-500">共 {devices.length} 台</span>
                              <span className="text-green-600 px-2 py-0.5 bg-green-50 rounded border border-green-100">通过: {devices.filter(d => d.isValid).length}</span>
                              <span className="text-red-500 px-2 py-0.5 bg-red-50 rounded border border-red-100">异常: {devices.filter(d => !d.isValid).length}</span>
                            </div>
                          </div>
                        </div>
                        <button 
                          onClick={handleReplaceFile}
                          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 border border-blue-200 rounded-lg text-sm font-bold text-blue-600 hover:bg-blue-50 transition-all bg-white"
                        >
                          <RefreshCcw size={16} /> 重新上传/替换文件
                        </button>
                      </div>

                      {/* 导入列表展示 - 核心需求：展示校验状态及异常原因 */}
                      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs min-w-[800px]">
                            <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider">
                              <tr>
                                <th className="px-6 py-4">设备ID</th>
                                <th className="px-6 py-4">当前固件</th>
                                <th className="px-6 py-4">设备所属大区</th>
                                <th className="px-6 py-4">校验状态</th>
                                <th className="px-6 py-4">异常说明/处理建议</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              {devices.map((d, i) => (
                                <tr key={i} className={`hover:bg-gray-50/50 transition-colors ${!d.isValid ? 'bg-red-50/5' : ''}`}>
                                  <td className="px-6 py-4 font-mono font-bold text-gray-700">{d.id}</td>
                                  <td className="px-6 py-4 text-gray-500">{d.currentVersion}</td>
                                  <td className={`px-6 py-4 font-bold ${!d.isValid ? 'text-red-600' : 'text-gray-900'}`}>{d.currentRegion}</td>
                                  <td className="px-6 py-4">
                                    {d.isValid ? (
                                      <span className="inline-flex items-center gap-1.5 text-green-700 font-bold px-2 py-1">
                                        <CheckCircle2 size={14} /> 校验通过
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center gap-1.5 text-red-600 font-bold px-2 py-1">
                                        <AlertCircle size={14} /> 校验失败
                                      </span>
                                    )}
                                  </td>
                                  <td className={`px-6 py-4 font-medium ${!d.isValid ? 'text-red-500 italic' : 'text-gray-400'}`}>
                                    {d.errorReason}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
                          <p className="text-[10px] text-gray-400 font-bold">校验结果已根据大区亲和性策略自动排序，建议剔除大区不匹配设备后发布</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 手动录入配置 */}
              {strategy === UpgradeStrategy.MANUAL && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm max-w-5xl">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs min-w-[700px]">
                         <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold">
                            <tr>
                               <th className="px-6 py-4">设备ID (SN/DID)</th>
                               <th className="px-6 py-4">当前大区</th>
                               <th className="px-6 py-4">校验状态</th>
                               <th className="px-6 py-4 text-right">操作</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-gray-100">
                           {manualDevices.map((d, i) => (
                             <tr key={i} className={d.id && !d.isValid ? 'bg-red-50/5' : ''}>
                               <td className="px-6 py-3">
                                 <input 
                                   type="text" 
                                   placeholder="输入设备ID（至少10位）" 
                                   value={d.id}
                                   onChange={e => handleManualIdChange(i, e.target.value)}
                                   className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-white outline-none focus:border-blue-500 font-mono transition-all"
                                 />
                               </td>
                               <td className={`px-6 py-3 font-bold ${d.id && !d.isValid ? 'text-red-500' : (d.id ? 'text-gray-900' : 'text-gray-300')}`}>
                                  {d.currentRegion}
                               </td>
                               <td className="px-6 py-3">
                                  {d.id && d.isValid !== undefined && (
                                    <span className={`inline-flex items-center gap-1 font-bold ${d.isValid ? 'text-green-600' : 'text-red-500'}`}>
                                      {d.isValid ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                                      {d.isValid ? '合规' : '不匹配'}
                                    </span>
                                  )}
                               </td>
                               <td className="px-6 py-3 text-right">
                                  {manualDevices.length > 1 && <button onClick={() => removeManualRow(i)} className="text-gray-400 hover:text-red-500 p-2"><Trash2 size={16} /></button>}
                               </td>
                             </tr>
                           ))}
                         </tbody>
                      </table>
                    </div>
                    <button onClick={addManualRow} className="w-full py-4 text-blue-600 text-xs font-bold hover:bg-blue-50 flex items-center justify-center gap-2 border-t border-gray-100 bg-white transition-colors">
                      <Plus size={14} /> 继续录入设备
                    </button>
                  </div>
                </div>
              )}
            </div>

            <hr className="border-gray-100" />

            {/* 升级备注 */}
            <div className="space-y-4 max-w-5xl pb-10">
               <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                 任务备注与升级说明
                 <span className="text-[11px] font-normal text-gray-400">(可选，将同步至 APP 端提示)</span>
               </label>
               <textarea 
                  placeholder="例如：本次升级重点解决弱网环境下连接失败的问题，提升稳定性..."
                  rows={4}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-white outline-none focus:border-blue-500 transition-all resize-none shadow-sm"
                />
            </div>
          </div>
        </div>
      </div>

      {/* 底部固定操作栏 - 适配响应式侧边栏 */}
      <div className="fixed bottom-0 left-0 right-0 lg:left-auto lg:w-full bg-white border-t border-gray-200 px-6 sm:px-10 py-5 flex items-center gap-4 z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="flex-1 flex gap-3 max-w-6xl mx-auto items-center">
          <button 
            onClick={handlePublish}
            disabled={strategy === UpgradeStrategy.FILE && devices.length === 0}
            className="flex-1 sm:flex-none px-10 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Rocket size={18} /> 预览并立即发布
          </button>
          <button className="flex-1 sm:flex-none px-10 py-3 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-2 bg-white transition-all">
            <Save size={18} /> 存为草稿
          </button>
          <div className="hidden sm:block flex-1"></div>
          <button onClick={onCancel} className="hidden sm:block px-6 py-3 text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors">
            返回列表
          </button>
        </div>
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
