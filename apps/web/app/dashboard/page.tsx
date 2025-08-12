'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  LucideIcon,
  LogOut,
  Loader2
} from 'lucide-react';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

// API Helper functions
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`);
  }

  return response.json();
};

// Type definitions
type User = {
  _id: string;
  firstName: string;
  lastName?: string;
  email: string;
  role?: string;
};

type Workspace = {
  _id: string;
  name: string;
  description: string;
  members: Array<{
    userId: string;
    role: 'Owner' | 'Editor' | 'Viewer';
  }>;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

type Document = {
  _id: string;
  title: string;
  content: string;
  workspace: string;
  createdBy: string;
  updatedAt: string;
  versions: Array<{
    content: string;
    createdBy: string;
    createdAt: string;
  }>;
};

type Whiteboard = {
  _id: string;
  title: string;
  workspace: string;
  createdBy: string;
  state: {
    elements: any[];
    appState: any;
    files: any[];
  };
  updatedAt: string;
};

type DashboardData = {
  user: User | null;
  workspaces: Workspace[];
  documents: Document[];
  whiteboards: Whiteboard[];
  stats: {
    totalDocuments: number;
    totalWhiteboards: number;
    totalWorkspaces: number;
    recentActivity: number;
  };
};

type MenuItem = {
  id: string;
  label: string;
  icon: LucideIcon;
};

type SidebarProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: User | null;
  onLogout: () => void;
};

const Sidebar = ({ activeTab, setActiveTab, user, onLogout }: SidebarProps) => {
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
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
              {user?.firstName?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"
            title="Logout"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

type StatCardProps = {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color?: 'blue' | 'green' | 'purple' | 'orange';
  loading?: boolean;
};

const StatCard = ({ title, value, icon: Icon, color = 'blue', loading }: StatCardProps) => {
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
          {loading ? (
            <div className="flex items-center mt-2">
              <Loader2 size={20} className="animate-spin text-gray-400" />
            </div>
          ) : (
            <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
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
  onOpen: (workspaceId: string) => void;
  currentUserId: string;
};

const WorkspaceCard = ({ workspace, onOpen, currentUserId }: WorkspaceCardProps) => {
  const userRole = workspace.members.find(m => m.userId === currentUserId)?.role || 'Viewer';
  const isOwner = workspace.createdBy === currentUserId;

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all hover:border-blue-200">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{workspace.name}</h3>
            <Lock size={16} className="text-gray-400" />
          </div>
          <p className="text-gray-600 text-sm">{workspace.description}</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            isOwner ? 'bg-green-100 text-green-700' :
            userRole === 'Editor' ? 'bg-blue-100 text-blue-700' :
            'bg-gray-100 text-gray-700'
          }`}>
            {userRole}
          </span>
          <button className="p-1 hover:bg-gray-100 rounded">
            <MoreVertical size={16} className="text-gray-400" />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">{workspace.members.length}</p>
          <p className="text-xs text-gray-500">Members</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500">Created</p>
          <p className="text-sm font-medium text-gray-900">
            {new Date(workspace.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
      
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-500">
          Updated: {new Date(workspace.updatedAt).toLocaleDateString()}
        </span>
        <button 
          onClick={() => onOpen(workspace._id)}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          Open workspace
        </button>
      </div>
    </div>
  );
};

type DocumentItemProps = {
  doc: Document;
  workspaceName?: string;
  onEdit: (docId: string) => void;
};

