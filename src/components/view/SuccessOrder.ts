import { ISuccess, ISuccessActions } from "../../types";
import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

export class SuccessOrder extends Component<ISuccess> {
  protected totalElement: HTMLElement;
  protected buttonElement: HTMLElement;

  constructor(container: HTMLElement, actions: ISuccessActions) {
    super(container);
    this.totalElement = ensureElement(".order-success__description", container);
    this.buttonElement = ensureElement(
      ".order-success__close",
      container
    ) as HTMLButtonElement;

    this.initEventListeners(actions);
  }
  //Обработчики событий вынесены в отдельный метод initEventListeners() — проще читать и тестировать.
  private initEventListeners(actions: ISuccessActions): void {
    if (actions.onClick) {
      this.buttonElement.addEventListener("click", actions.onClick);
    }
  }
  set total(value: number) {
    this.setText(this.totalElement, `Списано ${value} синапсов`);
  }
}
