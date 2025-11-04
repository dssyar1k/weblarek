import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";
import { PaymentMethod, IFormOrder } from "../../types";
import { Form } from "./Form";

export class FormOrder extends Form<IFormOrder> {
  protected paymentCardElement: HTMLButtonElement;
  protected paymentCashElement: HTMLButtonElement;
  protected addressElement: HTMLInputElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);

    this.paymentCardElement = ensureElement(
      ".button_alt[name=card]",
      this.container
    ) as HTMLButtonElement;
    this.paymentCashElement = ensureElement(
      ".button_alt[name=cash]",
      this.container
    ) as HTMLButtonElement;
    this.addressElement = ensureElement(
      ".form__input[name=address]",
      this.container
    ) as HTMLInputElement;

    this.paymentCardElement.addEventListener("click", () => {
      this.payment = "card";
      this.onInputChange("payment", "card");
    });
    this.paymentCashElement.addEventListener("click", () => {
      this.payment = "cash";
      this.onInputChange("payment", "cash");
    });
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

  set address(value: string) {
    this.addressElement.value = value;
  }
}
