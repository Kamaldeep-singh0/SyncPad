'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  Square, 
  Users, 
  Home, 
  Settings, 
  Search, 
  Plus, 
  MoreVertical,
  Clock,
  Eye,
  Edit3,
  Trash2,
  UserPlus,
  Activity,
  FolderOpen,
  Bell,
  ChevronRight,
  Globe,
  Lock,
  Calendar,
  TrendingUp,
  Zap,
  LucideIcon
} from 'lucide-react';

// Type definitions
type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
};

type Workspace = {
  id: string;
  name: string;
  description: string;
  members: number;
  documents: number;
  whiteboards: number;
  role: 'owner' | 'editor' | 'viewer';
  lastActivity: string;
  isPublic: boolean;
};

type Document = {
  id: string;
  title: string;
  workspace: string;
  lastModified: string;
  author: string;
  type: 'document' | 'whiteboard';
  collaborators: number;
};

type ActivityItem = {
  id: string;
  type: 'document_edit' | 'workspace_invite' | 'whiteboard_create' | 'document_comment';
  user: string;
  action: string;
  target: string;
  time: string;
};

type Stats = {
  totalDocuments: number;
  totalWhiteboards: number;
  totalWorkspaces: number;
  activeCollaborators: number;
  documentsThisWeek: number;
  whiteboardsThisWeek: number;
  collaborationTime: string;
  realtimeUsers: number;
};

type MockData = {
  user: User;
  workspaces: Workspace[];
  recentDocuments: Document[];
  activity: ActivityItem[];
  stats: Stats;
};

// Mock data based on your API structure
const mockData: MockData = {
  user: {
    id: '1',
    name: 'Alex Johnson',
    email: 'alex@company.com',
    avatar: 'AJ',
    role: 'owner'
  },
  workspaces: [
    {
      id: '1',
      name: 'Product Team',
      description: 'Main product development workspace',
      members: 12,
      documents: 24,
      whiteboards: 8,
      role: 'owner',
      lastActivity: '2 hours ago',
      isPublic: false
    },
    {
      id: '2',
      name: 'Marketing Campaign',
      description: 'Q1 2025 marketing materials',
      members: 6,
      documents: 15,
      whiteboards: 12,
      role: 'editor',
      lastActivity: '1 day ago',
      isPublic: true
    },
    {
      id: '3',
      name: 'Design System',
      description: 'Company-wide design standards',
      members: 8,
      documents: 32,
      whiteboards: 5,
      role: 'viewer',
      lastActivity: '3 days ago',
      isPublic: false
    }
  ],
  recentDocuments: [
    {
      id: '1',
      title: 'API Documentation',
      workspace: 'Product Team',
      lastModified: '2 hours ago',
      author: 'Alex Johnson',
      type: 'document',
      collaborators: 3
    },
    {
      id: '2',
      title: 'User Journey Map',
      workspace: 'Product Team',
      lastModified: '4 hours ago',
      author: 'Sarah Chen',
      type: 'whiteboard',
      collaborators: 5
    },
    {
      id: '3',
      title: 'Sprint Planning Notes',
      workspace: 'Product Team',
      lastModified: '1 day ago',
      author: 'Mike Wilson',
      type: 'document',
      collaborators: 8
    },
    {
      id: '4',
      title: 'Brand Guidelines',
      workspace: 'Marketing Campaign',
      lastModified: '2 days ago',
      author: 'Lisa Park',
      type: 'document',
      collaborators: 4
    }
  ],
  activity: [
    {
      id: '1',
      type: 'document_edit',
      user: 'Sarah Chen',
      action: 'edited',
      target: 'API Documentation',
      time: '5 minutes ago'
    },
    {
      id: '2',
      type: 'workspace_invite',
      user: 'Alex Johnson',
      action: 'invited',
      target: 'john@company.com to Product Team',
      time: '1 hour ago'
    },
    {
      id: '3',
      type: 'whiteboard_create',
      user: 'Mike Wilson',
      action: 'created',
      target: 'System Architecture Diagram',
      time: '3 hours ago'
    },
    {
      id: '4',
      type: 'document_comment',
      user: 'Lisa Park',
      action: 'commented on',
      target: 'Brand Guidelines',
      time: '5 hours ago'
    }
  ],
  stats: {
    totalDocuments: 71,
    totalWhiteboards: 25,
    totalWorkspaces: 3,
    activeCollaborators: 26,
    documentsThisWeek: 12,
    whiteboardsThisWeek: 6,
    collaborationTime: '24h 15m',
    realtimeUsers: 8
  }
};

type MenuItem = {
  id: string;
  label: string;
  icon: LucideIcon;
};

type SidebarProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

