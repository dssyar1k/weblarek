import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { IModalView } from "../../types";

// Компонент модального окна
export class Modal extends Component<IModalView> {
  protected closeButton: HTMLButtonElement;
  protected contentElement: HTMLElement;
  private events: IEvents;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;
    // Получаем ключевые элементы модального окна
    this.closeButton = ensureElement<HTMLButtonElement>(
      ".modal__close",
      this.container
    );
    this.contentElement = ensureElement<HTMLElement>(
      ".modal__content",
      this.container
    );
    // Инициализируем обработчики событий
    this.initEventListeners();
  }

  private initEventListeners(): void {
    this.closeButton.addEventListener("click", this.handleClose.bind(this));
    this.container.addEventListener(
      "click",
      this.handleContainerClick.bind(this)
    );
    this.contentElement.addEventListener("click", (event) =>
      event.stopPropagation()
    );
  }

  set content(value: HTMLElement | null) {
    if (value) {
      this.contentElement.replaceChildren(value);
    } else {
      this.contentElement.innerHTML = "";
    }
  }

  open(): void {
    this.container.classList.add("modal_active");
    // Событие эмитится только если открытие инициировано извне (например, кликом)
  }

  close(): void {
    this.container.classList.remove("modal_active");
    this.content = null;
    this.events.emit("modal:close"); // Закрытие — значимое событие для системы
  }

  private handleClose(): void {
    this.close();
  }

  private handleContainerClick(event: MouseEvent): void {
    if (event.target === this.container) {
      this.close();
    }
  }
}
