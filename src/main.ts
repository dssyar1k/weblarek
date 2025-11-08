import "./scss/styles.scss";
import { EventEmitter } from "./components/base/Events";
import { API_URL, CDN_URL, settings } from "./utils/constants";
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
import { ContactsForm } from "./components/view/ContactsForm";
import { SuccessOrder } from "./components/view/SuccessOrder";
import { CardCart } from "./components/view/CardCart";
import { ProductsModel } from "./components/Models/productsModel";
import { ensureElement, cloneTemplate } from "./utils/utils";

//Типы
import {
  IProduct,
  PaymentMethod,
  IFormOrder,
  IBuyer,
  IFormContactsData,
} from "./types";
import { FormOrder } from "./components/view/OrderForm";
import { BuyerModel } from "./components/Models/buyerModel";
//Инициализация глобального эмиттера событий
const events = new EventEmitter();
//Создание экземпляра API‑клиента для взаимодействия с сервером
const api = new WebLarekApi(CDN_URL, API_URL);
const header = new Header(document.body, events);

//Инициализация основных UI‑компонентов
const gallery = new Gallery(document.body, events);
const productsModel = new ProductsModel(events);
const modalContainer = document.querySelector(".modal") as HTMLElement;
const pageWrapper = ensureElement(".page__wrapper") as HTMLElement;
// Инициализация модального окна
const modal = new Modal(modalContainer, events);

//Загрузка шаблонов компонентов из DOM по идентификаторам
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>(
  settings.templates.cardCatalog
);
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>(
  settings.templates.cardPreview
);
const cardCartTemplate = ensureElement<HTMLTemplateElement>(
  settings.templates.cardCart
);
const cartTemplate = ensureElement<HTMLTemplateElement>(
  settings.templates.cart
);
const orderTemplate = ensureElement<HTMLTemplateElement>(
  settings.templates.order
);
const contactsTemplate = ensureElement<HTMLTemplateElement>(
  settings.templates.contacts
);
const successTemplate = ensureElement<HTMLTemplateElement>(
  settings.templates.success
);

//Инициализация моделей данных
const cartModel = new CartModel(events);
const buyerModel = new BuyerModel(events);
//Создание экземпляров компонентов интерфейса на основе шаблонов
const cartContainer = cloneTemplate<HTMLElement>(cartTemplate);
const orderContainer = cloneTemplate<HTMLFormElement>(orderTemplate);
const contactsContainer = cloneTemplate<HTMLFormElement>(contactsTemplate);
//Инициализация экрана успеха с обработчиком закрытия
const success = new SuccessOrder(cloneTemplate(successTemplate), {
  onClick: () => {
    modal.close();
  },
});
//Создание экземпляров UI‑компонентов
const cart = new Cart(cartContainer, events);
const formOrder = new FormOrder(orderContainer, events);
const contactsForm = new ContactsForm(contactsContainer, events);

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
    const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), {
      onClick: () => {
        events.emit("card:select", item);
      },
    });
    return card.render(item);
  });
});