const Sidebar = ({ activeTab, setActiveTab }: SidebarProps) => {
  const menuItems: MenuItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'workspaces', label: 'Workspaces', icon: FolderOpen },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'whiteboards', label: 'Whiteboards', icon: Square },
    { id: 'activity', label: 'Activity', icon: Activity },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold">S</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">SyncPad</h2>
            <p className="text-sm text-gray-500">Dashboard</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                  activeTab === item.id
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
            {mockData.user.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{mockData.user.name}</p>
            <p className="text-xs text-gray-500 truncate">{mockData.user.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

type StatCardProps = {
  title: string;
  value: string | number;
  change?: string | number;
  icon: LucideIcon;
  color?: 'blue' | 'green' | 'purple' | 'orange';
};

const StatCard = ({ title, value, change, icon: Icon, color = 'blue' }: StatCardProps) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    orange: 'bg-orange-50 text-orange-600 border-orange-200'
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {change && (
            <p className="text-sm text-green-600 mt-1 flex items-center">
              <TrendingUp size={16} className="mr-1" />
              +{change} this week
            </p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${colorClasses[color]}`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
};

type WorkspaceCardProps = {
  workspace: Workspace;
};

const WorkspaceCard = ({ workspace }: WorkspaceCardProps) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all hover:border-blue-200">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{workspace.name}</h3>
            {workspace.isPublic ? (
              <Globe size={16} className="text-gray-400" />
            ) : (
              <Lock size={16} className="text-gray-400" />
            )}
          </div>
          <p className="text-gray-600 text-sm">{workspace.description}</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            workspace.role === 'owner' ? 'bg-green-100 text-green-700' :
            workspace.role === 'editor' ? 'bg-blue-100 text-blue-700' :
            'bg-gray-100 text-gray-700'
          }`}>
            {workspace.role}
          </span>
          <button className="p-1 hover:bg-gray-100 rounded">
            <MoreVertical size={16} className="text-gray-400" />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">{workspace.documents}</p>
          <p className="text-xs text-gray-500">Documents</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">{workspace.whiteboards}</p>
          <p className="text-xs text-gray-500">Whiteboards</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">{workspace.members}</p>
          <p className="text-xs text-gray-500">Members</p>
        </div>
      </div>
      
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-500">Last activity: {workspace.lastActivity}</span>
        <button className="text-blue-600 hover:text-blue-700 font-medium">
          Open workspace
        </button>
      </div>
    </div>
  );
};

type DocumentItemProps = {
  doc: Document;
};

const DocumentItem = ({ doc }: DocumentItemProps) => {
  const IconComponent = doc.type === 'document' ? FileText : Square;
  
  return (
    <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
      <div className="flex items-center space-x-4">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
          doc.type === 'document' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
        }`}>
          <IconComponent size={20} />
        </div>
        <div>
          <h4 className="font-medium text-gray-900">{doc.title}</h4>
          <p className="text-sm text-gray-500">{doc.workspace} • {doc.lastModified}</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Users size={16} className="text-gray-400" />
          <span className="text-sm text-gray-500">{doc.collaborators}</span>
        </div>
        <div className="flex items-center space-x-1">
          <button className="p-2 hover:bg-gray-100 rounded">
            <Eye size={16} className="text-gray-400" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded">
            <Edit3 size={16} className="text-gray-400" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded">
            <MoreVertical size={16} className="text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );
};

type ActivityItemProps = {
  activity: ActivityItem;
};

const ActivityItem = ({ activity }: ActivityItemProps) => {
  const getActivityIcon = (type: ActivityItem['type']): LucideIcon => {
    switch (type) {
      case 'document_edit': return Edit3;
      case 'workspace_invite': return UserPlus;
      case 'whiteboard_create': return Square;
      case 'document_comment': return FileText;
      default: return Activity;
    }
  };

  const Icon = getActivityIcon(activity.type);

  return (
    <div className="flex items-center space-x-4 p-4">
      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
        <Icon size={16} className="text-gray-600" />
      </div>
      <div className="flex-1">
        <p className="text-sm text-gray-900">
          <span className="font-medium">{activity.user}</span> {activity.action} <span className="font-medium">{activity.target}</span>
        </p>
        <p className="text-xs text-gray-500">{activity.time}</p>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-8">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Documents"
                value={mockData.stats.totalDocuments}
                change={mockData.stats.documentsThisWeek}
                icon={FileText}
                color="blue"
              />
              <StatCard
                title="Whiteboards"
                value={mockData.stats.totalWhiteboards}
                change={mockData.stats.whiteboardsThisWeek}
                icon={Square}
                color="purple"
              />
              <StatCard
                title="Active Users"
                value={mockData.stats.realtimeUsers}
                icon={Zap}
                color="green"
              />
              <StatCard
                title="Collaboration Time"
                value={mockData.stats.collaborationTime}
                icon={Clock}
                color="orange"
              />
            </div>

            {/* Recent Activity & Documents */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Documents</h3>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {mockData.recentDocuments.map((doc) => (
                      <DocumentItem key={doc.id} doc={doc} />
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                </div>
                <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                  {mockData.activity.map((activity) => (
                    <ActivityItem key={activity.id} activity={activity} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'workspaces':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Workspaces</h2>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2">
                <Plus size={20} />
                <span>New Workspace</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockData.workspaces.map((workspace) => (
                <WorkspaceCard key={workspace.id} workspace={workspace} />
              ))}
            </div>
          </div>
        );

      case 'documents':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Documents</h2>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2">
                <Plus size={20} />
                <span>New Document</span>
              </button>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="divide-y divide-gray-200">
                {mockData.recentDocuments.filter(doc => doc.type === 'document').map((doc) => (
                  <DocumentItem key={doc.id} doc={doc} />
                ))}
              </div>
            </div>
          </div>
        );

      case 'whiteboards':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Whiteboards</h2>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2">
                <Plus size={20} />
                <span>New Whiteboard</span>
              </button>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="divide-y divide-gray-200">
                {mockData.recentDocuments.filter(doc => doc.type === 'whiteboard').map((doc) => (
                  <DocumentItem key={doc.id} doc={doc} />
                ))}
              </div>
            </div>
          </div>
        );

      case 'activity':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Activity Feed</h2>
            
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="divide-y divide-gray-200">
                {mockData.activity.map((activity) => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))}
              </div>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input type="text" defaultValue={mockData.user.name} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" defaultValue={mockData.user.email} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferences</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Email notifications</span>
                    <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Real-time updates</span>
                    <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return <div>Tab not found</div>;
    }
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 flex flex-col">
       
        <header className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search documents, whiteboards..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-96 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-gray-100 rounded-lg relative">
                <Bell size={20} className="text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                {mockData.user.avatar}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;