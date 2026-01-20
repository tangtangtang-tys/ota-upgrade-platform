
export enum TaskStatus {
  DRAFT = '待发布',
  PUBLISHING = '发布中',
  COMPLETED = '已完成',
  FAILED = '已驳回',
  CANCELLED = '已失效'
}

export enum Region {
  HZ = '中国/杭州',
  BJ = '中国/北京',
  NA = '北美/弗吉尼亚',
  EU = '欧洲/法兰克福',
  CD = '中国/成都',
  GD = '中国/广东'
}

export enum PromptMethod {
  NONE = '不提醒',
  WEAK = '弱提醒',
  STRONG = '强提醒',
  MANDATORY = '强制提醒'
}

export enum UpgradeStrategy {
  VERSION = 'VERSION',
  FILE = 'FILE',
  MANUAL = 'MANUAL'
}

export interface Device {
  id: string;
  currentVersion: string;
  currentRegion: string;
  status: 'online' | 'offline';
  isValid?: boolean;
  errorReason?: string;
  upgradeStatus?: 'pending' | 'downloading' | 'installing' | 'success' | 'failed';
  finishTime?: string;
}

export interface VersionRow {
  sourceVersion: string;
  count: number;
}

export interface OTATask {
  id: string;
  name: string;
  targetVersion: string;
  region: Region;
  totalDevices: number;
  successRate: number;
  status: TaskStatus;
  createTime: string;
  strategy: UpgradeStrategy;
  description?: string;
}

export interface FirmwareVersion {
  id: string;
  versionNumber: string;
  downloadUrl: string;
  size: string;
  promptMethod: PromptMethod;
  description: string;
  updateTime: string;
  isLatest: boolean;
  status: 'published' | 'reviewing' | 'draft';
}

export interface FirmwareIdentifier {
  id: string;
  name: string;
  associatedModel: string;
  createTime: string;
}

export type ViewState = 'LIST' | 'CREATE' | 'FIRMWARE_MGT' | 'OTA_DETAIL' | 'LOGS' | 'SYSTEM';

export interface AuditLog {
  id: string;
  taskName: string;
  applicant: string;
  reviewer: string;
  result: 'PASS' | 'REJECT';
  comment: string;
  time: string;
}

export interface OperationLog {
  id: string;
  user: string;
  module: string;
  action: string;
  target: string;
  ip: string;
  time: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}
