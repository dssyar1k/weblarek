import { IProduct } from "../../types";
import { IEvents } from "../../components/base/Events";

/**
 * Модель корзины покупок
 * Управляет коллекцией товаров в корзине, обеспечивает базовые операции.
 */
export class CartModel {
  protected itemsList: IProduct[];
  protected events: IEvents;

  //Конструктор модели корзины

  constructor(events: IEvents, items: IProduct[] = []) {
    this.events = events;
    this.itemsList = items;
  }

  //Возвращает полную коллекцию товаров в корзине

  getItems(): IProduct[] {
    return this.itemsList;
  }

  getTotalCount(): number {
    return this.itemsList.length;
  }

  //Добавляет товар в корзину

  addProduct(product: IProduct): void {
    this.itemsList.push(product);
    this.events.emit("basket:change");
  }

  //Удаляет товар из корзины по ID

  removeProduct(product: IProduct): void {
    this.itemsList = this.itemsList.filter((p) => p.id !== product.id);
    this.events.emit("basket:change");
  }

  clearCart(): void {
    this.itemsList = [];
    this.events.emit("basket:change");
  }

  //Проверяем наличие товара в корзине
  hasItem(id: string): boolean {
    return this.itemsList.some((product) => product.id === id);
  }

  //Рассчитываем общую стоимость товаров в корзине

  getTotal(): number {
    return this.itemsList.reduce((sum, p) => sum + (p.price || 0), 0);
  }
}
