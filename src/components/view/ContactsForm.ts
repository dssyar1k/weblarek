import { IFormContactsData } from "../../types";
import { EventEmitter } from "../base/Events";
import { Form } from "./Form";

export class ContactsForm extends Form<IFormContactsData> {
  private emailElement: HTMLInputElement;
  private phoneElement: HTMLInputElement;

  constructor(container: HTMLFormElement, events: EventEmitter) {
    super(container, events);

    const email = container.querySelector('input[name="email"]');
    const phone = container.querySelector('input[name="phone"]');

    if (!email || !(email instanceof HTMLInputElement)) {
      throw new Error("Поле ввода email не найдено");
    }
    if (!phone || !(phone instanceof HTMLInputElement)) {
      throw new Error("Поле ввода номера телефона не найдено");
    }

    this.emailElement = email;
    this.phoneElement = phone;
  }

  set email(value: string) {
    this.emailElement.value = value;
  }

  set phone(value: string) {
    this.phoneElement.value = value;
  }

  get email(): string {
    return this.emailElement.value;
  }

  get phone(): string {
    return this.phoneElement.value;
  }
}
