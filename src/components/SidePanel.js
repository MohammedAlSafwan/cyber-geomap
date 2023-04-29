import React, { useState } from 'react';

const SidePanel = ({ data }) => {
  const [expanded, setExpanded] = useState({});

  const toggleExpand = (key) => {
    setExpanded((prevState) => ({ ...prevState, [key]: !prevState[key] }));
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: '16px',
        right: '16px',
        bottom: '16px',
        width: '300px',
        background: 'rgba(255, 255, 255, 0.9)',
        padding: '16px',
        borderRadius: '4px',
        overflowY: 'auto',
      }}
    >
      {Object.entries(data).map(([key, value]) => (
        <div key={key}>
          <div
            onClick={() => toggleExpand(key)}
            style={{ cursor: 'pointer', fontWeight: 'bold' }}
          >
            {expanded[key] ? '▼' : '▶'} {key}
          </div>
          {expanded[key] && (
            <pre style={{ overflowX: 'auto' }}>{JSON.stringify(value, null, 2)}</pre>
          )}
        </div>
      ))}
    </div>
  );
};

export default SidePanel;