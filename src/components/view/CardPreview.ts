import { CardProduct } from "./CardProduct";
import { categoryProduct, ICardActions } from "../../types";
import { ensureElement } from "../../utils/utils";
//Компонент предварительного просмотра товара
export class CardPreview extends CardProduct {
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;
  protected descriptionElement: HTMLElement;
  protected buttonElement: HTMLButtonElement;
  //Конструктор компонента предварительного просмотра
  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container, actions);
    // Получаем DOM‑элементы внутри карточки
    this.descriptionElement = ensureElement(".card__text", this.container);
    this.imageElement = ensureElement(
      ".card__image",
      this.container
    ) as HTMLImageElement;
    this.buttonElement = ensureElement(
      ".card__button",
      this.container
    ) as HTMLButtonElement;
    this.categoryElement = ensureElement(".card__category", this.container);
  }
  //Сеттер для установки описания товара
  set description(value: string) {
    this.setText(this.descriptionElement, value);
  }
  //Сеттер для установки изображения товара
  set image(value: string) {
    const alt = this.titleElement.textContent || "";
    this.setImage(this.imageElement, value, alt);
  }
  //Сеттер для установки текста кнопки действия
  set button(value: string) {
    this.setText(this.buttonElement, value);
  }

  set category(value: categoryProduct) {
    this.setText(this.categoryElement, value);
    // Динамическое переключение классов в зависимости от категории
    this.toggleClass(
      this.categoryElement,
      "card__category_soft",
      value === "софт-скил"
    );
    this.toggleClass(
      this.categoryElement,
      "card__category_other",
      value === "другое"
    );
    this.toggleClass(
      this.categoryElement,
      "card__category_additional",
      value === "дополнительное"
    );
    this.toggleClass(
      this.categoryElement,
      "card__category_button",
      value === "кнопка"
    );
    this.toggleClass(
      this.categoryElement,
      "card__category_hard",
      value === "хард-скил"
    );
  }
}
