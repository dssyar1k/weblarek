import { EventEmitter } from "../base/Events";
import { PaymentMethod, IFormOrder, IForm } from "../../types";
import { Form } from "./Form";
//Компонент формы заказа
export class FormOrder extends Form<IFormOrder> implements IForm {
  protected paymentButtons: HTMLButtonElement[]; // Кнопки выбора способа оплаты
  protected adressElement: HTMLInputElement; // Поле ввода адреса доставки
  //Конструктор формы заказа
  constructor(container: HTMLFormElement, events: EventEmitter) {
    super(container, events);

    // Получаем кнопки выбора способа оплаты по атрибутам name
    this.paymentButtons = Array.from(
      this.container.querySelectorAll(
        'button[name="card"], button[name="cash"]'
      )
    );
    // Получаем поле ввода адреса
    this.adressElement = this.container.querySelector('input[name="address"]')!;

    // Настраиваем обработчики кликов для кнопок оплаты
    this.paymentButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const method = button.name as PaymentMethod;
        this.inputChange("payment", method);
      });
    });
  }

  //Сеттер для установки значения поля адреса
  set address(value: string) {
    this.adressElement.value = value;
  }

  //Переопределённый метод рендера формы
  render(state: Partial<IFormOrder> & IForm): HTMLFormElement {
    const result = super.render(state) as HTMLFormElement;
    return result;
  }
}
