import { postCurrentCart } from "./cart.js";

async function renderOrderSummary() {
  const container = document.getElementById("order-summary-product-container");
  container.innerHTML = "";

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    container.innerHTML = "<p>Varukorgen är tom.</p>";
    document.querySelector(".total").textContent = "Totalt: 0.00kr";
    return;
  }

  const response = await fetch("https://fakestoreapi.com/products");
  const products = await response.json();

  const detailedCart = cart.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    return {
      ...product,
      quantity: item.quantity,
    };
  });

  detailedCart.forEach((item) => {
    const el = document.createElement("div");
    el.classList.add("order-item");

    el.innerHTML = `
      <img src="${item.image}" alt="${item.title}" class="product-image" />
      <div class="product-details">
        <h4 class="product-title">${item.title}</h4>
        <p class="product-price">${(Number(item.price) * 10).toFixed(2)}kr</p>
      </div>
      <div class="quantity-controls">
        <button class="qty-btn decrease" data-id="${item.id}"></button>
        <span class="quantity">${item.quantity}</span>
        <button class="qty-btn increase" data-id="${item.id}"></button>
      </div>
    `;

    container.appendChild(el);
  });

  const total = detailedCart.reduce(
    (sum, item) => sum + item.price * 10 * item.quantity,
    0
  );

  document.querySelector(".total").textContent = `Total: ${total.toFixed(2)}kr`;
}

function setupQuantityButtons() {
  const container = document.getElementById("order-summary-product-container");

  container.addEventListener("click", (e) => {
    if (
      !e.target.classList.contains("increase") &&
      !e.target.classList.contains("decrease")
    )
      return;

    const productId = Number(e.target.dataset.id);
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let cartItem = cart.find((i) => i.productId === productId);

    if (!cartItem) return;

    if (e.target.classList.contains("increase")) {
      cartItem.quantity++;
    } else {
      cartItem.quantity--;
      if (cartItem.quantity <= 0) {
        cart = cart.filter((i) => i.productId !== productId);
      }
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    renderOrderSummary();
    postCurrentCart();
  });
}

async function initCheckout() {
  await renderOrderSummary();
  setupQuantityButtons();
  postCurrentCart();
}

initCheckout();

async function clearCart() {
  localStorage.removeItem("cart");

  try {
    const userId = 1;
    const response = await fetch(
      `https://fakestoreapi.com/carts/user/${userId}`
    );
    if (!response.ok) throw new Error("Failed to fetch user's carts");

    const userCarts = await response.json();
    if (!userCarts.length) return;

    const latestCartId = userCarts[userCarts.length - 1].id;

    const deleteResponse = await fetch(
      `https://fakestoreapi.com/carts/${latestCartId}`,
      {
        method: "DELETE",
      }
    );
    if (!deleteResponse.ok) throw new Error("Failed to delete API cart");

    await deleteResponse.json();
    renderOrderSummary();
  } catch (err) {
    console.error("Error clearing cart:", err);
  }
}

const clearCartBtn = document.querySelector(".clear-cart-btn");
clearCartBtn.addEventListener("click", clearCart);
