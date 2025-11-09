import { ISuccess, ISuccessActions } from "../../types";
import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

//Компонент успешного оформления заказа
export class SuccessOrder extends Component<ISuccess> {
  protected totalElement: HTMLElement;
  protected buttonElement: HTMLElement;

  //Конструктор компонента
  constructor(container: HTMLElement, actions: ISuccessActions) {
    super(container);

    // Получаем ключевые элементы интерфейса
    this.totalElement = ensureElement(".order-success__description", container);
    this.buttonElement = ensureElement(
      ".order-success__close",
      container
    ) as HTMLButtonElement;

    // Настраиваем обработчики событий
    this.initEventListeners(actions);
  }
  //Инициализирует обработчики событий для компонента
  private initEventListeners(actions: ISuccessActions): void {
    if (actions.onClick) {
      this.buttonElement.addEventListener("click", actions.onClick);
    }
  }

  //Сеттер для установки итоговой суммы заказа
  set total(value: number) {
    this.setText(this.totalElement, `Списано ${value} синапсов`);
  }
}
