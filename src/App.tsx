import React from 'react';
import { EditorProvider } from './context';
import { Toolbar, PropsPanel, Canvas } from './components';

const App: React.FC = () => {
  return (
    <EditorProvider>
      <div style={styles.app}>
        <main style={styles.main}>
          <aside style={styles.sidebar}>
            {/* 左侧工具栏 */}
            <Toolbar />
            {/* 属性面板 */}
            <PropsPanel />
          </aside>

          {/* 画布区域 */}
          <section style={styles.canvasArea}>
            <Canvas />
          </section>
        </main>
      </div>
    </EditorProvider>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  app: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    backgroundColor: '#f9fafb',
  },
  main: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
  },
  sidebar: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    padding: '16px',
    width: '260px',
    backgroundColor: '#ffffff',
    borderRight: '1px solid #e5e7eb',
    overflowY: 'auto',
  },
  canvasArea: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
  },
};

export default App;
