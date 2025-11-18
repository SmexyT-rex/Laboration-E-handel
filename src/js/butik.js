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

async function getData() {
  const url = "./src/js/products.json";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const res = await response.json();
    productArray = res;

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
            <button class="js-add-to-cart" data-productid=${
              p.id
            }><i class="bi bi-cart-plus"></i></button>

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

const API_BASE = "https://fakestoreapi.com/carts";
const USER_ID = 1;
let cart = [];
let cartId = null;

async function getOrCreateCart() {
  try {
    const response = await fetch(`${API_BASE}/user/${USER_ID}`);
    const data = await response.json();

    if (data.length > 0) {
      const latestCart = data[data.length - 1];
      cartId = latestCart.id;
      cart = latestCart.products.map((p) => ({
        productId: p.productId,
        quantity: p.quantity,
      }));
      console.log("Loaded existing cart:", cart);
    } else {
      const newCartPayload = { userId: USER_ID, products: [] };
      const createResponse = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCartPayload),
      });
      const newCart = await createResponse.json();
      cartId = newCart.id;
      cart = [];
      console.log("Created new empty cart:", newCart);
    }
  } catch (error) {
    console.error("Error getting or creating cart:", error);
  }
}
getOrCreateCart();
getData();

/* const API_BASE = "https://fakestoreapi.com/carts";
const USER_ID = 1; // your user

async function updateServerCart(cart) {
  // build the payload
  const payload = {
    userId: USER_ID,
    products: cart,
  };

  // send POST request to create a new cart
  const response = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  console.log("Server cart updated:", data);
  return data;
} */

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
  // 1️⃣ Update local cart
  let matchingItem = cart.find((item) => item.productId === productId);

  if (matchingItem) {
    matchingItem.quantity += 1;
  } else {
    cart.push({ productId, quantity: 1 });
  }

  // 2️⃣ Update mini cart DOM
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

  // 3️⃣ Sync cart to server
  const payload = {
    userId: USER_ID,
    products: cart,
  };

  try {
    let response;
    if (cartId) {
      // Update existing cart
      response = await fetch(`${API_BASE}/${cartId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      // Create a new cart if none exists
      response = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      cartId = data.id; // store cartId for future PUTs
      console.log("Created new cart:", data);
      return;
    }

    const data = await response.json();
    console.log("Updated cart:", data);
  } catch (error) {
    console.error("Error updating cart:", error);
  }
}

/* export function addToCart(productId) {
  let matchingItem = cart.find((item) => item.productId === productId);

  if (matchingItem) {
    matchingItem.quantity += 1;
  } else {
    cart.push({
      productId,
      quantity: 1,
    });
  }

  miniCartProductContainer.innerHTML = "";

  cart.forEach((item) => {
    const cartItem = productArray.find(
      (product) => product.id === item.productId
    );

    const el = document.createElement("div");
    el.innerHTML = `
        <img
          id="mini-cart-product-image"
          src="${cartItem.image}"
          alt="Produktbild"
        />

        <section>
          <h1>${cartItem.title}</h1>

          <p id="mini-cart-product-price">${(
            Number(cartItem.price) * 10
          ).toFixed(2)}</p>

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
} */
