const cart = document.getElementById("mini-cart");
const button = document.getElementById("js-button");
const miniCartButton = document.getElementById("mini-cart-btn");

button.addEventListener("click", () => {
  cart.classList.toggle("active"); // toggles the class on/off
});

miniCartButton.addEventListener("click", () => {
  cart.classList.toggle("active"); // toggles the class on/off
});
