import { Api, ApiListResponse } from "../base/Api";
import { IProduct, IOrderResult, IOrder, IWebLarekApi } from "../../types";

export class WebLarekApi extends Api implements IWebLarekApi {
  readonly cdn: string;

  constructor(cdn: string, baseUrl: string, options?: RequestInit) {
    super(baseUrl, options);
    this.cdn = cdn;
  }
  getProducts(): Promise<IProduct[]> {
    return this.get<ApiListResponse<IProduct>>("/product").then(
      (data: ApiListResponse<IProduct>) =>
        data.items.map((item) => ({
          ...item,
          image: this.cdn + item.image.replace(/\.svg$/i, ".png"),
        }))
    );
  }
  getProduct(id: string): Promise<IProduct> {
    return this.get<IProduct>(`/product/${id}`).then((item: IProduct) => ({
      ...item,
      image: this.cdn + item.image,
    }));
  }
  createOrder(order: IOrder): Promise<IOrderResult> {
    return this.post<IOrderResult>("/order", order);
  }
}
