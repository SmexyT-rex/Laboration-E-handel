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

export let cart = [];

export function addToCart(productId) {
  let matchingItem = cart.find((item) => item.productId === productId);

  if (matchingItem) {
    matchingItem.quantity += 1;
  } else {
    cart.push({
      productId,
      quantity: 1,
    });
  }

  cart.forEach((item) => {
    const productToRender = productArray.find(
      (product) => product.id === item.productId
    );
    console.log("Render:", productToRender, "Quantity:", item.quantity);
  });
}
