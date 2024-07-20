'use client';
import { repeat } from "./Util";

type ArrayInitializer<T> = (index: number) => T;
export class LoopingQueue<T> {
  private readonly array: T[];
  private index: number = 0;
  constructor(anyArray: any[]) {
    this.array = anyArray;
  }
  static create<T>(initializer: ArrayInitializer<T>, length: number): LoopingQueue<T> {
    return new LoopingQueue(repeat(length, initializer));
  }

  //index :20
  next(amount?: number): T {
    if (amount !== 1 && amount !== undefined) {
      this.index += amount - 1;
      this.verifyIndex();
    }
    if (this.index === this.array.length) this.index = 0;

    const r = (this.array)[this.index];
    this.index++;
    this.verifyIndex(); // performance issue

    return r;
  }
  previous(amount?: number): T {
    if (amount !== undefined) {
      this.index -= amount;
      this.verifyIndex();
    } else {
      --this.index;
      this.verifyIndex(); //performance issue
    }
    return (this.array)[this.index];
  }

  private verifyIndex() {
    if (this.index < 0) this.index = this.array.length + (this.index % (this.array.length - 1));
    else if (this.index > this.array.length - 1) this.index = this.array.length - this.index;
  }
  setIndex(index: number) {
    if (!Number.isInteger(index)) return false;
    this.index = index;
    this.verifyIndex();
    return true;
  }

  get(index: number): T {
    return this.array[index];
  }
}
