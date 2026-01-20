
import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Download,
  Search,
  Filter,
  BarChart3,
  Info,
  Calendar
} from 'lucide-react';
import { OTATask, Device, TaskStatus } from '../types';

interface OTAUpgradeDetailProps {
  task: OTATask;
  onBack: () => void;
}

const MOCK_DEVICE_RESULTS: Device[] = Array.from({ length: 15 }).map((_, i) => ({
  id: `DEV-${1000 + i}`,
  currentVersion: '1.0.0',
  currentRegion: i % 3 === 0 ? '中国/北京' : '中国/杭州',
  status: 'online',
  upgradeStatus: i % 10 === 0 ? 'failed' : i % 5 === 0 ? 'installing' : 'success',
  errorReason: i % 10 === 0 ? '下载超时' : '',
  finishTime: i % 10 !== 0 ? '2024-05-16 10:20:11' : '-'
}));

export const OTAUpgradeDetail: React.FC<OTAUpgradeDetailProps> = ({ task, onBack }) => {
  const [activeTab, setActiveTab] = useState<'INFO' | 'RESULTS'>('INFO');

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-white rounded-full transition-colors text-gray-500 border border-transparent hover:border-gray-200">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{task.name}</h1>
            <p className="text-sm text-gray-500">任务ID: {task.id}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2">
            <Download size={16} /> 导出结果
          </button>
          {task.status !== TaskStatus.COMPLETED && (
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2">
              <RotateCcw size={16} /> 任务重试
            </button>
          )}
        </div>
      </div>

      {/* 标签页 */}
      <div className="flex border-b border-gray-200">
        <button 
          onClick={() => setActiveTab('INFO')}
          className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
            activeTab === 'INFO' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          任务详情
        </button>
        <button 
          onClick={() => setActiveTab('RESULTS')}
          className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
            activeTab === 'RESULTS' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          升级结果
        </button>
      </div>

      {activeTab === 'INFO' ? (
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <Info size={18} className="text-blue-500" /> 基本信息
              </h3>
              <div className="grid grid-cols-2 gap-y-4 text-sm">
                <div className="space-y-1">
                  <p className="text-gray-400">所属大区</p>
                  <p className="text-gray-900 font-medium">{task.region}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-gray-400">目标版本</p>
                  <p className="text-blue-600 font-mono font-bold">{task.targetVersion}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-gray-400">升级策略</p>
                  <p className="text-gray-900 font-medium">{task.strategy === 'VERSION' ? '指定版本号升级' : task.strategy === 'FILE' ? '文件导入升级' : '手动导入升级'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-gray-400">创建时间</p>
                  <p className="text-gray-900 font-medium">{task.createTime}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <Calendar size={18} className="text-blue-500" /> 升级说明
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-100 italic">
                {task.description || '暂无详细说明'}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <BarChart3 size={18} className="text-blue-500" /> 升级统计
              </h3>
              <div className="flex flex-col items-center justify-center py-4">
                 <div className="relative w-32 h-32">
                    <svg className="w-full h-full" viewBox="0 0 36 36">
                      <path className="text-gray-100" strokeDasharray="100, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                      <path className="text-green-500" strokeDasharray={`${task.successRate}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                       <span className="text-2xl font-black text-gray-900">{task.successRate}%</span>
                       <span className="text-[10px] text-gray-400 font-bold">成功率</span>
                    </div>
                 </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                   <div className="flex items-center gap-2 text-gray-500"><span className="w-2 h-2 rounded-full bg-green-500"></span> 升级成功</div>
                   <span className="font-bold text-gray-900">{Math.floor(task.totalDevices * (task.successRate / 100))} 台</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                   <div className="flex items-center gap-2 text-gray-500"><span className="w-2 h-2 rounded-full bg-red-500"></span> 升级失败</div>
                   <span className="font-bold text-gray-900">{Math.ceil(task.totalDevices * (1 - task.successRate / 100))} 台</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* 结果筛选 */}
          <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex gap-4">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input type="text" placeholder="搜索设备ID..." className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
              </div>
              <select className="border border-gray-200 rounded-lg px-4 py-2 text-sm bg-white outline-none focus:border-blue-500 transition-colors">
                <option>全部大区</option>
                <option>中国/北京</option>
                <option>中国/杭州</option>
              </select>
              <select className="border border-gray-200 rounded-lg px-4 py-2 text-sm bg-white outline-none focus:border-blue-500 transition-colors">
                <option>所有状态</option>
                <option>升级成功</option>
                <option>正在升级</option>
                <option>升级失败</option>
              </select>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
              <Filter size={16} className="text-gray-500" />
              <span className="text-sm text-gray-600 font-medium">重置</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">设备ID</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">所属大区</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-center">状态</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">失败原因</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">完成时间</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {MOCK_DEVICE_RESULTS.map((device) => (
                  <tr key={device.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{device.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{device.currentRegion}</td>
                    <td className="px-6 py-4 text-center">
                      {device.upgradeStatus === 'success' && <span className="flex items-center justify-center gap-1.5 text-green-600 font-bold text-xs"><CheckCircle2 size={14} /> 成功</span>}
                      {device.upgradeStatus === 'failed' && <span className="flex items-center justify-center gap-1.5 text-red-600 font-bold text-xs"><XCircle size={14} /> 失败</span>}
                      {device.upgradeStatus === 'installing' && <span className="flex items-center justify-center gap-1.5 text-blue-600 font-bold text-xs"><Clock size={14} /> 升级中</span>}
                    </td>
                    <td className="px-6 py-4 text-sm text-red-500 font-medium">{device.errorReason || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{device.finishTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
