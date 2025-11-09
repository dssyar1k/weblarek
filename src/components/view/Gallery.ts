import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IGallery } from "../../types";

//Компонент галереи товара
export class Gallery extends Component<IGallery> {
  protected catalogElement: HTMLElement;
  //Конструктор компонента галереи
  constructor(container: HTMLElement) {
    super(container);
    // Получаем контейнер для отображения каталога товаров
    this.catalogElement = ensureElement(".gallery");
  }
  //Сеттер для обновления содержимого галереи
  set catalog(items: HTMLElement[]) {
    this.catalogElement.replaceChildren(...items);
  }
}
