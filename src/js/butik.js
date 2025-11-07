const cart = document.getElementById("mini-cart");
const button = document.getElementById("js-button");
const miniCartButton = document.getElementById("mini-cart-btn");
const container = document.getElementById("product-container");

button.addEventListener("click", () => {
  cart.classList.toggle("active"); // toggles the class on/off
});

miniCartButton.addEventListener("click", () => {
  cart.classList.toggle("active"); // toggles the class on/off
});

async function getData() {
  const url = "js/products.json";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const res = await response.json();
    console.log(res);

    res.forEach((p) => {
      const el = document.createElement("div");
      el.innerHTML = `
      <h3>${p.title}</h3>
      <img src="${p.image}" alt="${p.title}">
      <p class="price">Pris: ${p.price.toFixed(2)} €</p>
      <p><button>Add to Cart</button></p>
    `;
      el.classList.add("card");
      container.appendChild(el);
    });
  } catch (error) {
    console.error(error.message);
  }
}
getData();
