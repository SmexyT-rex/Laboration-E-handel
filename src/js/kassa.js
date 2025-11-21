async function renderOrderSummary() {
  const container = document.getElementById("order-summary-product-container");
  container.innerHTML = "";

  // 1. Get cart (contains only productId & quantity)
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    container.innerHTML = "<p>Your cart is empty.</p>";
    document.querySelector(".total").textContent = "Total: $0.00";
    return;
  }

  // 2. Fetch product list from API
  const response = await fetch("https://fakestoreapi.com/products");
  const products = await response.json();

  // 3. Merge cart items with product details
  const detailedCart = cart.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    return {
      ...product,
      quantity: item.quantity,
    };
  });

  // 4. Render each product
  detailedCart.forEach((item) => {
    const el = document.createElement("div");
    el.classList.add("order-item");

    el.innerHTML = `
      <img
        src="${item.image}"
        alt="${item.title}"
        class="product-image"
      />
      <div class="product-details">
        <h4 class="product-title">${item.title}</h4>
        <p class="product-price">${(Number(item.price) * 10).toFixed(2)}kr</p>
      </div>
      <div class="quantity-controls">
        <button class="qty-btn decrease">-</button>
        <span class="quantity">${item.quantity}</span>
        <button class="qty-btn increase">+</button>
      </div>
    `;

    container.appendChild(el);
  });

  // 5. Render total
  const total = detailedCart.reduce(
    (sum, item) => sum + item.price * 10 * item.quantity,
    0
  );

  document.querySelector(".total").textContent = `Total: ${total.toFixed(2)}kr`;
}

renderOrderSummary();
