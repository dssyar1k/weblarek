import { IBuyerModel, IOrder, IBuyer, PaymentMethod } from "../../types";
import { IEvents } from "../../components/base/Events";

export class BuyerModel implements IBuyerModel {
  protected _buyer: IBuyer = {
    payment: "",
    address: "",
    email: "",
    phone: "",
  };
  protected _order: IOrder = {
    payment: "",
    address: "",
    email: "",
    phone: "",
    total: 0,
    items: [],
  };
  protected events: IEvents;

  constructor(events: IEvents) {
    this.events = events;
  }

  setData(data: keyof IBuyer, value: string | PaymentMethod): void {
    {
      if (data === "payment") {
        this._buyer[data] = value as PaymentMethod;
      } else {
        this._buyer[data] = value as string;
      }
      this.events.emit("buyer:data:updated", this._buyer);
    }
  }

  validationData(data: Record<keyof IBuyer, string>): boolean {
    const isValidEmail = data.email.trim() !== "";
    const isValidPhone = data.phone.trim() !== "";
    const isValidAddress = data.address.trim() !== "";
    const isValidPayment = data.payment !== "";

    const isValid =
      isValidEmail && isValidPhone && isValidAddress && isValidPayment;

    if (!isValid) {
      this.events.emit("validation:error", {
        email: !isValidEmail,
        phone: !isValidPhone,
        address: !isValidAddress,
        payment: !isValidPayment,
      });
    }

    return isValid;
  }

  getBuyerData(): IOrder {
    return {
      ...this._buyer,
      total: this._order.total,
      items: this._order.items,
    };
  }

  clear(): void {
    this._buyer = {
      payment: "",
      address: "",
      email: "",
      phone: "",
    };
    this.events.emit("buyer:data:cleared");
  }
}
