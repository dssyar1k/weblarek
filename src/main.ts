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
import { IProduct, PaymentMethod, IBuyer } from "./types";
import { FormOrder } from "./components/view/OrderForm";
import { BuyerModel } from "./components/Models/buyerModel";

const events = new EventEmitter();

const api = new WebLarekApi(CDN_URL, API_URL);
const header = new Header(events, ensureElement<HTMLElement>(".header"));

const gallery = new Gallery(ensureElement<HTMLElement>(".gallery"));
const productsModel = new ProductsModel(events);
const modalContainer = document.querySelector(".modal") as HTMLElement;
const modal = new Modal(modalContainer, events);

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

const cartModel = new CartModel(events);
const buyerModel = new BuyerModel(events);

const cartContainer = cloneTemplate<HTMLElement>(cartTemplate);
const orderContainer = cloneTemplate<HTMLFormElement>(orderTemplate);
const contactsContainer = cloneTemplate<HTMLFormElement>(contactsTemplate);

const success = new SuccessOrder(cloneTemplate(successTemplate), {
  onClick: () => {
    modal.close();
  },
});

const cart = new Cart(cartContainer, events);
const formOrder = new FormOrder(orderContainer, events);
const contactsForm = new ContactsForm(contactsContainer, events);

function updateButton(card: CardPreview, product: IProduct) {
  const cartcontent = cartModel.hasItem(product.id);
  if (!product.price) {
    card.button("Недоступно", true);
  } else if (cartcontent) {
    card.button("Удалить из корзины", false);
  } else {
    card.button("Купить", false);
  }
}

events.on("items:change", () => {
  const items = productsModel.getProducts().map((item) => {
    const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), {
      onClick: () => {
        events.emit("card:select", item);
      },
    });
    return card.render(item);
  });
  gallery.render({ catalog: items });
});

events.on("preview:changed", () => {
  // Получаем текущий товар для предпросмотра из модели
  const product = productsModel.getPreview();

  // Создаём новый экземпляр компонента предпросмотра товара
  const cardPreview = new CardPreview(
    cloneTemplate(cardPreviewTemplate),
    events
  );

  // Если товар доступен — отображаем его в модальном окне
  if (product) {
    // Рендерим компонент с данными товара и помещаем в модальное окно
    modal.render({
      content: cardPreview.render({ ...product }),
    });
    modal.open();
    // Обновляем состояние кнопки в компоненте предпросмотра
    updateButton(cardPreview, product);
  }
});

events.on("card:select", (item: IProduct) => {
  productsModel.setPreview(item);
});

events.on("preview:click", () => {
  const product = productsModel.getPreview();

  // Если предварительный просмотр пуст — выходим
  if (!product) return;

  // Проверяем наличие товара в корзине и выполняем соответствующее действие
  if (!cartModel.hasItem(product.id)) {
    cartModel.addProduct(product);
  } else {
    cartModel.removeProduct(product);
  }
  modal.close();
});

events.on("basket:open", () => {
  // Рендерим содержимое корзины и передаём его в модальное окно
  modal.render({
    content: cart.render(),
  });

  // Открываем модальное окно с содержимым корзины
  modal.open();
});

events.on("basket:change", () => {
  // Обновляем счётчик товаров в шапке
  header.counter = cartModel.getTotalCount();

  // Формируем список элементов корзины
  const itemsList = cartModel.getItems().map((product, index) => {
    // Создаём карточку товара для корзины с обработчиком удаления
    const card = new CardCart(cloneTemplate(cardCartTemplate), {
      onClick: () => {
        cartModel.removeProduct(product);
      },
    });

    // Устанавливаем порядковый номер товара в корзине (начиная с 1)
    card.index = index + 1;

    // Рендерим карточку товара и возвращаем полученный элемент
    return card.render(product);
  });

  // Получаем общую стоимость товаров в корзине
  const total = cartModel.getTotal();

  // Рендерим содержимое корзины с обновлёнными данными
  cart.render({
    itemsList,
    total,
  });
});

events.on(
  "buyer:data:change",
  (data: { field: keyof IBuyer; value: string }) => {
    // Получаем результаты валидации всех полей покупателя
    const { payment, address, email, phone } = buyerModel.validate();

    // Получаем актуальные данные покупателя из модели
    const buyerData = buyerModel.buyerData();

    // Если изменилось поле оплаты или адреса — обновляем форму заказа
    if (data.field === "payment" || data.field === "address") {
      formOrder.render({
        payment: buyerData.payment,
        address: buyerData.address,
        valid: !payment && !address,

        // Собираем сообщения об ошибках в одну строку через запятую
        errors: Object.values({ payment, address })
          .filter(Boolean) // Оставляем только непустые значения
          .join(", "),
      });
    }

    // Если изменилось email или телефон — обновляем форму контактов
    if (["email", "phone"].includes(data.field)) {
      contactsForm.render({
        email: buyerData.email,
        phone: buyerData.phone,
        valid: !email && !phone,

        // Собираем сообщения об ошибках в одну строку через запятую
        errors: Object.values({ email, phone })
          .filter(Boolean) // Оставляем только непустые значения
          .join(", "),
      });
    }
  }
);

events.on("order:open", () => {
  // Получаем результаты валидации полей оплаты и адреса
  const { payment, address } = buyerModel.validate();

  // Получаем актуальные данные покупателя
  const buyerData = buyerModel.buyerData();

  // Рендерим модальное окно с формой заказа
  modal.render({
    content: formOrder.render({
      // Передаём в форму текущие значения из модели
      payment: buyerData.payment,
      address: buyerData.address,

      // Устанавливаем валидность формы
      valid: !payment && !address,

      // Инициализируем поле ошибок пустой строкой (нет текущих ошибок)
      errors: "",
    }),
  });
});

events.on("form:change", (data: { field: keyof IBuyer; value: string }) => {
  // Обрабатываем изменение поля в форме заказа
  // В зависимости от имени поля обновляем соответствующее свойство в модели покупателя
  switch (data.field) {
    case "payment":
      // Устанавливаем метод оплаты (с явным приведением типа)
      buyerModel.setPayment(data.value as PaymentMethod);
      break;

    case "address":
      // Обновляем адрес доставки
      buyerModel.setAddress(data.value);
      break;

    case "email":
      // Обновляем email покупателя
      buyerModel.setEmail(data.value);
      break;

    case "phone":
      // Обновляем номер телефона покупателя
      buyerModel.setPhone(data.value);
      break;
  }
});

events.on("order:submit", () => {
  // Получаем результаты валидации контактных данных (email и телефона)
  const { email, phone } = buyerModel.validate();

  // Извлекаем актуальные данные покупателя из модели
  const buyerData = buyerModel.buyerData();

  // Рендерим модальное окно с формой контактов
  modal.render({
    content: contactsForm.render({
      // Передаём текущие значения email и телефона из модели
      email: buyerData.email,
      phone: buyerData.phone,

      // Определяем валидность формы
      valid: !email && !phone,

      // Инициализируем поле ошибок пустой строкой
      errors: "",
    }),
  });
});

events.on("contacts:submit", () => {
  // Формируем данные заказа на основе текущих моделей
  const dataOrder = {
    ...buyerModel.buyerData(),
    total: cartModel.getTotal(),
    items: cartModel.getItems().map((product) => product.id),
  };

  // Отправляем заказ на сервер через API
  api
    .createOrder(dataOrder)
    .then((result) => {
      modal.render({
        content: success.render({
          total: result.total,
        }),
      });
      // Очищаем корзину после успешного оформления заказа
      cartModel.clearCart();

      // Сбрасываем данные покупателя
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
