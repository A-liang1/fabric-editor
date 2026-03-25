import { Canvas, Rect, Circle, Textbox, FabricObject } from 'fabric';
import { HistoryManager } from './HistoryManager';
import { AddObjectCommand, DeleteObjectCommand, MoveObjectCommand, ScaleObjectCommand, ModifyPropertyCommand } from './Command';

export type ObjectType = 'rect' | 'circle' | 'text';

export class FabricCanvas {
  public canvas: Canvas;
  public historyManager: HistoryManager;
  private objectCounter: number = 0;

  constructor(canvasElement: HTMLCanvasElement) {
    this.canvas = new Canvas(canvasElement, {
      width: 800,
      height: 600,
      backgroundColor: '#ffffff',
      selection: true,
    });
    this.historyManager = new HistoryManager();
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    // 在对象开始被操作时保存原始状态
    this.canvas.on('mouse:down', (e) => {
      const obj = e.target;
      if (obj) {
        (obj as any).originalState = {
          left: obj.left,
          top: obj.top,
          scaleX: obj.scaleX,
          scaleY: obj.scaleY,
        };
      }
    });

    this.canvas.on('object:modified', (e) => {
      const obj = e.target;
      if (!obj) return;

      const originalState = (obj as any).originalState || {};
      if (originalState.left !== undefined && originalState.top !== undefined) {
        if (obj.left !== originalState.left || obj.top !== originalState.top) {
          const command = new MoveObjectCommand(
            this.canvas,
            obj,
            originalState.left,
            originalState.top,
            obj.left!,
            obj.top!
          );
          this.historyManager.execute(command);
        }
      }
      if (originalState.scaleX !== undefined && originalState.scaleY !== undefined) {
        if (obj.scaleX !== originalState.scaleX || obj.scaleY !== originalState.scaleY) {
          const command = new ScaleObjectCommand(
            this.canvas,
            obj,
            originalState.scaleX,
            originalState.scaleY,
            obj.scaleX!,
            obj.scaleY!
          );
          this.historyManager.execute(command);
        }
      }

      // 清除 originalState，避免影响下次操作
      (obj as any).originalState = undefined;
    });
  }

  public generateId(): string {
    return `obj_${++this.objectCounter}_${Date.now()}`;
  }
  // 依赖 fabric 引擎创建图像 & 使用命令模式执行并记录操作
  public addRect(options?: Partial<Rect>): FabricObject {
    const rect = new Rect({
      left: 100,
      top: 100,
      width: 100,
      height: 100,
      fill: '#3b82f6',
      ...options,
    });

    (rect as any).id = this.generateId();
    const command = new AddObjectCommand(this.canvas, rect);
    this.historyManager.execute(command);

    return rect;
  }
  public addCircle(options?: Partial<Circle>): FabricObject {
    const circle = new Circle({
      left: 100,
      top: 100,
      radius: 50,
      fill: '#10b981',
      ...options,
    });
    (circle as any).id = this.generateId();
    const command = new AddObjectCommand(this.canvas, circle);
    this.historyManager.execute(command);
    return circle;
  }
  public addText(text: string = 'Text', options?: Partial<Textbox>): FabricObject {
    const textbox = new Textbox(text, {
      left: 100,
      top: 100,
      fontSize: 24,
      fill: '#1f2937',
      ...options,
    });
    (textbox as any).id = this.generateId();
    const command = new AddObjectCommand(this.canvas, textbox);
    this.historyManager.execute(command);
    return textbox;
  }
  // 删除图像 & 使用命令模式执行并记录操作
  public deleteObject(obj: FabricObject): void {
    const command = new DeleteObjectCommand(this.canvas, obj);
    this.historyManager.execute(command);
  }
  // 更新图像属性 & 使用命令模式执行并记录操作
  public updateObjectProperty(obj: FabricObject, property: string, value: any): void {
    const originalValue = (obj as any)[property];
    const command = new ModifyPropertyCommand(this.canvas, obj, property, originalValue, value);
    this.historyManager.execute(command);
  }

  public undo(): boolean {
    return this.historyManager.undo();
  }

  public redo(): boolean {
    return this.historyManager.redo();
  }

  public canUndo(): boolean {
    return this.historyManager.canUndo();
  }

  public canRedo(): boolean {
    return this.historyManager.canRedo();
  }

  public getActiveObject(): FabricObject | undefined {
    return this.canvas.getActiveObject();
  }

  public getActiveObjects(): FabricObject[] {
    return this.canvas.getActiveObjects();
  }

  public renderAll(): void {
    this.canvas.renderAll();
  }
}
