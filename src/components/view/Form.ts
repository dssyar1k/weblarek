import { EventEmitter } from "../base/Events";
import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { IForm } from "../../types";

// Базовый класс для форм
export class Form<T> extends Component<IForm & T> {
  protected buttonElement: HTMLButtonElement; // Кнопка отправки формы
  protected _errors: HTMLElement; // Элемент для отображения ошибок валидации
  protected events: EventEmitter; // Эмиттер событий для коммуникации

  //Создаёт экземпляр формы
  constructor(container: HTMLFormElement, events: EventEmitter) {
    super(container as HTMLElement);
    this.events = events;

    // Проверяем, что контейнер действительно является формой
    if (!(container instanceof HTMLFormElement)) {
      throw new Error("Контейнер должен быть HTMLFormElement");
    }

    // Находим кнопку отправки и контейнер для ошибок в DOM
    this.buttonElement = ensureElement<HTMLButtonElement>(
      "button[type=submit]",
      this.container
    );
    this._errors = ensureElement(".form__errors", this.container);

    // Обработчик отправки формы (предотвращает стандартное поведение браузера)
    this.container.addEventListener("submit", (e) => {
      e.preventDefault();
      this.events.emit(`${(this.container as HTMLFormElement).name}:submit`);
    });

    // Обработчик изменений полей формы (эмитит событие при вводе)
    this.container.addEventListener("input", (e) => {
      const target = e.target as HTMLInputElement;
      const field = target.name as keyof T; // Имя поля как ключ типа T
      const value = target.value; // Значение поля
      this.inputChange(field, value);
    });
  }

  //Обрабатывает изменение значения поля формы
  protected inputChange(field: keyof T, value: string) {
    this.events.emit("form:change", { field, value });
  }

  //Устанавливает состояние валидности формы
  set valid(value: boolean) {
    this.buttonElement.disabled = !value;
  }
  //Отображает сообщения об ошибках валидации
  set errors(value: string) {
    this._errors.textContent = value.trim();
  }
}
