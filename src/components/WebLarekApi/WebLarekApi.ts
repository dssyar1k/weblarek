import { Api, ApiListResponse } from "../base/Api";
import { IProduct, IOrderResult, IOrder, IWebLarekApi } from "../../types";
//API‑клиент для взаимодействия с сервером WebLarek
export class WebLarekApi extends Api implements IWebLarekApi {
  readonly cdn: string;
  //Конструктор API‑клиента
  constructor(cdn: string, baseUrl: string, options?: RequestInit) {
    super(baseUrl, options);
    this.cdn = cdn;
  }

  //Получает список всех товаров из API
  getProducts(): Promise<IProduct[]> {
    return this.get<ApiListResponse<IProduct>>("/product").then(
      (data: ApiListResponse<IProduct>) =>
        data.items.map((item) => ({
          ...item,
          image: this.cdn + item.image.replace(/\.svg$/i, ".png"),
        }))
    );
  }

  //Получает информацию о конкретном товаре по его ID
  getProduct(id: string): Promise<IProduct> {
    return this.get<IProduct>(`/product/${id}`).then((item: IProduct) => ({
      ...item,
      image: this.cdn + item.image,
    }));
  }

  //Отправляет заказ на сервер
  createOrder(order: IOrder): Promise<IOrderResult> {
    return this.post<IOrderResult>("/order", order);
  }
}
