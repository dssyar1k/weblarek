import { IProduct, IProductsModel } from "../../types";
import { IEvents } from "../../components/base/Events";

export class ProductsModel implements IProductsModel {
  protected _products: IProduct[] = [];
  protected _previewId: string | null = null;
  protected events: IEvents;
  constructor(events: IEvents) {
    this.events = events;
  }
  // Получение списка товаров
  getProducts(): IProduct[] {
    return this._products;
  }
  // Сохранение массива товаров
  setProducts(products: IProduct[]) {
    this._products = products;
    this.events.emit("items:change", { items: products });
  }
  // Получение товара по ID
  getProductById(productId: string): IProduct | undefined {
    return this._products.find((product) => product.id === productId);
  }
  // Установка товара для предварительного просмотра
  setPreview(product: IProduct): void {
    this._previewId = product.id;
    this.events.emit("preview:changed", product);
  }

  // Получение товара для предварительного просмотра
  getPreview(): IProduct | null {
    if (!this._previewId) {
      return null;
    }
    const product = this.getProductById(this._previewId);
    return product || null;
  }
}
