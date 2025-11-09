import { IEvents } from "../base/Events";
import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { IHeader } from "../../types";
//Компонент шапки (header)
export class Header extends Component<IHeader> {
  protected counterElement: HTMLElement;
  protected cartButton: HTMLButtonElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);
    // Получаем элемент счётчика товаров в корзине
    this.counterElement = ensureElement(".header__basket-counter", container);
    // Получаем кнопку корзины
    this.cartButton = ensureElement(
      ".header__basket",
      container
    ) as HTMLButtonElement;
    // Подписываемся на клик по кнопке корзины
    this.cartButton.addEventListener("click", () => {
      this.events.emit("basket:open");
    });
  }
  //Сеттер для обновления счётчика товаров в корзине
  set counter(value: number) {
    this.counterElement.textContent = String(value);
  }
}
