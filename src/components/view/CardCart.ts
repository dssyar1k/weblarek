import { ensureElement } from "../../utils/utils";
import { ICardActions } from "../../types";
import { CardProduct } from "./CardProduct";

// Компонент карточки товара в корзине
export class CardCart extends CardProduct {
  protected indexElement: HTMLElement;
  protected buttonElement: HTMLButtonElement;

  // Конструктор компонента карточки товара в корзине
  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);

    // Находим элемент для отображения индекса товара в корзине
    this.indexElement = ensureElement(".basket__item-index", this.container);

    this.buttonElement = ensureElement<HTMLButtonElement>(
      ".basket__item-delete",
      this.container
    );
    if (actions?.onClick) {
      this.buttonElement.addEventListener("click", actions.onClick);
    }
  }

  // Сеттер для установки порядкового номера товара в корзине
  set index(value: number) {
    // Преобразуем число в строку и устанавливаем текст элемента
    this.indexElement.textContent = String(value);
  }
}
