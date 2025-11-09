import { IProduct, IProductsModel } from "../../types";
import { IEvents } from "../../components/base/Events";

//Модель данных для управления коллекцией товаров и текущим выбранным товаром (превью).
export class ProductsModel implements IProductsModel {
  protected items: IProduct[] = [];
  protected _previewId: IProduct | null = null;
  protected events: IEvents;

  //Конструктор класса
  constructor(events: IEvents) {
    this.events = events;
  }
  //Сеттер устанавливает полный список товаров
  setProducts(products: IProduct[]) {
    this.items = [...products];
    this.events.emit("items:change", { items: products });
  }

  setPreview(product: IProduct): void {
    this._previewId = product;
    this.events.emit("preview:changed", {
      selectedProduct: this._previewId,
    });
  }

  getPreview(): IProduct | null {
    return this._previewId;
  }
  //Возвращает полный список товаров
  getProducts(): IProduct[] {
    return [...this.items];
  }
  //Находит товар по его идентификатору.
  getProductById(productId: string): IProduct | undefined {
    return this.items.find((product) => product.id === productId);
  }
}
