import { ICardActions, ICard } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

export class CardProduct extends Component<ICard> {
  protected titleElement: HTMLElement;
  protected priceElement: HTMLElement;

  constructor(container: HTMLElement, protected actions?: ICardActions) {
    super(container);
    this.titleElement = ensureElement(".card__title", this.container);
    this.priceElement = ensureElement(".card__price", this.container);
    this.initEventListeners();

    if (actions?.onClick) {
      this.container.addEventListener("click", actions.onClick);
    }
  }
  private initEventListeners(): void {
    if (this.actions?.onClick) {
      this.container.addEventListener("click", this.actions.onClick);
    }
  }
  set id(value: string) {
    this.container.dataset.id = value;
  }

  get id(): string {
    return this.container.dataset.id || "";
  }

  set title(value: string) {
    this.setText(this.titleElement, value);
  }

  get title(): string {
    return this.titleElement.textContent?.trim() || "";
  }

  set price(value: string) {
    this.setText(this.priceElement, value ? `${value} синапсов` : "Бесценно");
  }

  get price(): string {
    return this.priceElement.textContent?.trim() || "";
  }
}
