import { IBuyerModel, IOrder, IBuyer, PaymentMethod } from "../../types";
import { IEvents } from "../../components/base/Events";

export class BuyerModel implements IBuyerModel {
  protected _buyer: IBuyer = {
    payment: null,
    address: "",
    email: "",
    phone: "",
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

  getBuyerData(): IBuyer {
    return { ...this._buyer };
  }

  validationData(): boolean {
    const errors: Partial<Record<keyof IOrder, string>> = {};
    if (!this._buyer.payment) {
      errors.payment = "Необходимо указать способ оплаты";
    }
    if (!this._buyer.address) {
      errors.address = "Необходимо ввести адрес доставки";
    }

    if (!this._buyer.email) {
      errors.email = "Необходимо указать email";
    }
    if (!this._buyer.phone) {
      errors.phone = "Необходимо указать телефон";
    }

    this.events.emit("formErrors:change", errors);
    return Object.keys(errors).length === 0;
  }

  clear(): void {
    this._buyer = {
      payment: null,
      address: "",
      email: "",
      phone: "",
    };
    this.events.emit("buyer:data:cleared", this.getBuyerData());
  }
}