const DocumentItem = ({ doc, workspaceName, onEdit }: DocumentItemProps) => {
  return (
    <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-blue-50 text-blue-600">
          <FileText size={20} />
        </div>
        <div>
          <h4 className="font-medium text-gray-900">{doc.title}</h4>
          <p className="text-sm text-gray-500">
            {workspaceName} • {new Date(doc.updatedAt).toLocaleDateString()}
          </p>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">{doc.versions.length} versions</span>
        </div>
        <div className="flex items-center space-x-1">
          <button className="p-2 hover:bg-gray-100 rounded">
            <Eye size={16} className="text-gray-400" />
          </button>
          <button 
            onClick={() => onEdit(doc._id)}
            className="p-2 hover:bg-gray-100 rounded"
          >
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

type WhiteboardItemProps = {
  whiteboard: Whiteboard;
  workspaceName?: string;
  onEdit: (whiteboardId: string) => void;
};

const WhiteboardItem = ({ whiteboard, workspaceName, onEdit }: WhiteboardItemProps) => {
  return (
    <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-purple-50 text-purple-600">
          <Square size={20} />
        </div>
        <div>
          <h4 className="font-medium text-gray-900">{whiteboard.title}</h4>
          <p className="text-sm text-gray-500">
            {workspaceName} • {new Date(whiteboard.updatedAt).toLocaleDateString()}
          </p>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">{whiteboard.state.elements.length} elements</span>
        </div>
        <div className="flex items-center space-x-1">
          <button className="p-2 hover:bg-gray-100 rounded">
            <Eye size={16} className="text-gray-400" />
          </button>
          <button 
            onClick={() => onEdit(whiteboard._id)}
            className="p-2 hover:bg-gray-100 rounded"
          >
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

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    user: null,
    workspaces: [],
    documents: [],
    whiteboards: [],
    stats: {
      totalDocuments: 0,
      totalWhiteboards: 0,
      totalWorkspaces: 0,
      recentActivity: 0
    }
  });
  
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [newWorkspaceDescription, setNewWorkspaceDescription] = useState('');
  const [showCreateWorkspace, setShowCreateWorkspace] = useState(false);
  const [showCreateDocument, setShowCreateDocument] = useState(false);
  const [showCreateWhiteboard, setShowCreateWhiteboard] = useState(false);
  const [newDocumentTitle, setNewDocumentTitle] = useState('');
  const [newWhiteboardTitle, setNewWhiteboardTitle] = useState('');
  const [selectedWorkspace, setSelectedWorkspace] = useState('');

  const router = useRouter();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Get user data from localStorage
      const userData = localStorage.getItem('user');
      const user = userData ? JSON.parse(userData) : null;

      // Load workspaces
      const workspacesResponse = await apiCall('/api/workspaces');
      const workspaces = workspacesResponse.workspaces || [];

      // Load documents and whiteboards for each workspace
      let allDocuments: Document[] = [];
      let allWhiteboards: Whiteboard[] = [];

      for (const workspace of workspaces) {
        try {
          // Note: You'll need to create endpoints to get documents by workspace
          // For now, we'll use placeholder data
        } catch (error) {
          console.error(`Error loading data for workspace ${workspace._id}:`, error);
        }
      }

      setDashboardData({
        user,
        workspaces,
        documents: allDocuments,
        whiteboards: allWhiteboards,
        stats: {
          totalDocuments: allDocuments.length,
          totalWhiteboards: allWhiteboards.length,
          totalWorkspaces: workspaces.length,
          recentActivity: 0
        }
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWorkspace = async () => {
    try {
      await apiCall('/api/workspace', {
        method: 'POST',
        body: JSON.stringify({
          name: newWorkspaceName,
          description: newWorkspaceDescription
        })
      });
      
      setNewWorkspaceName('');
      setNewWorkspaceDescription('');
      setShowCreateWorkspace(false);
      loadDashboardData();
    } catch (error) {
      console.error('Error creating workspace:', error);
      alert('Failed to create workspace');
    }
  };

  const handleCreateDocument = async () => {
    try {
      await apiCall('/api/documents', {
        method: 'POST',
        body: JSON.stringify({
          title: newDocumentTitle,
          workspaceId: selectedWorkspace
        })
      });
      
      setNewDocumentTitle('');
      setSelectedWorkspace('');
      setShowCreateDocument(false);
      loadDashboardData();
    } catch (error) {
      console.error('Error creating document:', error);
      alert('Failed to create document');
    }
  };

  const handleCreateWhiteboard = async () => {
    try {
      await apiCall('/api/whiteboards', {
        method: 'POST',
        body: JSON.stringify({
          title: newWhiteboardTitle,
          workspaceId: selectedWorkspace
        })
      });
      
      setNewWhiteboardTitle('');
      setSelectedWorkspace('');
      setShowCreateWhiteboard(false);
      loadDashboardData();
    } catch (error) {
      console.error('Error creating whiteboard:', error);
      alert('Failed to create whiteboard');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/auth');
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <Loader2 size={32} className="animate-spin text-gray-400" />
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-8">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Documents"
                value={dashboardData.stats.totalDocuments}
                icon={FileText}
                color="blue"
              />
              <StatCard
                title="Whiteboards"
                value={dashboardData.stats.totalWhiteboards}
                icon={Square}
                color="purple"
              />
              <StatCard
                title="Workspaces"
                value={dashboardData.stats.totalWorkspaces}
                icon={FolderOpen}
                color="green"
              />
              <StatCard
                title="Recent Activity"
                value={dashboardData.stats.recentActivity}
                icon={Activity}
                color="orange"
              />
            </div>

            {/* Recent Documents */}
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Recent Documents</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {dashboardData.documents.slice(0, 5).map((doc) => {
                  const workspace = dashboardData.workspaces.find(w => w._id === doc.workspace);
                  return (
                    <DocumentItem 
                      key={doc._id} 
                      doc={doc} 
                      workspaceName={workspace?.name}
                      onEdit={(docId) => router.push(`/document/${docId}`)}
                    />
                  );
                })}
                {dashboardData.documents.length === 0 && (
                  <div className="p-8 text-center text-gray-500">
                    No documents yet. Create your first document!
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'workspaces':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Workspaces</h2>
              <button 
                onClick={() => setShowCreateWorkspace(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2"
              >
                <Plus size={20} />
                <span>New Workspace</span>
              </button>
            </div>
            
            {showCreateWorkspace && (
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold mb-4">Create New Workspace</h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Workspace name"
                    value={newWorkspaceName}
                    onChange={(e) => setNewWorkspaceName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <textarea
                    placeholder="Workspace description"
                    value={newWorkspaceDescription}
                    onChange={(e) => setNewWorkspaceDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    rows={3}
                  />
                  <div className="flex space-x-3">
                    <button
                      onClick={handleCreateWorkspace}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                    >
                      Create
                    </button>
                    <button
                      onClick={() => setShowCreateWorkspace(false)}
                      className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dashboardData.workspaces.map((workspace) => (
                <WorkspaceCard 
                  key={workspace._id} 
                  workspace={workspace} 
                  currentUserId={dashboardData.user?._id || ''}
                  onOpen={(workspaceId) => router.push(`/workspace/${workspaceId}`)}
                />
              ))}
            </div>
          </div>
        );

      case 'documents':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Documents</h2>
              <button 
                onClick={() => setShowCreateDocument(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2"
              >
                <Plus size={20} />
                <span>New Document</span>
              </button>
            </div>
            
            {showCreateDocument && (
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold mb-4">Create New Document</h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Document title"
                    value={newDocumentTitle}
                    onChange={(e) => setNewDocumentTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <select
                    value={selectedWorkspace}
                    onChange={(e) => setSelectedWorkspace(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Select a workspace</option>
                    {dashboardData.workspaces.map(workspace => (
                      <option key={workspace._id} value={workspace._id}>
                        {workspace.name}
                      </option>
                    ))}
                  </select>
                  <div className="flex space-x-3">
                    <button
                      onClick={handleCreateDocument}
                      disabled={!newDocumentTitle || !selectedWorkspace}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                    >
                      Create
                    </button>
                    <button
                      onClick={() => setShowCreateDocument(false)}
                      className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="divide-y divide-gray-200">
                {dashboardData.documents.map((doc) => {
                  const workspace = dashboardData.workspaces.find(w => w._id === doc.workspace);
                  return (
                    <DocumentItem 
                      key={doc._id} 
                      doc={doc} 
                      workspaceName={workspace?.name}
                      onEdit={(docId) => router.push(`/document/${docId}`)}
                    />
                  );
                })}
                {dashboardData.documents.length === 0 && (
                  <div className="p-8 text-center text-gray-500">
                    No documents yet. Create your first document!
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'whiteboards':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Whiteboards</h2>
              <button 
                onClick={() => setShowCreateWhiteboard(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2"
              >
                <Plus size={20} />
                <span>New Whiteboard</span>
              </button>
            </div>
            
            {showCreateWhiteboard && (
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold mb-4">Create New Whiteboard</h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Whiteboard title"
                    value={newWhiteboardTitle}
                    onChange={(e) => setNewWhiteboardTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <select
                    value={selectedWorkspace}
                    onChange={(e) => setSelectedWorkspace(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Select a workspace</option>
                    {dashboardData.workspaces.map(workspace => (
                      <option key={workspace._id} value={workspace._id}>
                        {workspace.name}
                      </option>
                    ))}
                  </select>
                  <div className="flex space-x-3">
                    <button
                      onClick={handleCreateWhiteboard}
                      disabled={!newWhiteboardTitle || !selectedWorkspace}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                    >
                      Create
                    </button>
                    <button
                      onClick={() => setShowCreateWhiteboard(false)}
                      className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="divide-y divide-gray-200">
                {dashboardData.whiteboards.map((whiteboard) => {
                  const workspace = dashboardData.workspaces.find(w => w._id === whiteboard.workspace);
                  return (
                    <WhiteboardItem 
                      key={whiteboard._id} 
                      whiteboard={whiteboard} 
                      workspaceName={workspace?.name}
                      onEdit={(whiteboardId) => router.push(`/whiteboard/${whiteboardId}`)}
                    />
                  );
                })}
                {dashboardData.whiteboards.length === 0 && (
                  <div className="p-8 text-center text-gray-500">
                    No whiteboards yet. Create your first whiteboard!
                  </div>
                )}
              </div>
            </div>
          </div>