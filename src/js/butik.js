import { cart, addToCart, connectButtons } from "./cart.js";

const siteCart = document.getElementById("mini-cart-window");
const button = document.getElementById("cart-button");
const cartBackButton = document.getElementById("cart-back-btn");
const container = document.querySelector(".product-container");

button.addEventListener("click", () => {
  siteCart.classList.toggle("active"); // toggles the class on/off
});

cartBackButton.addEventListener("click", () => {
  siteCart.classList.toggle("active"); // toggles the class on/off
});

async function getData() {
  const url = "./src/js/products.json";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const res = await response.json();

    console.log(res);

    res.forEach((p) => {
      if (p.category === "jewelery") {
        const el = document.createElement("div");
        el.innerHTML = `
          <div class="box">
            <img src=${p.image} alt="Produkt" />
          </div>
          <div class="product-row">
            <div class="text-column">
              <h3>${p.title}</h3>
              <p class="price">${(Number(p.price) * 10).toFixed(2)}kr</p>

            </div>
            <i class="bi bi-cart-plus"></i>

    `;
        el.classList.add("product-box");
        container.appendChild(el);
      }
    });

    connectButtons();
  } catch (error) {
    console.error(error.message);
  }
}

getData();
