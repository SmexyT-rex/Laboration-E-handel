//store.js

import { cart, addToCart, connectButtons } from "./cart.js";

const siteCart = document.getElementById("mini-cart-window");
const button = document.getElementById("cart-button");
const cartBackButton = document.getElementById("cart-back-btn");
const container = document.getElementById("product-container");

button.addEventListener("click", () => {
  siteCart.classList.toggle("active"); // toggles the class on/off
});

cartBackButton.addEventListener("click", () => {
  siteCart.classList.toggle("active"); // toggles the class on/off
});

async function getData() {
  const url = "js/products.json";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const res = await response.json();

    res.forEach((p) => {
      const el = document.createElement("div");
      el.innerHTML = `
      <h3>${p.title}</h3>
      <img src="${p.image}" alt="${p.title}">
      <p class="price">Pris: ${p.price.toFixed(2)} €</p>
      <p><button class="js-add-to-cart" data-product-id="${
        p.id
      }">Add to Cart</button></p>
    `;
      el.classList.add("card");
      container.appendChild(el);
    });

    connectButtons();
  } catch (error) {
    console.error(error.message);
  }
}

getData();
