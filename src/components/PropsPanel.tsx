import React from 'react';
import { useEditor } from '../context';

export const PropsPanel: React.FC = () => {
  const { selectedObject, fabricCanvas, refreshState } = useEditor();

  if (!selectedObject) {
    return (
      <div style={styles.panel}>
        <div style={styles.title}>Properties</div>
        <div style={styles.empty}>No object selected</div>
      </div>
    );
  }

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (fabricCanvas && selectedObject) {
      fabricCanvas.updateObjectProperty(selectedObject, 'fill', e.target.value);
      refreshState();
    }
  };

  const handleOpacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (fabricCanvas && selectedObject) {
      const value = parseFloat(e.target.value);
      if (!isNaN(value)) {
        fabricCanvas.updateObjectProperty(selectedObject, 'opacity', value);
        refreshState();
      }
    }
  };

  const obj = selectedObject as any;
  const id = obj.id || 'unknown';

  return (
    <div style={styles.panel}>
      <div style={styles.title}>Properties</div>
      <div style={styles.content}>
        <div style={styles.row}>
          <label style={styles.label}>ID:</label>
          <span style={styles.value}>{id}</span>
        </div>
        <div style={styles.row}>
          <label style={styles.label}>Type:</label>
          <span style={styles.value}>{selectedObject.type}</span>
        </div>
        <div style={styles.row}>
          <label style={styles.label}>Left:</label>
          <span style={styles.value}>{Math.round(selectedObject.left || 0)}</span>
        </div>
        <div style={styles.row}>
          <label style={styles.label}>Top:</label>
          <span style={styles.value}>{Math.round(selectedObject.top || 0)}</span>
        </div>
        <div style={styles.row}>
          <label style={styles.label}>Width:</label>
          <span style={styles.value}>{Math.round((selectedObject.width || 0) * (selectedObject.scaleX || 1))}</span>
        </div>
        <div style={styles.row}>
          <label style={styles.label}>Height:</label>
          <span style={styles.value}>{Math.round((selectedObject.height || 0) * (selectedObject.scaleY || 1))}</span>
        </div>
        <div style={styles.row}>
          <label style={styles.label}>Fill:</label>
          <input
            type="color"
            value={(selectedObject.fill as string) || '#000000'}
            onChange={handleColorChange}
            style={styles.colorInput}
          />
        </div>
        <div style={styles.row}>
          <label style={styles.label}>Opacity:</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={selectedObject.opacity ?? 1}
            onChange={handleOpacityChange}
            style={styles.rangeInput}
          />
          <span style={styles.value}>{selectedObject.opacity ?? 1}</span>
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  panel: {
    display: 'flex',
    flexDirection: 'column',
    padding: '16px',
    backgroundColor: '#f3f4f6',
    borderRadius: '8px',
    minWidth: '200px',
  },
  title: {
    fontWeight: 600,
    fontSize: '14px',
    color: '#374151',
    marginBottom: '12px',
    paddingBottom: '8px',
    borderBottom: '1px solid #e5e7eb',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  empty: {
    fontSize: '13px',
    color: '#6b7280',
    fontStyle: 'italic',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  label: {
    fontSize: '12px',
    color: '#6b7280',
    minWidth: '50px',
  },
  value: {
    fontSize: '12px',
    color: '#1f2937',
    fontWeight: 500,
  },
  colorInput: {
    width: '32px',
    height: '24px',
    padding: 0,
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  rangeInput: {
    flex: 1,
    cursor: 'pointer',
  },
};
