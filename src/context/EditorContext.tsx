import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { FabricCanvas } from '../core';
import { FabricObject } from 'fabric';

interface EditorContextType {
  fabricCanvas: FabricCanvas | null;
  setFabricCanvas: (canvas: FabricCanvas) => void;
  selectedObject: FabricObject | null;
  setSelectedObject: (obj: FabricObject | null) => void;
  canUndo: boolean;
  canRedo: boolean;
  refreshState: () => void;
  objectVersion: number; // 用于触发属性面板重新渲染
}

const EditorContext = createContext<EditorContextType | null>(null);

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditor must be used within EditorProvider');
  }
  return context;
};

export const EditorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 画布实例
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  // 当前选中的 fabric 对象
  const [selectedObject, setSelectedObject] = useState<FabricObject | null>(null);
  // 是否可以撤销操作
  const [canUndo, setCanUndo] = useState(false);
  // 是否可以重做操作
  const [canRedo, setCanRedo] = useState(false);
  // 对象版本号
  const [objectVersion, setObjectVersion] = useState(0);
  // 手动刷新编辑器状态
  const refreshState = useCallback(() => {
    if (fabricCanvas) {
      setCanUndo(fabricCanvas.canUndo());
      setCanRedo(fabricCanvas.canRedo());
      // 增加版本号，触发属性面板重新渲染
      setObjectVersion(v => v + 1);
    }
  }, [fabricCanvas]);

  // 注册一些监听事件，用于更新编辑器状态
  useEffect(() => {
    if (fabricCanvas) {
      fabricCanvas.canvas.on('selection:created', (e: any) => {
        setSelectedObject(e.selected?.[0] || null);
      });
      fabricCanvas.canvas.on('selection:updated', (e: any) => {
        setSelectedObject(e.selected?.[0] || null);
      });
      fabricCanvas.canvas.on('selection:cleared', () => {
        setSelectedObject(null);
      });
      fabricCanvas.canvas.on('object:modified', () => {
        refreshState();
      });
      fabricCanvas.canvas.on('object:added', () => {
        refreshState();
      });
      fabricCanvas.canvas.on('object:removed', () => {
        refreshState();
      });

      // 监听对象的移动、缩放、旋转等事件，实时更新属性面板
      const handleObjectChange = () => {
        const activeObject = fabricCanvas.getActiveObject();
        if (activeObject) {
          // 增加版本号，触发属性面板重新渲染
          setObjectVersion(v => v + 1);
        }
      };

      fabricCanvas.canvas.on('object:moving', handleObjectChange);
      fabricCanvas.canvas.on('object:scaling', handleObjectChange);
      fabricCanvas.canvas.on('object:rotating', handleObjectChange);
      fabricCanvas.canvas.on('object:skewing', handleObjectChange);

      return () => {
        fabricCanvas.canvas.off('selection:created');
        fabricCanvas.canvas.off('selection:updated');
        fabricCanvas.canvas.off('selection:cleared');
        fabricCanvas.canvas.off('object:modified');
        fabricCanvas.canvas.off('object:added');
        fabricCanvas.canvas.off('object:removed');
        fabricCanvas.canvas.off('object:moving', handleObjectChange);
        fabricCanvas.canvas.off('object:scaling', handleObjectChange);
        fabricCanvas.canvas.off('object:rotating', handleObjectChange);
        fabricCanvas.canvas.off('object:skewing', handleObjectChange);
      };
    }
  }, [fabricCanvas, refreshState]);

  // 注册键盘事件，用于撤销、重做、删除对象等操作
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!fabricCanvas) return;

      if (e.ctrlKey) {
        if (e.key === 'z' && !e.shiftKey) {
          e.preventDefault();
          fabricCanvas.undo();
          refreshState();
        } else if (e.key === 'y') {
          e.preventDefault();
          fabricCanvas.redo();
          refreshState();
        }
      }

      if (e.key === 'Delete') {
        const activeObject = fabricCanvas.getActiveObject();
        if (activeObject && document.activeElement?.tagName !== 'INPUT') {
          fabricCanvas.deleteObject(activeObject);
          refreshState();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [fabricCanvas, refreshState]);

  return (
    <EditorContext.Provider
      value={{
        fabricCanvas,
        setFabricCanvas,
        selectedObject,
        setSelectedObject,
        canUndo,
        canRedo,
        refreshState,
        objectVersion,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
};
