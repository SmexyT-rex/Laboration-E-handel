const siteCart = document.getElementById("mini-cart-window");
const button = document.getElementById("cart-button");
const cartBackButton = document.getElementById("cart-back-btn");
const container = document.querySelector(".product-container");
const miniCartProducts = document.getElementById(
  "mini-cart-products-container"
);
let productArray = [];

button.addEventListener("click", () => {
  siteCart.classList.toggle("active"); // toggles the class on/off
});

cartBackButton.addEventListener("click", () => {
  siteCart.classList.toggle("active"); // toggles the class on/off
});

/* Function that fetches data from the API */

async function getData() {
  try {
    const response = await fetch("src/js/products.json");
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const res = await response.json();

    productArray = res;

    console.log(productArray);

    productArray.forEach((p) => {
      const el = document.createElement("div");
      el.innerHTML = `
        <div class="box">
          <img src="${p.image}" alt="Produkt" />
        </div>
        <div class="product-row">
          <div class="text-column">
            <h3>${p.title}</h3>
            <p class="price">${(Number(p.price) * 10).toFixed(2)}kr</p>
          </div>
          <button class="js-add-to-cart" data-productid="${p.id}">
            <i class="bi bi-cart-plus"></i>
          </button>
        </div>
      `;
      el.classList.add("product-box");
      container.appendChild(el);
    });

    connectButtons();
  } catch (error) {
    console.error(error.message);
  }
}
getData();

let cart = [];

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
const miniCartProductContainer = document.getElementById(
  "mini-cart-products-container"
);

export function connectButtons() {
  const buttonsArray = document.querySelectorAll(".js-add-to-cart");

  buttonsArray.forEach((button) => {
    button.addEventListener("click", () => {
      const id = Number(button.dataset.productid);
      console.log(id);
      addToCart(id);
    });
  });
}

export async function addToCart(productId) {
  let matchingItem = cart.find((item) => item.productId === productId);

  if (matchingItem) {
    matchingItem.quantity += 1;
  } else {
    cart.push({ productId, quantity: 1 });
  }

  miniCartProductContainer.innerHTML = "";

  cart.forEach((item) => {
    const cartItem = productArray.find(
      (product) => product.id === item.productId
    );

    const el = document.createElement("div");
    el.innerHTML = `
      <img id="mini-cart-product-image" src="${
        cartItem.image
      }" alt="Produktbild" />
      <section>
        <h1>${cartItem.title}</h1>
        <p id="mini-cart-product-price">${(Number(cartItem.price) * 10).toFixed(
          2
        )}</p>
        <p id="mini-cart-quantity">Antal:</p>
        <div id="mini-cart-actions">
          <button id="mini-cart-remove-product"></button>
          <button id="mini-cart-add-product"></button>
        </div>
        <p id="article-number">Art.nr: 1234567890</p>
        <p id="mini-cart-stock-status">I lager</p>
      </section>
    `;
    el.classList.add("product-rect");
    miniCartProductContainer.appendChild(el);
  });
}
