import { EventEmitter } from "../base/Events";
import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { IForm } from "../../types";
//Базовый класс для форм
export class Form<T> extends Component<IForm> {
  protected buttonElement: HTMLButtonElement;
  protected _errors: HTMLElement;
  protected events: EventEmitter;
  //Конструктор формы
  constructor(container: HTMLFormElement, events: EventEmitter) {
    super(container as HTMLElement);
    this.events = events;
    // Проверка типа контейнера
    if (!(container instanceof HTMLFormElement)) {
      throw new Error("Контейнер должен быть HTMLFormElement");
    }
    // Получение ключевых элементов формы
    this.buttonElement = ensureElement<HTMLButtonElement>(
      "button[type=submit]",
      this.container
    );

    this._errors = ensureElement(".form__errors", this.container);
    // Обработчик ввода данных
    this.container.addEventListener("input", (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (!target.name) return;
      const field = target.name as keyof T;
      const value = target.value;
      this.inputChange(field, value);
    });
    // Обработчик отправки формы
    this.container.addEventListener("submit", (e: Event) => {
      e.preventDefault();
      const form = this.container as HTMLFormElement;
      this.events.emit(`${form.name}:submit`);
    });
    // Дополнительная ссылка на кнопку отправки
    this._submit = ensureElement<HTMLButtonElement>(
      "button[type=submit]",
      this.container
    );
  }
  //Обрабатываем изменение значения поля формы
  protected inputChange(field: keyof T, value: string) {
    const form = this.container as HTMLFormElement;
    this.events.emit(`${form.name}.${String(field)}:change`, {
      field,
      value,
    });
  }
  // Дополнительная ссылка на кнопку отправки (дублирует buttonElement)
  protected _submit: HTMLButtonElement;
  //Устанавливаем состояние валидности формы
  set valid(value: boolean) {
    this._submit.disabled = !value;
  }

  set errors(list: string[]) {
    this.setText(this._errors, list.join(", "));
  }

  render(state: Partial<T> & IForm) {
    const { valid, errors, ...inputs } = state;
    super.render({ valid, errors });
    Object.assign(this, inputs);
    return this.container;
  }
}
