import React, { useState } from 'react';
import { Terminal, Check, AlertCircle, ChevronDown, ChevronUp, Zap } from 'lucide-react';
import './DiscoveryPanel.css';

const DiscoveryPanel = ({ endpoints, backendUrl, manifestData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'json'

  return (
    <div className={`discovery-panel-wrapper ${isOpen ? 'open' : ''}`}>
      <div className="panel-toggle glass-panel" onClick={() => setIsOpen(!isOpen)}>
        <Terminal size={18} />
        <span>Endpoints Discovery</span>
        {isOpen ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
      </div>
      
      <div className="discovery-content glass-panel">
        <div className="discovery-header">
          <div className="status-indicator">
            <div className={`status-dot ${backendUrl ? 'active' : ''}`}></div>
            <span>Backend: {backendUrl || 'Not Connected'}</span>
          </div>
          <div className="view-switcher">
            <button 
              className={viewMode === 'list' ? 'active' : ''} 
              onClick={() => setViewMode('list')}
            >
              List
            </button>
            <button 
              className={viewMode === 'json' ? 'active' : ''} 
              onClick={() => setViewMode('json')}
            >
              JSON
            </button>
          </div>
        </div>

        {viewMode === 'list' ? (
          <div className="endpoints-list">
            {endpoints.map((ep, i) => (
              <div key={i} className="endpoint-item" data-endpoint={ep.path}>
                <div className="endpoint-main">
                  <span className={`method ${ep.method.toLowerCase()}`}>{ep.method}</span>
                  <span className="path">{ep.path}</span>
                </div>
                <div className="endpoint-meta">
                  <span className="desc">{ep.description}</span>
                  {ep.status === 'success' ? (
                    <Check size={14} className="status-success" />
                  ) : ep.status === 'error' ? (
                    <AlertCircle size={14} className="status-error" />
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="json-viewer">
            <pre>{JSON.stringify(manifestData || { message: "No manifest loaded" }, null, 2)}</pre>
          </div>
        )}

        <div className="discovery-footer">
          <p>Scan this UI to auto-detect backend integration points.</p>
        </div>
      </div>
    </div>
  );
};

export default DiscoveryPanel;
