import { ICardActions, ICard } from "../../types";
import { EventEmitter } from "../base/Events";
import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

//Компонент карточки товара

export class CardProduct extends Component<ICard> {
  protected events: EventEmitter; // Эмиттер событий для внутренней коммуникации
  protected titleElement: HTMLElement; // Элемент для отображения названия товара
  protected priceElement: HTMLElement; // Элемент для отображения цены товара
  protected buttonElement: HTMLButtonElement | null = null; // Кнопка действия (может отсутствовать)

  //Конструктор компонента карточки товара

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container); // Инициализация базового класса

    this.events = new EventEmitter(); // Создание эмиттера событий

    // Получение DOM-элементов внутри карточки
    this.titleElement = ensureElement(".card__title", this.container); // Заголовок товара
    this.priceElement = ensureElement(".card__price", this.container); // Цена товара

    // Поиск кнопки действия: сначала основная кнопка, затем кнопка удаления
    const button = this.container.querySelector(".card__button");
    const deleteButton = this.container.querySelector(".basket__item-delete");
    this.buttonElement = (button || deleteButton) as HTMLButtonElement | null;

    // Настройка обработчика клика, если передан action
    if (actions?.onClick) {
      container.addEventListener("click", (event: MouseEvent) => {
        if (this.buttonElement) {
          // Проверяем, что клик был по кнопке или внутри неё
          if (
            event.target === this.buttonElement ||
            (this.buttonElement.contains(event.target as Node) &&
              event.currentTarget !== this.buttonElement)
          ) {
            actions.onClick(event); // Вызываем обработчик при клике по кнопке
          }
        } else {
          // Если кнопки нет, обрабатываем клик по всей карточке
          actions.onClick(event);
        }
      });
    }
  }

  //Сеттер для установки названия товара
  set title(value: string) {
    this.setText(this.titleElement, value); // Обновляем текст в элементе заголовка
  }

  //Сеттер для установки цены товара

  set price(value: number | null) {
    // Формируем текстовое представление цены
    this.setText(this.priceElement, value ? `${value} синапсов` : "Бесценно");

    // Если цена отсутствует (null) и кнопка есть, блокируем её
    if (this.buttonElement && !value) {
      this.setDisabled(this.buttonElement, true);
    }
  }
}
