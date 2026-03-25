# fabric-editor

基于 Fabric.js + React + TypeScript 的画布编辑器，支持基础图形操作和 Undo/Redo 功能。

## 功能特性

- 🎨 基础图形绘制（矩形、圆形、文本）
- 🖱️ 对象操作（移动、缩放、删除）
- ↩️ Undo/Redo 历史记录
- 🎛️ 实时属性编辑（颜色、透明度等）
- ⌨️ 快捷键支持（Ctrl+Z/Y、Delete）

## 技术栈

- **Canvas 引擎**: Fabric.js 7.x
- **前端框架**: React 19 + TypeScript
- **构建工具**: Vite 8.x
- **状态管理**: React Context

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

启动后，浏览器会自动打开 `http://localhost:5173/`。

### 构建生产版本

```bash
npm run build
```

构建产物将输出到 `dist/` 目录。

### 预览生产构建

```bash
npm run preview
```
