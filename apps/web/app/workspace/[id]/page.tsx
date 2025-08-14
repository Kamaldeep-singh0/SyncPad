'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  ArrowLeft, 
  Plus, 
  FileText, 
  Square, 
  Users, 
  Settings,
  MoreVertical,
  Loader2,
  AlertCircle,
  Edit3,
  Eye,
  Trash2,
  UserPlus
} from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

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
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API call failed: ${response.statusText}`);
  }

  return response.json();
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
};

type Whiteboard = {
  _id: string;
  title: string;
  workspace: string;
  createdBy: string;
  updatedAt: string;
};

const WorkspacePage = () => {
  const router = useRouter();
  const params = useParams();
  const workspaceId = params.id as string;

  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [whiteboards, setWhiteboards] = useState<Whiteboard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'documents' | 'whiteboards' | 'members'>('documents');
  
  const [showCreateDocument, setShowCreateDocument] = useState(false);
  const [showCreateWhiteboard, setShowCreateWhiteboard] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [newDocumentTitle, setNewDocumentTitle] = useState('');
  const [newWhiteboardTitle, setNewWhiteboardTitle] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'Editor' | 'Viewer'>('Viewer');

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth');
      return;
    }
    
    loadWorkspaceData();
  }, [workspaceId, router]);

  const loadWorkspaceData = async () => {
    try {
      setLoading(true);
      
      // Load workspace details
      const workspacesResponse = await apiCall('/api/workspaces');
      const workspace = workspacesResponse.workspaces?.find((w: Workspace) => w._id === workspaceId);
      
      if (!workspace) {
        throw new Error('Workspace not found');
      }
      
      setWorkspace(workspace);
      
      // For now, we'll use empty arrays for documents and whiteboards
      // You can implement workspace-specific endpoints later
      setDocuments([]);
      setWhiteboards([]);
      
    } catch (error) {
      console.error('Error loading workspace:', error);
      setError(error instanceof Error ? error.message : 'Failed to load workspace');
      
      if (error instanceof Error && error.message.includes('401')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/auth');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDocument = async () => {
    if (!newDocumentTitle.trim()) return;
    
    try {
      const response = await apiCall('/api/documents', {
        method: 'POST',
        body: JSON.stringify({
          title: newDocumentTitle,
          workspaceId: workspaceId
        })
      });
      
      if (response.success) {
        setNewDocumentTitle('');
        setShowCreateDocument(false);
        // Navigate to the new document
        router.push(`/document/${response.document.id}`);
      }
    } catch (error) {
      console.error('Error creating document:', error);
      alert('Failed to create document: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleCreateWhiteboard = async () => {
    if (!newWhiteboardTitle.trim()) return;
    
    try {
      const response = await apiCall('/api/whiteboards', {
        method: 'POST',
        body: JSON.stringify({
          title: newWhiteboardTitle,
          workspaceId: workspaceId
        })
      });
      
      setNewWhiteboardTitle('');
      setShowCreateWhiteboard(false);
      // Navigate to the new whiteboard
      router.push(`/whiteboard/${response._id}`);
    } catch (error) {
      console.error('Error creating whiteboard:', error);
      alert('Failed to create whiteboard: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleInviteUser = async () => {
    if (!inviteEmail.trim()) return;
    
    try {
      const response = await apiCall(`/api/workspace/${workspaceId}/invite`, {
        method: 'POST',
        body: JSON.stringify({
          email: inviteEmail,
          role: inviteRole
        })
      });
      
      if (response.success) {
        setInviteEmail('');
        setInviteRole('Viewer');
        setShowInviteModal(false);
        alert('Invitation sent successfully!');
        loadWorkspaceData(); // Reload to get updated member list
      }
    } catch (error) {
      console.error('Error inviting user:', error);
      alert('Failed to send invitation: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const isOwner = workspace?.createdBy === currentUser._id;
  const userRole = workspace?.members.find(m => m.userId === currentUser._id)?.role || 'Viewer';

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Loader2 size={48} className="animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading workspace...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center max-w-md">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Workspace</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{workspace?.name}</h1>
              <p className="text-gray-600">{workspace?.description}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              isOwner ? 'bg-green-100 text-green-700' :
              userRole === 'Editor' ? 'bg-blue-100 text-blue-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {userRole}
            </span>
            
            {isOwner && (
              <button
                onClick={() => setShowInviteModal(true)}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                <UserPlus size={16} />
                <span>Invite</span>
              </button>
            )}
            
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <Settings size={20} className="text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 px-6">
        <nav className="flex space-x-8">
          {[
            { id: 'documents', label: 'Documents', icon: FileText },
            { id: 'whiteboards', label: 'Whiteboards', icon: Square },
            { id: 'members', label: 'Members', icon: Users }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon size={16} />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <main className="p-6">
        {activeTab === 'documents' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Documents</h2>
              {(userRole === 'Owner' || userRole === 'Editor') && (
                <button
                  onClick={() => setShowCreateDocument(true)}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  <Plus size={16} />
                  <span>New Document</span>
                </button>
              )}
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex space-x-3">
                    <button
                      onClick={handleCreateDocument}
                      disabled={!newDocumentTitle.trim()}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
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
              {documents.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <FileText size={48} className="mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium mb-2">No documents yet</h3>
                  <p className="text-gray-400">Create your first document to get started.</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {documents.map((doc) => (
                    <div key={doc._id} className="flex items-center justify-between p-4 hover:bg-gray-50">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-blue-50 text-blue-600">
                          <FileText size={20} />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{doc.title}</h4>
                          <p className="text-sm text-gray-500">
                            Updated {new Date(doc.updatedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <button className="p-2 hover:bg-gray-100 rounded">
                          <Eye size={16} className="text-gray-400" />
                        </button>
                        <button 
                          onClick={() => router.push(`/document/${doc._id}`)}
                          className="p-2 hover:bg-gray-100 rounded"
                        >
                          <Edit3 size={16} className="text-gray-400" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded">
                          <MoreVertical size={16} className="text-gray-400" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'whiteboards' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Whiteboards</h2>
              {(userRole === 'Owner' || userRole === 'Editor') && (
                <button
                  onClick={() => setShowCreateWhiteboard(true)}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  <Plus size={16} />
                  <span>New Whiteboard</span>
                </button>
              )}
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex space-x-3">
                    <button
                      onClick={handleCreateWhiteboard}
                      disabled={!newWhiteboardTitle.trim()}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
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
              {whiteboards.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Square size={48} className="mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium mb-2">No whiteboards yet</h3>
                  <p className="text-gray-400">Create your first whiteboard to get started.</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {whiteboards.map((whiteboard) => (
                    <div key={whiteboard._id} className="flex items-center justify-between p-4 hover:bg-gray-50">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-purple-50 text-purple-600">
                          <Square size={20} />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{whiteboard.title}</h4>
                          <p className="text-sm text-gray-500">
                            Updated {new Date(whiteboard.updatedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <button className="p-2 hover:bg-gray-100 rounded">
                          <Eye size={16} className="text-gray-400" />
                        </button>
                        <button 
                          onClick={() => router.push(`/whiteboard/${whiteboard._id}`)}
                          className="p-2 hover:bg-gray-100 rounded"
                        >
                          <Edit3 size={16} className="text-gray-400" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded">
                          <MoreVertical size={16} className="text-gray-400" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'members' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Members</h2>
              {isOwner && (
                <button
                  onClick={() => setShowInviteModal(true)}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  <UserPlus size={16} />
                  <span>Invite Member</span>
                </button>
              )}
            </div>

            <div className="bg-white rounded-xl border border-gray-200">
              <div className="divide-y divide-gray-200">
                {workspace?.members.map((member, index) => (
                  <div key={index} className="flex items-center justify-between p-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                        U
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">User {member.userId}</h4>
                        <p className="text-sm text-gray-500">Member ID: {member.userId}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        member.role === 'Owner' ? 'bg-green-100 text-green-700' :
                        member.role === 'Editor' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {member.role}
                      </span>
                      {isOwner && member.role !== 'Owner' && (
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <MoreVertical size={16} className="text-gray-400" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Invite User to Workspace</h3>
            <div className="space-y-4">
              <input
                type="email"
                placeholder="Email address"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as 'Editor' | 'Viewer')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Viewer">Viewer</option>
                <option value="Editor">Editor</option>
              </select>
              <div className="flex space-x-3">
                <button
                  onClick={handleInviteUser}
                  disabled={!inviteEmail.trim()}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send Invite
                </button>
                <button
                  onClick={() => {
                    setShowInviteModal(false);
                    setInviteEmail('');
                    setInviteRole('Viewer');
                  }}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkspacePage;