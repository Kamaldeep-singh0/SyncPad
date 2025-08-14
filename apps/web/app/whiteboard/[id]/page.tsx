'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  ArrowLeft, 
  Save, 
  Users, 
  MoreVertical,
  Loader2,
  AlertCircle,
  Pencil,
  Square,
  Circle,
  Type,
  Eraser
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

type WhiteboardState = {
  elements: any[];
  appState: any;
  files: any[];
};

type Whiteboard = {
  _id: string;
  title: string;
  workspace: string;
  createdBy: string;
  state: WhiteboardState;
  updatedAt: string;
};

const WhiteboardEditor = () => {
  const router = useRouter();
  const params = useParams();
  const whiteboardId = params.id as string;

  const [whiteboard, setWhiteboard] = useState<Whiteboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [selectedTool, setSelectedTool] = useState('pen');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth');
      return;
    }
    
    loadWhiteboard();
  }, [whiteboardId, router]);

  const loadWhiteboard = async () => {
    try {
      setLoading(true);
      const response = await apiCall(`/api/whiteboard/${whiteboardId}`);
      
      // The response should be the whiteboard state directly based on your backend
      setWhiteboard({
        _id: whiteboardId,
        title: 'Whiteboard', // You might want to get this from somewhere else
        workspace: '',
        createdBy: '',
        state: response,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error loading whiteboard:', error);
      setError(error instanceof Error ? error.message : 'Failed to load whiteboard');
      
      if (error instanceof Error && error.message.includes('401')) {
        localStorage.removeItem('token');
        localStorage.removeUser('user');
        router.push('/auth');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!whiteboard || saving) return;

    try {
      setSaving(true);
      await apiCall(`/api/whiteboard/${whiteboardId}/state`, {
        method: 'PUT',
        body: JSON.stringify({ state: whiteboard.state })
      });
      
      setLastSaved(new Date());
    } catch (error) {
      console.error('Error saving whiteboard:', error);
      setError('Failed to save whiteboard');
    } finally {
      setSaving(false);
    }
  };

  const tools = [
    { id: 'pen', icon: Pencil, label: 'Pen' },
    { id: 'rectangle', icon: Square, label: 'Rectangle' },
    { id: 'circle', icon: Circle, label: 'Circle' },
    { id: 'text', icon: Type, label: 'Text' },
    { id: 'eraser', icon: Eraser, label: 'Eraser' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Loader2 size={48} className="animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading whiteboard...</p>
        </div>
      </div>
    );
  }

  if (error && !whiteboard) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center max-w-md">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Whiteboard</h2>
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{whiteboard?.title}</h1>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>Collaborative Whiteboard</span>
                {lastSaved && (
                  <>
                    <span>•</span>
                    <span className="text-green-600">
                      Saved at {lastSaved.toLocaleTimeString()}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {error && (
              <div className="flex items-center space-x-2 text-red-600 text-sm">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}
            
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>Save</span>
                </>
              )}
            </button>
            
            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Users size={20} className="text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <MoreVertical size={20} className="text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex-shrink-0">
        <div className="flex items-center space-x-2">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setSelectedTool(tool.id)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-colors ${
                selectedTool === tool.id
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
              title={tool.label}
            >
              <tool.icon size={18} />
              <span className="hidden sm:inline">{tool.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Canvas Area */}
      <main className="flex-1 relative overflow-hidden">
        <div className="absolute inset-0 bg-white">
          {/* This is where you would integrate a drawing library like Excalidraw, Fabric.js, or Konva.js */}
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            <div className="text-center">
              <Square size={64} className="mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-semibold mb-2">Whiteboard Canvas</h3>
              <p className="text-gray-400 max-w-md">
                This is where the interactive whiteboard canvas would be rendered. 
                You can integrate libraries like Excalidraw, Fabric.js, or Konva.js 
                for full drawing functionality.
              </p>
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-blue-700 text-sm">
                  Selected tool: <strong>{tools.find(t => t.id === selectedTool)?.label}</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Status Bar */}
      <div className="bg-white border-t border-gray-200 px-6 py-2 flex-shrink-0">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <span>{whiteboard?.state?.elements?.length || 0} elements</span>
            <span>Zoom: 100%</span>
          </div>
          <div className="flex items-center space-x-2">
            {saving && (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>Auto-saving...</span>
              </>
            )}
            {!saving && lastSaved && (
              <span className="text-green-600">All changes saved</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhiteboardEditor;