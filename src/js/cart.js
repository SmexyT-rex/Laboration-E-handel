import { cart } from "./butik.js";

export async function postCurrentCart() {
  // Create the API cart format
  const apiCart = {
    userId: 1,
    products: cart.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    })),
  };

  // Send it to the API
  const response = await fetch("https://fakestoreapi.com/carts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(apiCart),
  });

  if (!response.ok) {
    throw new Error("Failed to create cart");
  }

  // Return the created cart response
  const data = await response.json();
  console.log(data);
  return data;
}
