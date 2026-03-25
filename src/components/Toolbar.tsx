import React from 'react';
import { useEditor } from '../context';

export const Toolbar: React.FC = () => {
  const { fabricCanvas, canUndo, canRedo, refreshState } = useEditor();

  const handleAddRect = () => {
    if (fabricCanvas) {
      fabricCanvas.addRect();
      refreshState();
    }
  };

  const handleAddCircle = () => {
    if (fabricCanvas) {
      fabricCanvas.addCircle();
      refreshState();
    }
  };

  const handleAddText = () => {
    if (fabricCanvas) {
      fabricCanvas.addText();
      refreshState();
    }
  };

  const handleDelete = () => {
    if (fabricCanvas) {
      const activeObject = fabricCanvas.getActiveObject();
      if (activeObject) {
        fabricCanvas.deleteObject(activeObject);
        refreshState();
      }
    }
  };

  const handleUndo = () => {
    if (fabricCanvas) {
      fabricCanvas.undo();
      refreshState();
    }
  };

  const handleRedo = () => {
    if (fabricCanvas) {
      fabricCanvas.redo();
      refreshState();
    }
  };

  return (
    <div style={styles.toolbar}>
      <div style={styles.section}>
        <span style={styles.label}>Add:</span>
        <button style={styles.button} onClick={handleAddRect}>Rectangle</button>
        <button style={styles.button} onClick={handleAddCircle}>Circle</button>
        <button style={styles.button} onClick={handleAddText}>Text</button>
      </div>
      <div style={styles.section}>
        <span style={styles.label}>Edit:</span>
        <button style={styles.button} onClick={handleDelete}>Delete</button>
      </div>
      <div style={styles.section}>
        <span style={styles.label}>History:</span>
        <button style={{...styles.button, ...(canUndo ? {} : styles.buttonDisabled)}} onClick={handleUndo} disabled={!canUndo}>
          Undo
        </button>
        <button style={{...styles.button, ...(canRedo ? {} : styles.buttonDisabled)}} onClick={handleRedo} disabled={!canRedo}>
          Redo
        </button>
      </div>
      <div style={styles.hint}>
        Ctrl+Z: Undo | Ctrl+Y: Redo | Delete: Remove
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  toolbar: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    padding: '16px',
    backgroundColor: '#f3f4f6',
    borderRadius: '8px',
    minWidth: '200px',
  },
  section: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap',
  },
  label: {
    fontWeight: 600,
    fontSize: '14px',
    color: '#374151',
    minWidth: '50px',
  },
  button: {
    padding: '8px 12px',
    fontSize: '13px',
    fontWeight: 500,
    color: '#ffffff',
    backgroundColor: '#3b82f6',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  buttonDisabled: {
    backgroundColor: '#9ca3af',
    cursor: 'not-allowed',
  },
  hint: {
    fontSize: '11px',
    color: '#6b7280',
    marginTop: '8px',
    paddingTop: '8px',
    borderTop: '1px solid #e5e7eb',
  },
};
