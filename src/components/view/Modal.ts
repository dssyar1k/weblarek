import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { IModalView } from "../../types";

export class Modal extends Component<IModalView> {
  protected closeButton: HTMLButtonElement;
  protected contentElement: HTMLElement;
  private events: IEvents;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;
    this.closeButton = ensureElement<HTMLButtonElement>(".modal__close");
    this.contentElement = ensureElement<HTMLElement>(".modal__content");
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
    this.events.emit("modal:open");
  }

  close(): void {
    this.container.classList.remove("modal_active");
    this.content = null;
    this.events.emit("modal:close");
  }

  render(data: IModalView): HTMLElement {
    super.render(data);
    this.open();
    return this.container;
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
