import { IEvents } from "../base/Events";
import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { IHeader } from "../../types";

export class Header extends Component<IHeader> {
  protected counterElement: HTMLElement;
  protected cartButton: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);
    this.counterElement = ensureElement(".header__basket-counter", container);
    this.cartButton = ensureElement(
      ".header__basket",
      container
    ) as HTMLButtonElement;

    this.cartButton.addEventListener("click", () => {
      this.events.emit("basket:open");
    });
  }

  set counter(value: number) {
    this.setText(this.counterElement, String(value));
  }

  /*get counter(): number {
    const text = this.counterElement.textContent;
    return text ? parseInt(text, 10) : 0;
  }*/
}
