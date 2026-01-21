
import React from 'react';
import { Search, Plus, Filter, MoreHorizontal } from 'lucide-react';
import { OTATask, TaskStatus } from '../types';

interface TaskListProps {
  tasks: OTATask[];
  onCreateClick: () => void;
  onViewDetail: (task: OTATask) => void;
}

const statusColors = {
  [TaskStatus.DRAFT]: 'bg-[#f4f4f5] text-[#909399] border-[#e9e9eb]',
  [TaskStatus.PUBLISHING]: 'bg-[#ecf5ff] text-[#409eff] border-[#d9ecff]',
  [TaskStatus.COMPLETED]: 'bg-[#f0f9eb] text-[#67c23a] border-[#e1f3d8]',
  [TaskStatus.FAILED]: 'bg-[#fef0f0] text-[#f56c6c] border-[#fde2e2]',
  [TaskStatus.CANCELLED]: 'bg-[#f4f4f5] text-[#c0c4cc] border-[#e9e9eb]',
};

export const TaskList: React.FC<TaskListProps> = ({ tasks, onCreateClick, onViewDetail }) => {
  return (
    <div className="p-6 space-y-6">
      {/* 搜索和筛选区域 */}
      <div className="bg-white p-5 rounded-lg border border-[#EBEEF5] shadow-sm flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-4 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#C0C4CC]" size={16} />
            <input 
              type="text" 
              placeholder="搜索任务名称、ID或版本号..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-[#DCDFE6] rounded text-sm focus:border-[#409EFF] outline-none transition-colors placeholder-[#C0C4CC]"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-[#DCDFE6] rounded text-sm text-[#606266] hover:text-[#409EFF] hover:border-[#C0C4CC] transition-colors bg-white">
            <Filter size={16} />
            <span>筛选条件</span>
          </button>
        </div>
        <button 
          onClick={onCreateClick}
          className="bg-[#409EFF] hover:bg-[#66b1ff] text-white px-6 py-2 rounded text-sm font-medium flex items-center gap-2 transition-all shadow-md active:transform active:scale-95"
        >
          <Plus size={18} />
          新建任务
        </button>
      </div>

      {/* 表格 */}
      <div className="bg-white rounded-lg border border-[#EBEEF5] shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#F5F7FA] border-b border-[#EBEEF5]">
            <tr>
              <th className="px-6 py-4 text-[13px] font-bold text-[#909399]">任务名称/ID</th>
              <th className="px-6 py-4 text-[13px] font-bold text-[#909399]">目标版本</th>
              <th className="px-6 py-4 text-[13px] font-bold text-[#909399]">所属大区</th>
              <th className="px-6 py-4 text-[13px] font-bold text-[#909399]">设备数</th>
              <th className="px-6 py-4 text-[13px] font-bold text-[#909399]">创建时间</th>
              <th className="px-6 py-4 text-[13px] font-bold text-[#909399]">状态</th>
              <th className="px-6 py-4 text-[13px] font-bold text-[#909399] text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EBEEF5]">
            {tasks.map((task) => (
              <tr key={task.id} className="hover:bg-[#F5F7FA] transition-colors group">
                <td className="px-6 py-4">
                  <div className="font-bold text-[#303133] text-[14px]">{task.name}</div>
                  <div className="text-[11px] text-[#909399] font-mono mt-0.5">{task.id}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-[12px] font-mono font-bold text-[#409EFF] bg-[#ECF5FF] px-2 py-0.5 rounded border border-[#D9ECFF]">
                    {task.targetVersion}
                  </span>
                </td>
                <td className="px-6 py-4 text-[13px] text-[#606266]">{task.region}</td>
                <td className="px-6 py-4 text-[13px] text-[#303133] font-medium">{task.totalDevices.toLocaleString()}</td>
                <td className="px-6 py-4 text-[12px] text-[#909399]">{task.createTime}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${statusColors[task.status]}`}>
                    {task.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-4">
                    <button 
                      onClick={() => onViewDetail(task)}
                      className="text-[#409EFF] hover:text-[#66b1ff] text-[13px] font-bold"
                    >
                      详情
                    </button>
                    <button className="text-[#C0C4CC] hover:text-[#909399] transition-colors">
                      <MoreHorizontal size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* 分页 */}
        <div className="px-6 py-4 bg-white border-t border-[#EBEEF5] flex items-center justify-between text-[13px] text-[#606266]">
          <span className="text-[#909399]">共 {tasks.length} 条记录</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-[#DCDFE6] rounded text-[#C0C4CC] hover:bg-[#F5F7FA] disabled:opacity-50">上一页</button>
            <button className="w-8 h-8 flex items-center justify-center bg-[#409EFF] text-white rounded font-bold">1</button>
            <button className="px-3 py-1 border border-[#DCDFE6] rounded text-[#606266] hover:bg-[#F5F7FA]">下一页</button>
          </div>
        </div>
      </div>
    </div>
  );
};
