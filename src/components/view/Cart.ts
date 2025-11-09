import { ICart } from "../../types";
import { ensureElement, createElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

//Компонет корзины покупок
export class Cart extends Component<ICart> {
  protected listElement: HTMLElement;
  protected totalElement: HTMLElement;
  protected buttonElement: HTMLButtonElement;

  //Создаёт экземпляр компонента корзины
  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    // Находим DOM-элементы внутри контейнера
    this.listElement = ensureElement(".basket__list", container);
    this.buttonElement = ensureElement<HTMLButtonElement>(
      ".basket__button",
      container
    );
    this.totalElement = ensureElement(".basket__price", container);

    // Добавляем обработчик на кнопку оформления заказа
    this.buttonElement.addEventListener("click", () => {
      this.events.emit("order:open");
    });
  }

  // Заполняет список товаров в корзине
  set itemsList(items: HTMLElement[]) {
    if (items.length > 0) {
      this.listElement.replaceChildren(...items);
      this.buttonElement.disabled = false;
    } else {
      this.listElement.replaceChildren(
        createElement("span", { textContent: "Корзина пуста" })
      );
      this.buttonElement.disabled = true;
    }
  }

  //Устанавливает общую стоимость корзины.
  set total(value: number) {
    this.setText(this.totalElement, `${value} синапсов`);
  }
}