//Обработчик выбора товара
events.on("card:select", (item: IProduct) => {
  // Логика при выборе карточки
  productsModel.setPreview(item);
});
//Обработчик изменения предварительного просмотра товара
events.on("preview:changed", (item: IProduct) => {
  //Вспомогательная функция для отображения карточки товара в модальном окне
  const showItem = (item: IProduct) => {
    //Создаём экземпляр карточки товара для предпросмотра
    const cardPreview = new CardPreview(cloneTemplate(cardPreviewTemplate), {
      onClick: () => {
        // Проверяем, есть ли товар в корзине
        if (cartModel.hasItem(item.id)) {
          // Если есть — удаляем из корзины
          cartModel.removeProduct(item.id);
        } else {
          // Если нет — добавляем в корзину
          cartModel.addProduct(item);
        }
        // Обновляем превью товара в модели (может изменить состояние кнопки)
        productsModel.setPreview(item);
      },
    });
    // Отображаем карточку товара в модальном окне
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
  };
  /**
   * Логика обработки события:
   * - Если item передан (не null/undefined) — показываем карточку товара
   * - Если item не передан — закрываем модальное окно
   */
  if (item) {
    showItem(item);
  } else {
    modal.close();
  }
});
//Обработчик выбора товара
events.on("card:select", (item: IProduct) => {
  productsModel.setPreview(item);
});
// Обработчик изменения состояния корзины (добавление/удаление товара)
events.on("basket:change", () => {
  // Обновляем счётчик товаров в шапке сайта
  header.counter = cartModel.getTotalCount();
  // Получаем массив товаров из модели корзины
  const itemsArray = Array.from(cartModel.getProducts().values());
  // Формируем список карточек товаров для отображения в корзине
  cart.items = itemsArray.map((item, index) => {
    // Создаём карточку товара с обработчиком удаления
    const card = new CardCart(cloneTemplate(cardCartTemplate), {
      onClick: () => {
        cartModel.removeProduct(item.id);
      },
    });
    // Рендерим карточку товара
    const element = card.render({
      id: item.id,
      title: item.title,
      price: item.price,
    });

    // Устанавливаем порядковый номер товара в корзине (начиная с 1)
    const indexElement = element.querySelector(".basket__item-index");
    if (indexElement) {
      indexElement.textContent = String(index + 1);
    }

    return element;
  });

  // Обновляем общую сумму товаров в корзине
  cart.total = cartModel.getTotal();
});
// Обработчик открытия корзины — отображает корзину в модальном окне
events.on("basket:open", () => {
  modal.render({
    content: cart.render(),
  });
});
// Обработчик открытия модального окна — блокирует фон страницы
events.on("modal:open", () => {
  pageWrapper.classList.add("page__wrapper_locked");
});
// Обработчик закрытия модального окна — снимает блокировку фона
events.on("modal:close", () => {
  pageWrapper.classList.remove("page__wrapper_locked");
});
// Обработчик открытия формы заказа — отображает форму в модальном окне
events.on("order:open", () => {
  modal.render({
    content: formOrder.render({
      payment: undefined,
      address: "",
      valid: false,
      errors: [],
    }),
  });
});
// Обработчик изменений в полях формы заказа (регулярное выражение для всех полей заказа)
events.on(
  /^order\..*:change/,
  ({ field, value }: { field: keyof IFormOrder; value: string }) => {
    buyerModel.setData(field, value as PaymentMethod);
  }
);
// Обработчик изменений в полях контактной формы (регулярное выражение для полей контактов)
events.on(
  /^contacts\..*:change/,
  ({ field, value }: { field: keyof IFormContactsData; value: string }) => {
    buyerModel.setData(field as keyof (IFormOrder & IFormContactsData), value);
  }
);
// Обработчик обновления данных покупателя — синхронизирует форму заказа с моделью
events.on("buyer:data:updated", () => {
  //Проверяем валидность формы заказа (отсутствие ошибок для payment и address)
  const orderValid =
    !buyerModel.formErrors.payment && !buyerModel.formErrors.address;

  //Собираем массив сообщений об ошибках
  const orderErrors = Object.values({
    payment: buyerModel.formErrors.payment,
    address: buyerModel.formErrors.address,
  }).filter((e): e is string => Boolean(e));

  // Обновляем отображение формы заказа
  formOrder.render({
    payment: buyerModel.buyerData.payment,
    address: buyerModel.buyerData.address,
    valid: orderValid,
    errors: orderErrors,
  });
});
// Обработчик ошибок валидации — обновляет состояние форм при наличии ошибок
events.on(
  "validation:error",
  (errors: Partial<IFormOrder & IFormContactsData>) => {
    const { payment, address, email, phone } = errors;

    // Обновляем состояние формы заказа
    formOrder.valid = !payment && !address;
    formOrder.errors = [payment, address]
      .filter(Boolean)
      .filter((error) => typeof error === "string");

    contactsForm.valid = !email && !phone;
    contactsForm.errors = [phone, email]
      .filter(Boolean)
      .filter((error) => typeof error === "string");
  }
);

events.on("order:submit", () => {
  modal.render({
    content: contactsForm.render({
      email: "",
      phone: "",
      valid: false,
      errors: [],
    }),
  });
});

events.on("formErrors:change", (errors: Partial<IBuyer>) => {
  const { payment, address, email, phone } = errors;
  formOrder.valid = !payment && !address;
  formOrder.errors = Object.values({ payment, address }).filter(
    (i): i is string => !!i
  ); // Фильтр + тип-гард

  contactsForm.valid = !email && !phone;
  contactsForm.errors = Object.values({ phone, email }).filter(
    (i): i is string => !!i
  );
});

events.on("contacts:submit", () => {
  const order = {
    ...buyerModel.buyerData,
    total: cartModel.getTotal(),
    items: Array.from(cartModel.getProducts().keys()),
  };
  api
    .createOrder(order)
    .then((result) => {
      modal.render({
        content: success.render({
          total: result.total,
        }),
      });

      cartModel.clearCart();
      buyerModel.clear();
    })
    .catch((err) => {
      console.error(err);
    });
});

api
  .getProducts()
  .then(productsModel.setProducts.bind(productsModel))
  .catch((err) => {
    console.error("Ошибка загрузки товаров:", err);
  });
