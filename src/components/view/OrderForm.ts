import { EventEmitter } from "../base/Events";
import { PaymentMethod, IFormOrder } from "../../types";
import { Form } from "./Form";
import { ensureElement } from "../../utils/utils";
//Компонент формы заказа
export class FormOrder extends Form<IFormOrder> {
  protected paymentCashElement: HTMLButtonElement;
  protected paymentCardElement: HTMLButtonElement; // Кнопка выбора способа оплаты
  protected addressElement: HTMLInputElement; // Поле ввода адреса доставки
  //Конструктор формы заказа
  constructor(container: HTMLFormElement, events: EventEmitter) {
    super(container, events);

    // Получаем кнопки выбора способа оплаты по атрибутам name
    this.paymentCashElement = ensureElement(
      ".button_alt[name=cash]",
      this.container
    ) as HTMLButtonElement;
    this.paymentCardElement = ensureElement(
      ".button_alt[name=card]",
      this.container
    ) as HTMLButtonElement;
    this.addressElement = this.container.querySelector(
      'input[name="address"]'
    )!;

    // Настраиваем обработчики кликов для кнопок оплаты
    this.paymentCardElement.addEventListener("click", () => {
      this.payment = "card";
      this.inputChange("payment", "card");
    });
    this.paymentCashElement.addEventListener("click", () => {
      this.payment = "cash";
      this.inputChange("payment", "cash");
    });
  }

  //Сеттер для установки значения поля адреса
  set address(value: string) {
    this.addressElement.value = value;
  }

  set payment(value: PaymentMethod) {
    this.toggleClass(
      this.paymentCardElement,
      "button_alt-active",
      value === "card"
    );
    this.toggleClass(
      this.paymentCashElement,
      "button_alt-active",
      value === "cash"
    );
  }
}
