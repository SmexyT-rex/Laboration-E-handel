export async function postCurrentCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  const apiCart = {
    userId: 1,
    products: cart.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    })),
  };

  const response = await fetch("https://fakestoreapi.com/carts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(apiCart),
  });

  if (!response.ok) throw new Error("Failed to create cart");

  const data = await response.json();
  return data;
}
