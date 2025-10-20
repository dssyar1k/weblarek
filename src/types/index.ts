/*export type ApiPostMethods = "POST" | "PUT" | "DELETE";

export interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(
    uri: string,
    data: object,
    method?: ApiPostMethods
  ): Promise<T>;
}*/

//Категории товара
export type categoryProduct =
  | "софт-скил"
  | "другое"
  | "дополнительное"
  | "кнопка"
  | "хард-скил";

//Описание товара (из API)
export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

//Интерфейс каталога карточек товара
export interface IProductsModel {
  getProducts(): IProduct[] | undefined;
  setProducts(products: IProduct[]): void;
  getProductById(productId: string): IProduct | undefined;
  setPreview(product: IProduct): void;
  getPreview(): IProduct | null;
}

//Список товаров (из API)
export interface IProductsList {
  total: number;
  items: IProduct[];
}

export interface IWebLarekApi {
  getProducts(): Promise<IProduct[]>;
  getProduct(id: string): Promise<IProduct>;
  createOrder(order: IOrder): Promise<IOrderResult>;
}
export type PaymentMethod = "cash" | "card";
//Интерфейс описания покупателя
export interface IBuyer {
  payment: PaymentMethod | "";
  email: string;
  phone: string;
  address: string;
}

//Интерфейс модели покупателя
export interface IBuyerModel {
  setData(data: keyof IBuyer, value: string): void;
  validationData(data: Record<keyof IBuyer, string>): boolean;
  getBuyerData(): IOrder;
  clear(): void;
}

//Заказ, отправляемый из корзины на сервер
export interface IOrder extends IBuyer {
  total: number;
  items: string[];
}

//Ошибка в форме
export type FormErrors = Partial<Record<keyof IOrder, string>>;

//Ответ сервера о заказе
export interface IOrderResult {
  id: string;
  total: number;
}

//Header
export interface IHeader {
  counter: number;
}

//Список товаров на главной странице
export interface IGallery {
  catalog: HTMLElement[];
}

//Интерфейс отображения всплывающего окна
export interface IModalView {
  content: HTMLElement;
}

// Тип для карточки товара
export type ICard = Pick<IProduct, "id" | "title" | "price"> &
  Partial<Pick<IProduct, "category" | "description" | "image">> & {
    button?: string;
  };

//Интерфейс корзины
export interface ICart {
  items: HTMLElement[];
  total: number;
}

//Интерфейс модели корзины
export interface ICartModel {
  getItems(): Map<string, IProduct>;
  getTotalCount(): number;
  hasItem(id: string): boolean;
  getTotal(): number;
  addProduct(product: IProduct): void;
  removeProduct(id: string): void;
  clear(): void;
}

//Интерфейс для форм
export interface IForm {
  valid: boolean;
  errors: string[];
}

// Интерфейс всплывающего окна после успешного оформления заказа
export interface ISuccess {
  total: number;
}

export interface ISuccessActions {
  onClick: () => void;
}

export interface IWebLarekAPI {
  getProducts(): Promise<IProduct[]>;
  getProduct(id: string): Promise<IProduct>;
  createOrder(order: IOrder): Promise<IOrderResult>;
}
