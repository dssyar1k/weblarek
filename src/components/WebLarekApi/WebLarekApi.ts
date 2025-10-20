import { Api, ApiListResponse } from "../base/Api";
import { IProduct, IOrderResult, IOrder, IWebLarekApi } from "../../types";

export class WebLarekApi extends Api implements IWebLarekApi {
  readonly cdn: string;

  constructor(cdn: string, baseUrl: string, options?: RequestInit) {
    super(baseUrl, options);
    this.cdn = cdn;
  }
  getProducts(): Promise<IProduct[]> {
    return this.get("/product").then((data: ApiListResponse<IProduct>) =>
      data.items.map((item) => ({
        ...item,
        image: this.cdn + item.image,
      }))
    );
  }
  getProduct(id: string): Promise<IProduct> {
    return this.get(`/product/${id}`).then((item: IProduct) => ({
      ...item,
      image: this.cdn + item.image,
    }));
  }
  createOrder(order: IOrder): Promise<IOrderResult> {
    return this.post("/order", order).then((data: IOrderResult) => data);
  }
}
