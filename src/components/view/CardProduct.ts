import { ICard } from "../../types";
import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

//Базовый компонент карточки товара
export class CardProduct extends Component<ICard> {
  protected titleEl: HTMLElement;
  protected priceEl: HTMLElement;

  //Создаёт экземпляр карточки товара
  constructor(container: HTMLElement) {
    super(container);

    // Находим элементы внутри контейнера карточки
    this.titleEl = ensureElement(".card__title", container);
    this.priceEl = ensureElement(".card__price", container);
  }
  //Устанавливает название товара
  set title(value: string) {
    this.titleEl.textContent = value.trim();
  }

  /**
   * Устанавливает цену товара.
   * Если цена null, отображает "Бесценно"*/
  set price(value: number | null) {
    this.priceEl.textContent = value ? `${value} синапсов` : "Бесценно";
  }
}
