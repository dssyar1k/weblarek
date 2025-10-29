import { IEvents } from "../base/Events";
import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { IForm } from "../../types";

export class Form<T> extends Component<IForm> {
  protected submitElement: HTMLButtonElement;
  protected errorsElement: HTMLElement;

  constructor(protected container: HTMLFormElement, protected events: IEvents) {
    super(container);

    this.submitElement = ensureElement(
      "button[type=submit]",
      container
    ) as HTMLButtonElement;
    this.errorsElement = ensureElement(".form__errors", container);

    this.initEventListeners();
  }

  private initEventListeners(): void {
    this.container.addEventListener("input", this.handleInput.bind(this));
    this.container.addEventListener("submit", this.handleSubmit.bind(this));
  }

  private handleInput(e: Event): void {
    const target = e.target as HTMLInputElement;
    if (!target.name) return; // защита от элементов без name

    const field = target.name as keyof T;
    const value = target.value;
    this.onInputChange(field, value);
  }

  private handleSubmit(e: Event): void {
    e.preventDefault();
    this.events.emit(`${this.container.name}:submit`);
  }

  protected onInputChange(field: keyof T, value: string): void {
    this.events.emit(`${this.container.name}.${String(field)}:change`, {
      field,
      value,
    });
  }

  set valid(value: boolean) {
    this.submitElement.disabled = !value;
  }

  set errors(value: string) {
    this.setText(this.errorsElement, value || ""); // защита от undefined
  }
  //Рендер формы
  render(state: Partial<T> & IForm) {
    const { valid, errors, ...inputs } = state;
    super.render({ valid, errors });
    Object.assign(this, inputs);
    return this.container;
  }
}
