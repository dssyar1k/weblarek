import { IBuyerModel, IBuyer, PaymentMethod, FormErrors } from "../../types";
import { IEvents } from "../../components/base/Events";

/*Модель данных покупателя
Отвечает за хранение, валидацию и управление данными покупателя в процессе оформления заказа
 */
export class BuyerModel implements IBuyerModel {
  protected _buyer: IBuyer = {
    payment: undefined,
    address: "",
    email: "",
    phone: "",
  };

  formErrors: FormErrors = {};
  protected events: IEvents;

  //Конструктор модели покупателя

  constructor(events: IEvents) {
    this.events = events;
  }

  //Возвращает текущие данные покупателя (копия)

  get buyerData(): IBuyer {
    return { ...this._buyer };
  }

  //Устанавливает отдельное поле данных покупателя

  setData(data: keyof IBuyer, value: string | PaymentMethod): void {
    if (data === "payment") {
      if (typeof value === "string" && ["cash", "card"].includes(value)) {
        this._buyer[data] = value as PaymentMethod;
      }
    } else {
      this._buyer[data] = value as string;
    }

    this.validate();
    this.events.emit("buyer:data:updated", this._buyer);
  }

  //Валидирует основные обязательные поля покупателя

  validate(): boolean {
    const errors: FormErrors = {};
    const { payment, address } = this._buyer;

    // Валидация способа оплаты
    if (!payment) {
      errors.payment = "Необходимо указать способ оплаты";
    }

    // Валидация адреса
    if (!address || address.trim() === "") {
      errors.address = "Необходимо указать адрес";
    }

    const isValid = Object.keys(errors).length === 0;
    this.formErrors = errors;

    this.events.emit("validation:error", this.formErrors);
    return isValid;
  }

  // Очищает все данные покупателя и ошибки валидации

  clear(): void {
    this._buyer = {
      payment: undefined,
      address: "",
      email: "",
      phone: "",
    };

    this.formErrors = {};
    this.events.emit("buyer:data:cleared");
  }

  //Валидирует полный набор данных покупателя

  validationData(data: Record<keyof IBuyer, string>): boolean {
    this.formErrors = {};

    for (const key of Object.keys(data) as Array<keyof IBuyer>) {
      const value = data[key];

      switch (key) {
        case "payment":
          if (!value || !["cash", "card"].includes(value)) {
            this.formErrors.payment = "Некорректный способ оплаты";
          }
          break;

        case "address":
          if (!value || value.trim() === "") {
            this.formErrors.address = "Адрес не может быть пустым";
          }
          break;

        case "email":
          if (value && !this.validateEmail(value)) {
            this.formErrors.email = "Некорректный email";
          }
          break;

        case "phone":
          if (value && !this.validatePhone(value)) {
            this.formErrors.phone = "Некорректный номер телефона";
          }
          break;
      }
    }

    this.events.emit("validation:error", this.formErrors);
    return Object.keys(this.formErrors).length === 0;
  }

  //Проверяет корректность email-адреса

  private validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  //Проверяет корректность номера телефона

  private validatePhone(phone: string): boolean {
    const phoneRegex = /^\+?\d{10,15}$/;
    return phoneRegex.test(phone);
  }
}
