import "./scss/styles.scss";
import { EventEmitter } from "./components/base/Events";
import { API_URL, CDN_URL } from "./utils/constants";
import { WebLarekApi } from "./components/WebLarekApi/WebLarekApi";

//Модели данных
import { CartModel } from "./components/Models/cartModel";

//Компоненты отображения
import { Header } from "./components/view/Header";
import { Modal } from "./components/view/Modal";
import { Gallery } from "./components/view/Gallery";
import { CardCatalog } from "./components/view/CardCatalog";
import { CardPreview } from "./components/view/CardPreview";
import { Cart } from "./components/view/Cart";
//import { ContactsForm } from "./components/view/ContactsForm";
//import { SuccessOrder } from "./components/view/SuccessOrder";
import { CardCart } from "./components/view/CardCart";
import { ProductsModel } from "./components/Models/productsModel";
import { ensureElement, cloneTemplate } from "./utils/utils";

//Типы
import { IProduct, PaymentMethod, IFormOrder } from "./types";
import { FormOrder } from "./components/view/OrderForm";
import { BuyerModel } from "./components/Models/buyerModel";

const events = new EventEmitter();
const api = new WebLarekApi(CDN_URL, API_URL);
const header = new Header(document.body, events);
const gallery = new Gallery(document.body, events);
const productsModel = new ProductsModel(events);
const modalContainer = document.querySelector(".modal") as HTMLElement;
const pageWrapper = ensureElement(".page__wrapper") as HTMLElement;
if (!modalContainer) {
  console.error("Контейнер модального окна не найден в DOM");
  throw new Error("Контейнер модального окна не найден");
}

const modal = new Modal(modalContainer, events);

class TemplateManager {
  private templates: Map<string, HTMLElement> = new Map();

  /**
   * Получает шаблон по идентификатору
   */
  get(id: string): HTMLElement {
    if (this.templates.has(id)) {
      return this.templates.get(id)!;
    }

    const element = ensureElement(`#${id}`);
    this.templates.set(id, element);
    return element;
  }

  //Специализированные геттеры для основных шаблонов

  get cardCatalog(): HTMLTemplateElement {
    return this.get("card-catalog") as HTMLTemplateElement;
  }

  get cardPreview(): HTMLTemplateElement {
    return this.get("card-preview") as HTMLTemplateElement;
  }

  get cardCart(): HTMLTemplateElement {
    return this.get("card-basket") as HTMLTemplateElement;
  }

  get cart(): HTMLTemplateElement {
    return this.get("basket") as HTMLTemplateElement;
  }

  get orderForm(): HTMLTemplateElement {
    return this.get("order") as HTMLTemplateElement;
  }

  get contactsForm(): HTMLTemplateElement {
    return this.get("contacts") as HTMLTemplateElement;
  }

  get success(): HTMLTemplateElement {
    return this.get("success") as HTMLTemplateElement;
  }
}

// Единый экземпляр менеджера шаблонов
export const templates = new TemplateManager();
const cartContainer = cloneTemplate<HTMLElement>(templates.cart);
const cartModel = new CartModel(events);
const buyerModel = new BuyerModel(events);
const orderContainer = cloneTemplate<HTMLFormElement>(templates.orderForm);
/*const contactsContainer = cloneTemplate<HTMLFormElement>(
  templates.contactsForm
);*/
//const successContainer = cloneTemplate<HTMLElement>(templates.success);
const cart = new Cart(cartContainer, events);
const formOrder = new FormOrder(orderContainer, events);

// Обработчик загрузки товаров с защитой от undefined
events.on("items:change", (event: unknown) => {
  // Проверяем, что event — объект и имеет поле items
  if (!event || typeof event !== "object" || !("items" in event)) {
    console.warn(
      "Событие 'items:change' получено с некорректными данными",
      event
    );
    return;
  }
  const items = (event as { items: IProduct[] }).items;
  if (!items || items.length === 0) {
    console.warn("Нет товаров для отображения");
    return;
  }
  gallery.catalog = items.map((item) => {
    const card = new CardCatalog(cloneTemplate(templates.cardCatalog), {
      onClick: () => {
        events.emit("card:select", item);
      },
    });
    return card.render(item);
  });
});
events.on("card:select", (item: IProduct) => {
  // Логика при выборе карточки
  productsModel.setPreview(item);
});
//
events.on("preview:changed", (item: IProduct) => {
  const cardPreview = new CardPreview(cloneTemplate(templates.cardPreview), {
    onClick: () => {
      if (cartModel.hasItem(item.id)) {
        cartModel.removeProduct(item.id);
      } else {
        cartModel.addProduct(item);
      }
      productsModel.setPreview(item);
    },
  });

  modal.render({
    content: cardPreview.render({
      id: item.id,
      title: item.title,
      image: item.image,
      price: item.price,
      category: item.category,
      description: item.description,
      button: cartModel.hasItem(item.id) ? "Удалить из корзины" : "В корзину",
    }),
  });
});

