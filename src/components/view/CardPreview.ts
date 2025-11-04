import { CardProduct } from "./CardProduct";
import { categoryProduct, ICardActions } from "../../types";
import { ensureElement } from "../../utils/utils";

export class CardPreview extends CardProduct {
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;
  protected descriptionElement: HTMLElement;
  protected buttonElement: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container, actions);

    this.categoryElement = ensureElement(".card__category", this.container);
    this.imageElement = ensureElement(
      ".card__image",
      this.container
    ) as HTMLImageElement;
    this.descriptionElement = ensureElement(".card__text", this.container);
    this.buttonElement = ensureElement(
      ".card__button",
      this.container
    ) as HTMLButtonElement;
  }

  set description(value: string) {
    this.setText(this.descriptionElement, value);
  }

  set image(value: string) {
    const alt = this.title || "";
    this.setImage(this.imageElement, value, alt);
  }

  set price(value: string) {
    this.setText(
      this.priceElement,
      value ? `${value} синапсов` : "Не продаётся"
    );
    if (this.buttonElement) {
      this.buttonElement.disabled = !value;
    }
  }

  set button(value: string) {
    this.setText(this.buttonElement, value);
  }

  set category(value: categoryProduct) {
    this.setText(this.categoryElement, value);

    // Оптимизируем переключение классов
    const classMap: Record<categoryProduct, string> = {
      "софт-скил": "card__category_soft",
      другое: "card__category_other",
      дополнительное: "card__category_additional",
      кнопка: "card__category_button",
      "хард-скил": "card__category_hard",
    };

    // Сбрасываем все классы категории
    Object.values(classMap).forEach((className) => {
      this.toggleClass(this.categoryElement, className, false);
    });

    // Добавляем нужный класс
    const className = classMap[value];
    if (className) {
      this.toggleClass(this.categoryElement, className, true);
    }
  }
}
