import { CardProduct } from "./CardProduct";
import { ICardActions, categoryProduct } from "../../types";
import { ensureElement } from "../../utils/utils";
//Компонент карточки товара для каталога
export class CardCatalog extends CardProduct {
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;
  //Конструктор компонента карточки каталога
  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);
    // Получаем DOM‑элементы внутри карточки
    this.categoryElement = ensureElement(".card__category", this.container);
    this.imageElement = ensureElement(
      ".card__image",
      this.container
    ) as HTMLImageElement;
    // Подключаем обработчик клика, если он передан
    if (actions?.onClick) {
      this.container.addEventListener("click", actions.onClick);
    }
  }
  //Сеттер для установки категории товара
  set category(value: categoryProduct) {
    this.setText(this.categoryElement, value);
    // Динамическое переключение классов в зависимости от категории
    this.toggleClass(
      this.categoryElement,
      "card__category_soft",
      value === "софт-скил"
    );
    this.toggleClass(
      this.categoryElement,
      "card__category_other",
      value === "другое"
    );
    this.toggleClass(
      this.categoryElement,
      "card__category_additional",
      value === "дополнительное"
    );
    this.toggleClass(
      this.categoryElement,
      "card__category_button",
      value === "кнопка"
    );
    this.toggleClass(
      this.categoryElement,
      "card__category_hard",
      value === "хард-скил"
    );
  }
  //Сеттер для установки изображения товара
  set image(value: string) {
    this.setImage(this.imageElement, value, this.title);
  }
}