events.on("card:select", (item: IProduct) => {
  // Логика при выборе карточки
  console.log("Выбрана карточка:", item);
  // Например, открытие превью товара
  productsModel.setPreview(item);
});

events.on("basket:change", () => {
  header.counter = cartModel.getTotalCount();
  const cardCart = cartModel
    .getItems()
    .map(({ id }: { id: string }, index: number) => {
      const item = productsModel.getProducts().find((item) => item.id === id);
      if (!item) {
        console.warn(`Товар с id=${id} не найден в productsModel`);
        return null; // или выбросить ошибку, или вернуть заглушку
      }
      const card = new CardCart(cloneTemplate(templates.cardCart), {
        onClick: () => cartModel.removeProduct(item.id),
      });
      return card.render(item, index + 1);
    });

  modal.render({
    content: cart.render({
      items: cardCart,
      total: cartModel.getTotal(),
    }),
  });
});

events.on("basket:open", () => {
  modal.render({
    content: cart.render(),
  });
});

events.on("modal:open", () => {
  pageWrapper.classList.add("page__wrapper_locked");
});

events.on("modal:close", () => {
  pageWrapper.classList.remove("page__wrapper_locked");
});

events.on("order:open", () => {
  modal.render({
    content: formOrder.render({
      payment: undefined,
      adress: "",
      valid: false,
      errors: [],
    }),
  });
});

events.on(
  /^order\..*:change/,
  (data: { field: keyof IFormOrder; value: string }) => {
    // Обновляем модель
    buyerModel.setData(data.field, data.value as PaymentMethod);
  }
);

api
  .getProducts()
  .then((products) => {
    productsModel.setProducts(products);
  })
  .catch((err) => {
    console.error("Ошибка загрузки товаров:", err);
  });

/*
//Тест модели пользователя
const buyerModel = new BuyerModel(events);
buyerModel.setData('email', 'test@example.ru');
buyerModel.setData('phone', '+79151239854');
buyerModel.setData('address', 'г. Москва, ул. Пушкина, д. 13');
buyerModel.setData('payment', 'card');

console.log('Данные покупателя:', buyerModel.getBuyerData());

//Тест модели корзины
// Создание тестового продукта
const cartModel = new CartModel(events);
const testProduct: IProduct = {
  id: '1',
  description: 'Тестовое описание',
  image: 'image1.jpg',
  title: 'Тестовый товар 1',
  category: 'Тестовая категория',
  price: 1000,
};

const testProductsec: IProduct = {
  id: '2',
  description: 'Тестовое описание',
  image: 'image2.jpg',
  title: 'Тестовый товар 2',
  category: 'Тестовая категория',
  price: 2000,
};  
// Тесты
console.log('Начальная корзина:', cartModel.getItems());
console.log('Количество товаров:', cartModel.getTotalCount());
console.log('Есть ли товар №1?', cartModel.hasItem('1'));
console.log('Общая сумма:', cartModel.getTotal());

//Тест добавления товара
cartModel.addProduct(testProduct);
console.log('После добавления товара №1:', cartModel.getItems());
console.log('Количество товаров:', cartModel.getTotalCount());
console.log('Есть ли товар №1?', cartModel.hasItem('1'));
console.log('Общая сумма:', cartModel.getTotal());

// // Добавляем ещё товар
cartModel.addProduct(testProductsec);
console.log('После добавления товара №2:', cartModel.getItems());
console.log('Количество товаров:', cartModel.getTotalCount());
console.log('Есть ли товар №2?', cartModel.hasItem('2'));
console.log('Общая сумма:', cartModel.getTotal());

// Удаляем товар
cartModel.removeProduct('1');
console.log('После удаления товара №1:', cartModel.getItems());
console.log('Количество товаров:', cartModel.getTotalCount());
console.log('Есть ли товар №1?', cartModel.hasItem('1'));
console.log('Общая сумма:', cartModel.getTotal());


/*
api
  .getProducts()
  .then((products: IProduct[]) => {
    if (!Array.isArray(products) || products.length === 0) {
      throw new Error('Массив продуктов пуст');
    }
    productsModel.setProducts(products);
    console.log('Полученные продукты:', productsModel.getProducts());
    console.log(
      'Первый продукт:',
      productsModel.getProductById(products[0].id)
    );
  })
  .catch((error: Error) => {
    console.error('Произошла ошибка при получении продуктов:', error.message);
  });*/
