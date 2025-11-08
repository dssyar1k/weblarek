import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { IModalView } from "../../types";
//Компонент модального окна
export class Modal extends Component<IModalView> {
  protected closeButton: HTMLButtonElement;
  protected contentElement: HTMLElement;
  private events: IEvents;
  //Конструктор модального окна
  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;
    // Получаем ключевые элементы модального окна
    this.closeButton = ensureElement<HTMLButtonElement>(".modal__close");
    this.contentElement = ensureElement<HTMLElement>(".modal__content");
    // Инициализируем обработчики событий
    this.initEventListeners();
  }
  //Инициализирует обработчики событий для модального окна
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
  //Сеттер для установки содержимого модального окна
  set content(value: HTMLElement | null) {
    if (value) {
      this.contentElement.replaceChildren(value);
    } else {
      this.contentElement.innerHTML = "";
    }
  }
  //Открывает модальное окно
  open(): void {
    this.container.classList.add("modal_active");
    this.events.emit("modal:open");
  }
  //Закрывает модальное окно
  close(): void {
    this.container.classList.remove("modal_active");
    this.content = null;
    this.events.emit("modal:close");
  }
  //Обработчик клика по кнопке закрытия
  private handleClose(): void {
    this.close();
  }
  //Обработчик клика по контейнеру модального окна
  private handleContainerClick(event: MouseEvent): void {
    if (event.target === this.container) {
      this.close();
    }
  }
  //Рендерит модальное окно с данными и открывает его
  render(data: IModalView): HTMLElement {
    super.render(data);
    this.open();
    return this.container;
  }
}
