import { CardProduct } from "./CardProduct";
import { ICardActions, ICard } from "../../types";
import { ensureElement } from "../../utils/utils";

export class CardCart extends CardProduct {
  protected indexElement: HTMLElement;
  protected buttonElement: HTMLButtonElement;

  constructor(container: HTMLElement, protected actions?: ICardActions) {
    super(container);

    this.buttonElement = ensureElement(
      ".card__button",
      this.container
    ) as HTMLButtonElement;
    this.indexElement = ensureElement(".basket__item-index", this.container);
  }

  set button(value: string) {
    this.setText(this.buttonElement, value);
  }

  render(data?: Partial<ICard>, index?: number): HTMLElement {
    super.render(data);
    if (this.indexElement && index !== undefined) {
      this.indexElement.textContent = index.toString();
    }
    return this.container;
  }
}
