'use client';
type ContentProvider<T> = (index: number) => T;
class ContentLoader<T extends NonNullable<any>> {
  private contentGetter: ContentProvider<T>;
  private contents: Map<number, T> = new Map<number, T>();
  private contentAmount: number;
  private preloadedAmount: number;
  constructor(contentGetter: ContentProvider<T>, contentAmount: number, preloadAmount: number = contentAmount / 2) {
    this.contentGetter = contentGetter;
    this.contentAmount = contentAmount;
    this.preloadedAmount = preloadAmount;
  }
  loadContent(index: number): T {
    if (this.contents.has(index)) return this.contents.get(index)!;

    const content = this.contentGetter(index);
    this.contents.set(index, content);
    return content;
  }
  preLoadContent(startIndex: number, index: number): void {
    for (let i = startIndex; i <= index; i++) {
      if (i >= this.contentAmount)
        this.loadContent(i);
    }
  }

  getContentAmount(): number { return this.contentAmount; }
  getPreloadedAmount(): number { return this.preloadedAmount; }
  getContentsMap(): Map<number, T> { return this.contents; }
}
