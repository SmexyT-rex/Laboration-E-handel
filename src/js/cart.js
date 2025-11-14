export function connectButtons() {
  const buttonsArray = document.querySelectorAll(".js-add-to-cart");

  buttonsArray.forEach((button) => {
    button.addEventListener("click", () => {
      addToCart(parseInt(button.dataset.productId));
    });
  });
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
