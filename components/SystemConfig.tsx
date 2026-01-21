
import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Plus, 
  Trash2, 
  Settings2,
  Lock,
  Check,
  ChevronRight
} from 'lucide-react';
import { Role } from '../types';

const PERMISSION_GROUPS = [
  {
    name: '固件发布模块',
    items: ['FIRMWARE_VIEW', 'FIRMWARE_EDIT', 'FIRMWARE_PUBLISH', 'FIRMWARE_DELETE']
  },
  {
    name: 'OTA升级任务',
    items: ['OTA_TASK_VIEW', 'OTA_TASK_CREATE', 'OTA_TASK_APPROVE', 'OTA_TASK_CANCEL']
  },
  {
    name: '系统日志',
    items: ['LOG_VIEW', 'LOG_EXPORT']
  },
  {
    name: '系统管理',
    items: ['USER_MGT', 'ROLE_MGT', 'SYS_CONFIG']
  }
];

const MOCK_ROLES: Role[] = [
  { id: 'R1', name: '超级管理员', description: '拥有系统最高管理权限', permissions: ['ALL'] },
  { id: 'R2', name: '运维工程师', description: '负责固件上传与常规任务创建', permissions: ['FIRMWARE_VIEW', 'FIRMWARE_EDIT', 'OTA_TASK_VIEW', 'OTA_TASK_CREATE'] },
  { id: 'R3', name: '安全审批官', description: '负责发布任务的安全审计', permissions: ['OTA_TASK_VIEW', 'OTA_TASK_APPROVE', 'LOG_VIEW'] },
];

export const SystemConfig: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<Role>(MOCK_ROLES[0]);

  const hasPermission = (perm: string) => {
    return selectedRole.permissions.includes('ALL') || selectedRole.permissions.includes(perm);
  };

  const translatePerm = (perm: string) => {
    const dict: Record<string, string> = {
      'FIRMWARE_VIEW': '固件查看',
      'FIRMWARE_EDIT': '固件编辑',
      'FIRMWARE_PUBLISH': '固件发布',
      'FIRMWARE_DELETE': '固件删除',
      'OTA_TASK_VIEW': '任务查看',
      'OTA_TASK_CREATE': '任务新建',
      'OTA_TASK_APPROVE': '任务审批',
      'OTA_TASK_CANCEL': '任务取消',
      'LOG_VIEW': '日志查看',
      'LOG_EXPORT': '日志导出',
      'USER_MGT': '用户管理',
      'ROLE_MGT': '角色管理',
      'SYS_CONFIG': '系统参数',
      'ALL': '全部权限'
    };
    return dict[perm] || perm;
  };

  return (
    <div className="flex h-full bg-white">
      {/* 角色侧边栏 */}
      <div className="w-80 border-r border-gray-200 bg-gray-50/30 flex flex-col p-6 space-y-6">
        <div className="flex items-center justify-between">
           <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <ShieldCheck size={18} className="text-blue-600" /> 系统角色
           </h3>
           <button className="p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md active:scale-95">
              <Plus size={16} />
           </button>
        </div>

        <div className="space-y-2">
           {MOCK_ROLES.map((role) => (
             <button 
               key={role.id}
               onClick={() => setSelectedRole(role)}
               className={`w-full text-left p-4 rounded-xl border transition-all group ${
                 selectedRole.id === role.id 
                  ? 'bg-blue-600 border-blue-600 text-white shadow-lg' 
                  : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300'
               }`}
             >
               <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm">{role.name}</span>
                  <ChevronRight size={14} className={selectedRole.id === role.id ? 'text-white' : 'text-gray-300'} />
               </div>
               <p className={`text-[11px] ${selectedRole.id === role.id ? 'text-blue-100' : 'text-gray-400'}`}>
                 {role.description}
               </p>
             </button>
           ))}
        </div>
      </div>

      {/* 权限矩阵 */}
      <div className="flex-1 flex flex-col overflow-hidden bg-white">
        <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-900">权限配置：{selectedRole.name}</h2>
            <p className="text-sm text-gray-500 mt-1">管理该角色在系统中的具体操作权限</p>
          </div>
          <button className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-black hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all">
             保存修改
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8">
           {PERMISSION_GROUPS.map((group) => (
             <div key={group.name} className="space-y-4">
                <div className="flex items-center gap-3">
                   <div className="w-1.5 h-4 bg-blue-600 rounded-full"></div>
                   <h4 className="font-bold text-gray-800 text-sm uppercase tracking-wide">{group.name}</h4>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   {group.items.map((item) => (
                     <div 
                       key={item} 
                       className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                         hasPermission(item) ? 'bg-blue-50/50 border-blue-100' : 'bg-gray-50 border-gray-100 opacity-60'
                       }`}
                     >
                        <div className="flex items-center gap-3">
                           <div className={`p-2 rounded-lg ${hasPermission(item) ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-400'}`}>
                              {hasPermission(item) ? <Check size={16} /> : <Lock size={16} />}
                           </div>
                           <span className={`text-sm font-medium ${hasPermission(item) ? 'text-blue-900' : 'text-gray-500'}`}>
                              {translatePerm(item)}
                           </span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                           <input type="checkbox" checked={hasPermission(item)} className="sr-only peer" readOnly />
                           <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                     </div>
                   ))}
                </div>
             </div>
           ))}
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50/30 flex justify-between items-center">
           <div className="flex items-center gap-2 text-xs text-gray-500">
              <Settings2 size={14} />
              <span>最后更新：2024-05-18 由 Admin</span>
           </div>
           {selectedRole.id !== 'R1' && (
             <button className="flex items-center gap-2 text-sm font-bold text-red-500 hover:text-red-600 transition-colors">
                <Trash2 size={16} /> 删除角色
             </button>
           )}
        </div>
      </div>
    </div>
  );
};
