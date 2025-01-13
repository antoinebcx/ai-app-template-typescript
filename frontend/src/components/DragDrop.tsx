import React, { useCallback } from 'react';
import { Typography, useTheme, styled } from '@mui/material';
import { Upload } from '@mui/icons-material';

interface DragDropProps {
  onFileDrop: (file: File) => void;
  accept: string;
  maxSize?: number;
}

const DropZone = styled('label')(({ theme }) => ({
  width: '100%',
  height: 194,
  border: '1px dashed',
  borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)',
  borderRadius: 8,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.025)' : 'rgba(0, 0, 0, 0.01)',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.04)',
    borderColor: theme.palette.text.primary
  }
}));

export const DragDrop: React.FC<DragDropProps> = ({ onFileDrop, accept, maxSize = 10 }) => {
  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.match(accept)) {
      if (maxSize && file.size > maxSize * 1024 * 1024) {
        alert(`File size should be less than ${maxSize}MB`);
        return;
      }
      onFileDrop(file);
    }
  }, [accept, maxSize, onFileDrop]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (maxSize && file.size > maxSize * 1024 * 1024) {
        alert(`File size should be less than ${maxSize}MB`);
        return;
      }
      onFileDrop(file);
    }
  };

  return (
    <DropZone
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <input
        type="file"
        hidden
        accept={accept}
        onChange={handleChange}
      />
      <Upload sx={{ fontSize: 30, mb: 1, opacity: 0.7 }} />
      <Typography variant="body2" sx={{ opacity: 0.7 }}>
        Drop your file here or click to browse
      </Typography>
    </DropZone>
  );
};
