import React, { useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';

const InputBox = ({ onSearch }) => {
  const [value, setValue] = useState('');

  const handleSearch = () => {
    onSearch(value);
    setValue('');
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: '16px',
        left: '16px',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        type="text"
        placeholder="Enter IP address or domain"
        style={{
          padding: '4px 8px',
          borderRadius: '4px',
          border: '1px solid #ccc',
        }}
      />
      <button
        onClick={handleSearch}
        style={{
          marginLeft: '8px',
          padding: '4px 8px',
          borderRadius: '4px',
          backgroundColor: '#1890ff',
          color: 'white',
          border: 'none',
        }}
      >
        <SearchOutlined />
      </button>
    </div>
  );
};

export default InputBox;