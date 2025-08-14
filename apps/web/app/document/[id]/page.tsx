'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  ArrowLeft, 
  Save, 
  Users, 
  Clock, 
  MoreVertical,
  Loader2,
  AlertCircle
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

type Document = {
  id: string;
  title: string;
  content: string;
  createdBy: {
    name: string;
    email: string;
  };
  updatedAt: string;
};

const DocumentEditor = () => {
  const router = useRouter();
  const params = useParams();
  const documentId = params.id as string;

  const [document, setDocument] = useState<Document | null>(null);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth');
      return;
    }
    
    loadDocument();
  }, [documentId, router]);

  // Auto-save functionality
  useEffect(() => {
    if (!document) return;

    const autoSaveTimer = setTimeout(() => {
      if (content !== document.content) {
        handleSave();
      }
    }, 2000); // Auto-save after 2 seconds of inactivity

    return () => clearTimeout(autoSaveTimer);
  }, [content, document]);

  const loadDocument = async () => {
    try {
      setLoading(true);
      const response = await apiCall(`/api/documents/${documentId}`);
      
      if (response.success) {
        setDocument(response.document);
        setContent(response.document.content);
        setTitle(response.document.title);
      }
    } catch (error) {
      console.error('Error loading document:', error);
      setError(error instanceof Error ? error.message : 'Failed to load document');
      
      if (error instanceof Error && error.message.includes('401')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/auth');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!document || saving) return;

    try {
      setSaving(true);
      await apiCall(`/api/documents/${documentId}`, {
        method: 'PUT',
        body: JSON.stringify({ content })
      });
      
      setLastSaved(new Date());
      // Update the document state to reflect the new content
      setDocument(prev => prev ? { ...prev, content } : null);
    } catch (error) {
      console.error('Error saving document:', error);
      setError('Failed to save document');
    } finally {
      setSaving(false);
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setError(null); // Clear any previous errors
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Loader2 size={48} className="animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading document...</p>
        </div>
      </div>
    );
  }

  if (error && !document) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center max-w-md">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Document</h2>
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
              <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>By {document?.createdBy?.name}</span>
                <span>•</span>
                <span>Last updated: {document ? new Date(document.updatedAt).toLocaleString() : ''}</span>
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
              disabled={saving || content === document?.content}
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
                <Clock size={20} className="text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <MoreVertical size={20} className="text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Editor */}
      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm min-h-[600px]">
            <textarea
              value={content}
              onChange={handleContentChange}
              placeholder="Start writing your document..."
              className="w-full h-full min-h-[600px] p-8 border-none outline-none resize-none text-gray-900 text-lg leading-relaxed"
              style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
            />
          </div>
        </div>
      </main>

      {/* Status Bar */}
      <div className="bg-white border-t border-gray-200 px-6 py-2">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <span>{content.length} characters</span>
            <span>{content.split(/\s+/).filter(word => word.length > 0).length} words</span>
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

export default DocumentEditor;