import { ICart } from "../../types";
import { ensureElement, createElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { EventEmitter } from "../base/Events";

export class Cart extends Component<ICart> {
  protected listElement: HTMLElement;
  protected totalElement: HTMLElement;
  protected buttonElement: HTMLElement;
  private _items: HTMLElement[] = [];
  constructor(container: HTMLElement, protected events: EventEmitter) {
    super(container);

    this.listElement = ensureElement(".basket__list", this.container);
    this.totalElement = ensureElement(".basket__price", this.container);
    this.buttonElement = ensureElement(".basket__button", this.container);

    if (this.buttonElement) {
      this.buttonElement.addEventListener("click", () => {
        events.emit("order:open");
      });
    }

    this.items = [];
  }

  set items(items: HTMLElement[]) {
    this._items = items;

    if (items.length > 0) {
      this.setDisabled(this.buttonElement, false);
      this.listElement.replaceChildren(...items);
    } else {
      this.setDisabled(this.buttonElement, true);
      const emptyMessage = createElement<HTMLParagraphElement>("p", {
        className: "basket__empty-message",
        textContent: "Корзина пуста",
      });
      this.listElement.replaceChildren(emptyMessage);
    }
  }

  set total(total: number) {
    this.setText(this.totalElement, `${total} синапсов`);
  }
}
