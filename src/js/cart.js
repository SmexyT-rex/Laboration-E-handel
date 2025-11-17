export function connectButtons() {
  const buttonsArray = document.querySelectorAll(".js-add-to-cart");

  buttonsArray.forEach((button) => {
    button.addEventListener("click", () => {
      addToCart(parseInt(button.dataset.productId));
    });
  });
}

export function fetchCart() {
  let gurka = (cart = { id: 1, userId: 1, products: [] });
  fetch("https://fakestoreapi.com/carts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cart),
  })
    .then((response) => response.json())
    .then((data) => console.log(data));
}

export let cart = [];

export function addToCart(productId) {
  let matchingItem;

  cart.forEach((item) => {
    if (productId === item.productId) {
      matchingItem = item;
    }
  });

  if (matchingItem) {
    matchingItem.quantity += 1;
  } else {
    cart.push({
      productId: productId,
      quantity: 1,
    });
  }

  let cartQuantity = 0;

  cart.forEach((item) => {
    cartQuantity += item.quantity;
  });
  document.querySelector(".js-cart-quantity").innerHTML = cartQuantity;
}
