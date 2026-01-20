
import React from 'react';
import { 
  LayoutDashboard, 
  Settings, 
  FileText, 
  Package,
  Bell, 
  LogOut,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { ViewState } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, setView }) => {
  const menuItems = [
    { id: '固件发布', icon: <Package size={18} />, view: 'FIRMWARE_MGT' as ViewState },
    { id: 'OTA升级', icon: <FileText size={18} />, view: 'LIST' as ViewState },
    { id: '日志管理', icon: <LayoutDashboard size={18} />, view: 'LOGS' as ViewState },
    { id: '系统配置', icon: <ShieldCheck size={18} />, view: 'SYSTEM' as ViewState },
  ];

  const getViewTitle = () => {
    switch(currentView) {
      case 'LIST': return 'OTA 任务列表';
      case 'FIRMWARE_MGT': return '固件发布平台';
      case 'CREATE': return '新建升级任务';
      case 'OTA_DETAIL': return '任务详情与结果';
      case 'LOGS': return '系统日志中心';
      case 'SYSTEM': return '权限与角色配置';
      default: return 'OTA 管理平台';
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#F5F7FA]">
      {/* Sidebar - 亮白简约风格 */}
      <aside className="w-64 bg-white flex flex-col border-r border-[#DCDFE6] z-20">
        <div className="h-16 flex items-center gap-3 px-6 border-b border-[#F0F2F5]">
          <div className="w-8 h-8 bg-[#409EFF] rounded-lg flex items-center justify-center text-white font-black shadow-md shadow-blue-100">
            OTA
          </div>
          <span className="text-lg font-bold text-[#303133] tracking-tight">管理后台</span>
        </div>
        
        <nav className="flex-1 py-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = currentView === item.view || (item.view === 'LIST' && currentView === 'OTA_DETAIL');
            return (
              <button
                key={item.id}
                onClick={() => setView(item.view)}
                className={`w-full flex items-center justify-between px-6 py-4 text-sm transition-all group relative ${
                  isActive 
                    ? 'text-[#409EFF] bg-[#ECF5FF] font-semibold' 
                    : 'text-[#606266] hover:text-[#409EFF] hover:bg-[#F5F7FA]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-[#409EFF]' : 'text-[#909399] group-hover:text-[#409EFF]'}>
                    {item.icon}
                  </span>
                  {item.id}
                </div>
                {isActive && <div className="absolute right-0 top-0 bottom-0 w-1 bg-[#409EFF]"></div>}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#F0F2F5]">
          <button className="w-full flex items-center gap-3 px-6 py-3 text-sm font-medium text-[#F56C6C] hover:bg-[#FEF0F0] transition-colors rounded-lg">
            <LogOut size={18} />
            退出登录
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header - 纯净白色 */}
        <header className="h-16 bg-white border-b border-[#DCDFE6] flex items-center justify-between px-8 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <h2 className="text-[15px] font-bold text-[#303133]">{getViewTitle()}</h2>
          </div>
          <div className="flex items-center gap-6">
            <button className="text-[#909399] hover:text-[#409EFF] relative transition-colors">
              <Bell size={18} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#F56C6C] text-white text-[9px] flex items-center justify-center rounded-full border border-white">2</span>
            </button>
            <div className="h-6 w-px bg-[#E4E7ED]"></div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-[13px] font-bold text-[#303133]">系统管理员</p>
                <p className="text-[11px] text-[#909399]">Admin</p>
              </div>
              <div className="w-10 h-10 rounded-full border border-[#E4E7ED] bg-[#F5F7FA] overflow-hidden">
                <img 
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin&backgroundColor=b6e3f4" 
                  alt="Avatar" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
