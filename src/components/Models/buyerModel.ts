import { IBuyer, PaymentMethod } from "../../types";
import { IEvents } from "../../components/base/Events";

/**
 * Модель данных покупателя
 * Отвечает за хранение, валидацию и управление данными покупателя в процессе оформления заказа
 */
export class BuyerModel {
  protected payment: PaymentMethod = "";
  protected address: string = "";
  protected email: string = "";
  protected phone: string = "";
  protected events: IEvents;

  /** Конструктор модели покупателя */
  constructor(events: IEvents) {
    this.events = events;
  }

  //Возвращает текущие данные покупателя
  buyerData(): IBuyer {
    return {
      payment: this.payment,
      address: this.address,
      email: this.email,
      phone: this.phone,
    };
  }

  //Валидирует основные обязательные поля покупателя
  validate(): { [key: string]: string } {
    const errors: { [key: string]: string } = {};

    if (!this.payment) errors.payment = "Необходимо выбрать способ оплаты";
    if (!this.address.trim()) errors.address = "Необходимо указать адрес";
    if (!this.email.trim()) errors.email = "Не указан email";
    if (!this.phone.trim()) errors.phone = "Не указан телефон";

    return errors;
  }

  //Устанавливает способ оплаты
  setPayment(payment: PaymentMethod): void {
    this.payment = payment;
    this.events.emit("buyer:data:change", { field: "payment", value: payment });
  }
  //Устанавливает адрес доставки
  setAddress(address: string): void {
    this.address = address;
    this.events.emit("buyer:data:change", { field: "address", value: address });
  }
  //Устанавливает email покупателя
  setEmail(email: string): void {
    this.email = email;
    this.events.emit("buyer:data:change", { field: "email", value: email });
  }
  //Устанавливает телефон покупателя
  setPhone(phone: string): void {
    this.phone = phone;
    this.events.emit("buyer:data:change", { field: "phone", value: phone });
  }

  /** Очищает все данные покупателя и ошибки валидации */
  clear(): void {
    this.payment = "";
    this.address = "";
    this.email = "";
    this.phone = "";
    this.events.emit("buyer:data:change");
  }
}
