import "./scss/styles.scss";
import { IEvents, EventEmitter } from "./components/base/Events";
import { ProductsModel } from "./components/Models/productsModel";
import { BuyerModel } from "./components/Models/buyerModel";
import { CartModel } from "./components/Models/cartModel";
import { apiProducts } from "./utils/data";
import { API_URL, CDN_URL } from "./utils/constants";
import { Api } from "./components/base/Api";
import { IProduct } from "./types";
import { WebLarekApi } from "./components/WebLarekApi/WebLarekApi";

const events = new EventEmitter();
const api = new WebLarekApi(CDN_URL, API_URL);
const productsModel = new ProductsModel(events);
productsModel.setProducts(apiProducts.items);
console.log("Массив товаров из каталога:", productsModel.getProducts());

//Тест модели пользователя
const buyerModel = new BuyerModel(events);
buyerModel.setData("email", "test@example.ru");
buyerModel.setData("phone", "+79151239854");
buyerModel.setData("address", "г. Москва, ул. Пушкина, д. 13");
buyerModel.setData("payment", "card");

console.log("Данные покупателя:", buyerModel.getBuyerData());

//Тест модели корзины
// Создание тестового продукта
const cartModel = new CartModel(events);
const testProduct: IProduct = {
  id: "1",
  description: "Тестовое описание",
  image: "image1.jpg",
  title: "Тестовый товар 1",
  category: "Тестовая категория",
  price: 1000,
};

const testProductsec: IProduct = {
  id: "2",
  description: "Тестовое описание",
  image: "image2.jpg",
  title: "Тестовый товар 2",
  category: "Тестовая категория",
  price: 2000,
};

// Тесты
console.log("Начальная корзина:", cartModel.getItems()); 
console.log("Количество товаров:", cartModel.getTotalCount()); 
console.log("Есть ли товар №1?", cartModel.hasItem("1")); 
console.log("Общая сумма:", cartModel.getTotal()); 

//Тест добавления товара
cartModel.addProduct(testProduct);
console.log("После добавления товара №1:", cartModel.getItems());
console.log("Количество товаров:", cartModel.getTotalCount());
console.log("Есть ли товар №1?", cartModel.hasItem("1")); 
console.log("Общая сумма:", cartModel.getTotal());

// // Добавляем ещё товар
cartModel.addProduct(testProductsec);
console.log("После добавления товара №2:", cartModel.getItems());
console.log("Количество товаров:", cartModel.getTotalCount());
console.log("Есть ли товар №2?", cartModel.hasItem("2"));
console.log("Общая сумма:", cartModel.getTotal());

// Удаляем товар
cartModel.removeProduct("1");
console.log("После удаления товара №1:", cartModel.getItems());
console.log("Количество товаров:", cartModel.getTotalCount()); 
console.log("Есть ли товар №1?", cartModel.hasItem("1"));
console.log("Общая сумма:", cartModel.getTotal());


api
  .getProducts()
  .then(productsModel.setProducts.bind(productsModel))
  .catch((err) => {
    console.error("Ошибка загрузки товаров:", err);
  });

api
  .getProducts()
  .then((products: IProduct[]) => {
    if (!Array.isArray(products) || products.length === 0) {
      throw new Error("Массив продуктов пуст");
    }
    productsModel.setProducts(products);
    console.log("Полученные продукты:", productsModel.getProducts());
    console.log(
      "Первый продукт:",
      productsModel.getProductById(products[0].id)
    );
  })
  .catch((error: Error) => {
    console.error("Произошла ошибка при получении продуктов:", error.message);
  });

