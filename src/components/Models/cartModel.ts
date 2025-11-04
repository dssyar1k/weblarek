import { ICartModel, IProduct, ICard } from "../../types";
import { IEvents } from "../../components/base/Events";

export class CartModel implements ICartModel {
  protected items: IProduct[] = [];
  events: IEvents;

  constructor(events: IEvents) {
    this.events = events;
  }

  addProduct(product: IProduct): void {
    if (product.price === null) {
      return;
    }
    this.items.push(product);
    this.items = [...this.items];
    this.events.emit("basket:change", this.getItems());
  }

  removeProduct(id: string): void {
    this.items = this.items.filter((product) => id !== product.id);
    this.events.emit("basket:change", this.getItems());
  }

  clear(): void {
    this.items = [];
    this.events.emit("basket:change");
  }

  getItems(): ICard[] {
    return this.items.map((product) => ({
      id: product.id,
      title: product.title,
      price: product.price,
    }));
  }
  getTotalCount(): number {
    return this.items.length;
  }

  hasItem(id: string): boolean {
    return this.items.some((product) => product.id === id);
  }

  getTotal(): number {
    return Array.from(this.items.values()).reduce((total, item) => {
      // Проверяем, что price не null перед добавлением
      return item.price !== null ? total + item.price : total;
    }, 0);
  }
}
