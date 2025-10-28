import { IEvents } from "../base/Events";
import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { IHeader } from "../../types";

export class Header extends Component<IHeader> {
  protected counterElement: HTMLElement;
  protected basketButton: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);
    this.counterElement = ensureElement(".header__basket-counter", container);
    this.basketButton = ensureElement(
      ".header__basket",
      container
    ) as HTMLButtonElement;

    this.basketButton.addEventListener("click", () => {
      this.events.emit("basket:open");
    });
  }

  set counter(value: number) {
    if (value < 0) return; // игнорируем отрицательные значения
    this.setText(this.counterElement, String(value));
  }

  get counter(): number {
    return parseInt(this.counterElement.textContent, 10) || 0;
  }
}
