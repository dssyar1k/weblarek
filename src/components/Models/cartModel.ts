import { ICartModel, IProduct } from "../../types";
import { IEvents } from "../../components/base/Events";

export class CartModel implements ICartModel {
  protected _items: Map<string, IProduct> = new Map();
  events: IEvents;

  constructor(events: IEvents) {
    this.events = events;
  }

  getItems(): Map<string, IProduct> {
    return this._items;
  }
  getTotalCount(): number {
    return this._items.size;
  }

  hasItem(id: string): boolean {
    return this._items.has(id);
  }

  getTotal(): number {
    return Array.from(this._items.values()).reduce((total, item) => {
      // Проверяем, что price не null перед добавлением
      return item.price !== null ? total + item.price : total;
    }, 0);
  }

  addProduct(product: IProduct): void {
    if (
      !product ||
      !product.id ||
      typeof product.price !== "number" ||
      product.price <= 0
    ) {
      throw new Error("Неверные данные о продукте");
    }

    this._items.set(product.id, { ...product });
    this.events.emit("basket:changed", this.getItems());
  }

  removeProduct(id: string): void {
    this._items.delete(id);
    this.events.emit("basket:changed", this.getItems());
  }

  clear(): void {
    this._items.clear();
    this.events.emit("basket:changed", this.getItems());
  }
}
