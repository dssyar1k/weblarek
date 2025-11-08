import { ensureElement } from "../../utils/utils";
import { CardProduct } from "./CardProduct";
import { ICardActions } from "../../types";
//Компонент карточки товара в корзине
export class CardCart extends CardProduct {
  protected indexElement: HTMLElement;
//Конструктор компонента карточки товара в корзине
  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container, actions);
// Находим элемент для отображения индекса товара в корзине
    this.indexElement = ensureElement(".basket__item-index", this.container);
  }
//Сеттер для установки порядкового номера товара в корзине
  set index(value: number) {
     // Преобразуем число в строку и устанавливаем текст элемента
    this.setText(this.indexElement, value.toString());
  }
}
