import { IFormContactsData } from "../../types";
import { EventEmitter } from "../base/Events";
import { Form } from "./Form";
import { ensureElement } from "../../utils/utils"; // Добавьте импорт

export class ContactsForm extends Form<IFormContactsData> {
  private emailElement: HTMLInputElement;
  private phoneElement: HTMLInputElement;

  constructor(container: HTMLFormElement, events: EventEmitter) {
    super(container, events);

    // Заменяем querySelector → ensureElement
    this.emailElement = ensureElement(
      'input[name="email"]',
      this.container
    ) as HTMLInputElement;
    this.phoneElement = ensureElement(
      'input[name="phone"]',
      this.container
    ) as HTMLInputElement;
  }

  set email(value: string) {
    this.emailElement.value = value;
  }

  set phone(value: string) {
    this.phoneElement.value = value;
  }
}
