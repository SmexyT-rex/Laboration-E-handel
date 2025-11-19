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
let productArray = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];

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
    const response = await fetch("src/js/products.json");
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
        <button class="js-add-to-cart" data-productid="${p.id}">
          <i class="bi bi-cart-plus"></i>
        </button>
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
function addToCart(productId) {
  const matchingItem = cart.find((item) => item.productId === productId);
  if (matchingItem) {
    matchingItem.quantity += 1;
  } else {
    cart.push({ productId, quantity: 1 });
  }
  renderCart();
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
}

// -------------------------
// RENDER CART
// -------------------------
function renderCart() {
  miniCartProductContainer.innerHTML = "";

  cart.forEach((item) => {
    const cartItem = productArray.find((p) => p.id === item.productId);
    if (!cartItem) return;

    const el = document.createElement("div");
    el.classList.add("product-rect", "added-animation");
    el.innerHTML = `
      <img class="mini-cart-product-image" src="${
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
        <p class="article-number">Art.nr: 1234567890</p>
        <p class="mini-cart-stock-status">I lager</p>
      </section>
    `;

    // Button events inside mini cart
    const removeBtn = el.querySelector("#mini-cart-remove-product");
    const addBtn = el.querySelector("#mini-cart-add-product");

    removeBtn.addEventListener("click", () =>
      changeQuantity(item.productId, -1)
    );
    addBtn.addEventListener("click", () => changeQuantity(item.productId, 1));

    // Animation cleanup
    el.addEventListener("animationend", () =>
      el.classList.remove("added-animation")
    );

    miniCartProductContainer.appendChild(el);
  });

  // Save cart to localStorage
  localStorage.setItem("cart", JSON.stringify(cart));
}

// -------------------------
// INITIALIZE
// -------------------------
getData();
