// Категории товара, доступные в системе
export type categoryProduct =
  | "софт-скил"
  | "другое"
  | "дополнительное"
  | "кнопка"
  | "хард-скил";

// Описание товара, получаемое из API
export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: categoryProduct;
  price: number | null;
}

// Интерфейс модели каталога товаров
export interface IProductsModel {
  getProducts(): IProduct[] | undefined; //Список товаров
  setProducts(products: IProduct[]): void;
  getProductById(productId: string): IProduct | undefined;
  setPreview(product: IProduct): void;
  getPreview(): IProduct | null;
}

// Интерфейс модели покупателя
export interface IBuyerModel {
  setData(data: keyof IBuyer, value: string | PaymentMethod): void;
  validate(data: Record<keyof IBuyer, string>): boolean;
  get buyerData(): IBuyer;
  clear(): void;
  formErrors: FormErrors;
}
export type PaymentMethod = "cash" | "card";
//Интерфейс описания покупателя
export interface IBuyer {
  payment?: PaymentMethod;
  email: string;
  phone: string;
  address: string;
}

//Интерфейс модели корзины
export interface ICartModel {
  getProducts(): Map<string, IProduct>;
  getTotalCount(): number; //количество товаров в корзине
  hasItem(id: string): boolean;
  getTotal(): number; //общая сумма в корзине
  addProduct(product: IProduct): void;
  removeProduct(id: string): void;
  clearCart(): void;
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

//Интерфейс для форм
export interface IForm {
  valid: boolean;
  errors: string[];
}
export interface IFormContactsData {
  email: string;
  phone: string;
}

export interface IFormOrder {
  address: string;
  payment: PaymentMethod | null;
}

// Интерфейс всплывающего окна после успешного оформления заказа
export interface ISuccess {
  total: number;
}

export interface ISuccessActions {
  onClick: () => void;
}

export interface ICardActions {
  onClick: (event: MouseEvent) => void;
}

export interface IWebLarekAPI {
  getProducts(): Promise<IProduct[]>;
  getProduct(id: string): Promise<IProduct>;
  createOrder(order: IOrder): Promise<IOrderResult>;
}
