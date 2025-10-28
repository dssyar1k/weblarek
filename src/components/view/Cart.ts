import { ICart } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { EventEmitter } from "../base/Events";

export class Cart extends Component<ICart> {
  protected listElement: HTMLElement;
  protected totalElement: HTMLElement;
  protected buttonElement: HTMLElement;

  private getElement(selector: string): HTMLElement {
    const element = this.container.querySelector(selector);
    if (!element) {
      throw new Error(`Элемент ${selector} не найден`);
    }
    return element as HTMLElement; // TypeScript всё ещё требует утверждения, т.к. querySelector возвращает Element
  }

  constructor(container: HTMLElement, protected events: EventEmitter) {
    super(container);
    // Инициализация DOM-элементов
    this.listElement = ensureElement<HTMLElement>(
      ".basket__list",
      this.container
    );
    this.totalElement = this.getElement(".basket__price");
    this.buttonElement = this.getElement(".basket__button");

    // Проверка наличия кнопки и настройка обработчика
    if (this.buttonElement) {
      this.setupButtonHandler();
    }

    // Инициализация состояния
    this.items = [];
  }

  private setupButtonHandler(): void {
    const handleClick = () => {
      this.events.emit("order:open");
    };

    this.buttonElement.addEventListener("click", handleClick);
  }

  set items(items: HTMLElement[]) {
    // Проверка наличия элементов и обновление интерфейса
    if (items.length > 0) {
      this.enableButton();
      this.renderItemList(items);
    } else {
      this.disableButton();
    }
  }

  private enableButton(): void {
    if (this.buttonElement) {
      this.setDisabled(this.buttonElement, false);
    }
  }

  private disableButton(): void {
    if (this.buttonElement) {
      this.setDisabled(this.buttonElement, true);
    }
  }

  private renderItemList(items: HTMLElement[]): void {
    this.listElement.replaceChildren(...items);
  }

  set selected(items: string[]) {
    if (items.length) {
      this.setDisabled(this.buttonElement, false);
    } else {
      this.setDisabled(this.buttonElement, true);
    }
  }

  set total(total: number) {
    this.setText(this.totalElement, `${total} синапсов`);
  }
}
