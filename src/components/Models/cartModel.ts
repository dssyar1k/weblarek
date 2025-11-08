import { ICartModel, IProduct } from "../../types";
import { IEvents } from "../../components/base/Events";

/**
 * Модель корзины покупок
 * Управляет коллекцией товаров в корзине, обеспечивает базовые операции.
 */
export class CartModel implements ICartModel {
  protected items: Map<string, IProduct> = new Map();
  events: IEvents;

  //Конструктор модели корзины

  constructor(events: IEvents) {
    this.events = events;
  }

  //Возвращает полную коллекцию товаров в корзине

  getProducts(): Map<string, IProduct> {
    return this.items;
  }

  //Добавляет товар в корзину

  addProduct(product: IProduct): void {
    if (product.price === null) {
      return;
    }
    this.items.set(product.id, product); // Сохраняем полный объект товара
    this.events.emit("basket:change", this.getProducts());
  }

  //Удаляет товар из корзины по ID

  removeProduct(id: string): void {
    this.items.delete(id);
    this.events.emit("basket:change", this.getProducts());
  }

  clearCart(): void {
    this.items.clear();
    this.events.emit("basket:change", this.getProducts());
  }

  //Возвращает количество товаров в корзине

  getTotalCount(): number {
    return this.items.size;
  }

  //Проверяем наличие товара в корзине
  hasItem(id: string): boolean {
    return this.items.has(id);
  }

  //Рассчитываем общую стоимость товаров в корзине

  getTotal(): number {
    return Array.from(this.items.values()).reduce((total, item) => {
      // Проверяем, что price не null перед добавлением к сумме
      return item.price !== null ? total + item.price : total;
    }, 0);
  }
}
