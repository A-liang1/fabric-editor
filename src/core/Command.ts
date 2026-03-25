import { FabricObject } from 'fabric';

export interface Command {
  execute(): void;
  undo(): void;
  redo(): void;
}

export class AddObjectCommand implements Command {
  private object: FabricObject;
  private canvas: any;

  constructor(canvas: any, object: FabricObject) {
    this.canvas = canvas;
    this.object = object;
  }

  execute(): void {
    this.canvas.add(this.object);
    this.canvas.renderAll();
  }

  undo(): void {
    this.canvas.remove(this.object);
    this.canvas.renderAll();
  }

  redo(): void {
    this.canvas.add(this.object);
    this.canvas.renderAll();
  }
}

export class DeleteObjectCommand implements Command {
  private object: FabricObject;
  private canvas: any;

  constructor(canvas: any, object: FabricObject) {
    this.canvas = canvas;
    this.object = object;
  }

  execute(): void {
    this.canvas.remove(this.object);
    this.canvas.renderAll();
  }

  undo(): void {
    this.canvas.add(this.object);
    this.canvas.renderAll();
  }

  redo(): void {
    this.canvas.remove(this.object);
    this.canvas.renderAll();
  }
}

export class MoveObjectCommand implements Command {
  private object: FabricObject;
  private canvas: any;
  private fromX: number;
  private fromY: number;
  private toX: number;
  private toY: number;

  constructor(canvas: any, object: FabricObject, fromX: number, fromY: number, toX: number, toY: number) {
    this.canvas = canvas;
    this.object = object;
    this.fromX = fromX;
    this.fromY = fromY;
    this.toX = toX;
    this.toY = toY;
  }

  execute(): void {
    this.object.set({ left: this.toX, top: this.toY });
    this.object.setCoords();
    this.canvas.renderAll();
  }

  undo(): void {
    this.object.set({ left: this.fromX, top: this.fromY });
    this.object.setCoords();
    this.canvas.renderAll();
  }

  redo(): void {
    this.execute();
  }
}

export class ScaleObjectCommand implements Command {
  private object: FabricObject;
  private canvas: any;
  private fromScaleX: number;
  private fromScaleY: number;
  private toScaleX: number;
  private toScaleY: number;

  constructor(
    canvas: any,
    object: FabricObject,
    fromScaleX: number,
    fromScaleY: number,
    toScaleX: number,
    toScaleY: number
  ) {
    this.canvas = canvas;
    this.object = object;
    this.fromScaleX = fromScaleX;
    this.fromScaleY = fromScaleY;
    this.toScaleX = toScaleX;
    this.toScaleY = toScaleY;
  }

  execute(): void {
    this.object.set({ scaleX: this.toScaleX, scaleY: this.toScaleY });
    this.object.setCoords();
    this.canvas.renderAll();
  }

  undo(): void {
    this.object.set({ scaleX: this.fromScaleX, scaleY: this.fromScaleY });
    this.object.setCoords();
    this.canvas.renderAll();
  }

  redo(): void {
    this.execute();
  }
}

export class ModifyPropertyCommand implements Command {
  private object: FabricObject;
  private canvas: any;
  private property: string;
  private fromValue: any;
  private toValue: any;

  constructor(canvas: any, object: FabricObject, property: string, fromValue: any, toValue: any) {
    this.canvas = canvas;
    this.object = object;
    this.property = property;
    this.fromValue = fromValue;
    this.toValue = toValue;
  }

  execute(): void {
    this.object.set(this.property as keyof FabricObject, this.toValue);
    this.object.setCoords();
    this.canvas.renderAll();
  }

  undo(): void {
    this.object.set(this.property as keyof FabricObject, this.fromValue);
    this.object.setCoords();
    this.canvas.renderAll();
  }

  redo(): void {
    this.execute();
  }
}
