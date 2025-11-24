import { postCurrentCart } from "./cart.js";
// -------------------------
// ELEMENTS
// -------------------------
const siteCart = document.getElementById("mini-cart-window");
const button = document.getElementById("cart-button");
const cartBackButton = document.getElementById("cart-back-btn");
const container = document.querySelector(".product-container");
const miniCartProductContainer = document.getElementById(
  "mini-cart-products-container"
);

// -------------------------
// STATE
// -------------------------
export let productArray = [];
export let cart = JSON.parse(localStorage.getItem("cart")) || [];

// -------------------------
// CART TOGGLING
// -------------------------
button.addEventListener("click", () => {
  siteCart.classList.toggle("active");
});

cartBackButton.addEventListener("click", () => {
  siteCart.classList.toggle("active");
});

// -------------------------
// FETCH PRODUCTS
// -------------------------
async function getData() {
  try {
    const response = await fetch("https://fakestoreapi.com/products");
    if (!response.ok) throw new Error(`Response status: ${response.status}`);
    const res = await response.json();
    productArray = res;

    renderProducts();
    connectButtons();
    renderCart();
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}

// -------------------------
// RENDER PRODUCTS
// -------------------------
function renderProducts() {
  container.innerHTML = ""; // clear container

  productArray.forEach((p) => {
    const el = document.createElement("div");
    el.classList.add("product-box");
    el.innerHTML = `
      <div class="box">
        <img src="${p.image}" alt="Produkt" />
      </div>
      <div class="product-row">
        <div class="text-column">
          <h3>${p.title}</h3>
          <p class="price">${(Number(p.price) * 10).toFixed(2)}kr</p>
        </div>
          <i class="bi bi-cart-plus js-add-to-cart" data-productid="${
            p.id
          }"></i>
              </div>
    `;
    container.appendChild(el);
  });
}

// -------------------------
// CONNECT ADD TO CART BUTTONS
// -------------------------
function connectButtons() {
  const buttonsArray = document.querySelectorAll(".js-add-to-cart");
  buttonsArray.forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.productid);
      addToCart(id);
    });
  });
}

// -------------------------
// ADD TO CART
// -------------------------
export function addToCart(productId) {
  const matchingItem = cart.find((item) => item.productId === productId);
  if (matchingItem) {
    matchingItem.quantity += 1;
  } else {
    cart.push({ productId, quantity: 1 });
  }
  renderCart();
  postCurrentCart();
}

// -------------------------
// REMOVE FROM CART
// -------------------------
function removeFromCart(productId) {
  cart = cart.filter((item) => item.productId !== productId);
  renderCart();
}

// -------------------------
// INCREASE / DECREASE QUANTITY
// -------------------------
function changeQuantity(productId, delta) {
  const item = cart.find((i) => i.productId === productId);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) removeFromCart(productId);

  renderCart();
  postCurrentCart();
}

// -------------------------
// RENDER CART
// -------------------------
export function renderCart() {
  miniCartProductContainer.innerHTML = "";
  const cartCounter = document.getElementById("cart-counter");
  const totalContainer = document.getElementById("mini-cart-total-container");
  const toCheckOutButton = document.querySelector("#to-checkout-container");
  let total = 0;

  if (cart.length === 0) {
    toCheckOutButton.style.display = "none";
    const emptyEl = document.createElement("div");
    cartCounter.style.display = "none";
    emptyEl.classList.add("empty-cart");
    emptyEl.innerHTML = `
      <p>Varukorgen är tom.</p>
      <p>Lägg till varor för att börja!</p>
    `;
    miniCartProductContainer.appendChild(emptyEl);
  } else {
    toCheckOutButton.style.display = "block";
    cartCounter.style.display = "block";
    cart.forEach((item) => {
      const cartItem = productArray.find((p) => p.id === item.productId);
      if (!cartItem) return;
      total += Number(cartItem.price) * 10 * item.quantity;

      const el = document.createElement("div");
      el.classList.add("product-rect", "added-animation");
      el.innerHTML = `
        <img id="mini-cart-product-image" src="${
          cartItem.image
        }" alt="Produktbild" />
        <section>
          <h1>${cartItem.title}</h1>
          <p class="mini-cart-product-price">${(
            Number(cartItem.price) * 10
          ).toFixed(2)}kr</p>
          <p class="mini-cart-quantity">Antal: ${item.quantity}</p>
          <div class="mini-cart-actions">
            <button id="mini-cart-remove-product"></button>
            <button id="mini-cart-add-product"></button>
          </div>
          <p class="article-number">Art.nr: ${Math.floor(
            Math.random() * 10000000
          )}</p>
          <p class="mini-cart-stock-status">I lager</p>
        </section>
      `;

      const removeBtn = el.querySelector("#mini-cart-remove-product");
      const addBtn = el.querySelector("#mini-cart-add-product");

      removeBtn.addEventListener("click", () =>
        changeQuantity(item.productId, -1)
      );
      addBtn.addEventListener("click", () => changeQuantity(item.productId, 1));

      el.addEventListener("animationend", () =>
        el.classList.remove("added-animation")
      );

      miniCartProductContainer.appendChild(el);
    });
  }
  totalContainer.querySelector("p").textContent = `Totalt: ${total.toFixed(
    2
  )} kr`;

  localStorage.setItem("cart", JSON.stringify(cart));

  const checkoutBtn = document.getElementById("to-checkout-btn");
  checkoutBtn.addEventListener("click", () => {
    window.location.href = "kassa.html";
  });
}

// -------------------------
// INITIALIZE
// -------------------------

getData();
