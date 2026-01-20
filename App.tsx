
import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { TaskList } from './components/TaskList';
import { CreateTask } from './components/CreateTask';
import { FirmwareManagement } from './components/FirmwareManagement';
import { OTAUpgradeDetail } from './components/OTAUpgradeDetail';
import { LogManagement } from './components/LogManagement';
import { SystemConfig } from './components/SystemConfig';
import { ViewState, OTATask, TaskStatus, Region, UpgradeStrategy } from './types';

const MOCK_TASKS: OTATask[] = [
  {
    id: 'OTA-20240516001',
    name: '1.0.0设备版本升级任务',
    targetVersion: '1.1.2',
    region: Region.HZ,
    totalDevices: 1200,
    successRate: 85,
    status: TaskStatus.COMPLETED,
    createTime: '2024-05-15 14:44:10',
    strategy: UpgradeStrategy.VERSION,
    description: '修复了已知稳定性问题，优化了网络连接'
  }
];

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('LIST');
  const [tasks, setTasks] = useState<OTATask[]>(MOCK_TASKS);
  const [selectedTask, setSelectedTask] = useState<OTATask | null>(null);

  const handleCreateTask = (newTask: OTATask) => {
    setTasks([newTask, ...tasks]);
    setView('LIST');
  };

  const handleViewDetail = (task: OTATask) => {
    setSelectedTask(task);
    setView('OTA_DETAIL');
  };

  return (
    <Layout currentView={view} setView={setView}>
      {view === 'LIST' && (
        <TaskList 
          tasks={tasks} 
          onCreateClick={() => setView('CREATE')} 
          onViewDetail={handleViewDetail}
        />
      )}
      {view === 'CREATE' && (
        <CreateTask 
          onCancel={() => setView('LIST')} 
          onSubmit={handleCreateTask}
        />
      )}
      {view === 'FIRMWARE_MGT' && (
        <FirmwareManagement />
      )}
      {view === 'OTA_DETAIL' && selectedTask && (
        <OTAUpgradeDetail 
          task={selectedTask} 
          onBack={() => setView('LIST')} 
        />
      )}
      {view === 'LOGS' && (
        <LogManagement />
      )}
      {view === 'SYSTEM' && (
        <SystemConfig />
      )}
    </Layout>
  );
};

export default App;
