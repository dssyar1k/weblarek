import { CardProduct } from "./CardProduct";
import { ICardActions, categoryProduct } from "../../types";
import { ensureElement } from "../../utils/utils";

export class CardCatalog extends CardProduct {
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);
    this.categoryElement = ensureElement(".card__category", this.container);
    this.imageElement = ensureElement(
      ".card__image",
      this.container
    ) as HTMLImageElement;

    if (actions?.onClick) {
      this.container.addEventListener("click", actions.onClick);
    }
  }
  set category(value: categoryProduct) {
    this.setText(this.categoryElement, value);
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
  set image(value: string) {
    this.setImage(this.imageElement, value, this.title);
  }
}
