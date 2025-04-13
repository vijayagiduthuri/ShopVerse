// script.js

let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Save cart to localStorage
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

// Update cart count in navbar
function updateCartCount() {
  const count = cart.reduce((acc, item) => acc + item.quantity, 0);
  document.querySelectorAll("#cart-count").forEach(el => el.textContent = count);
}

// Add item to cart
function addToCart(button) {
  const card = button.closest(".product-card");
  const name = card.querySelector("h3").innerText;
  const price = parseFloat(card.querySelector(".price").innerText.replace("₹", "").replace(",", ""));

  const existing = cart.find(item => item.name === name);
  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ name, price, quantity: 1 });
  }

  saveCart();
  alert(`${name} added to cart`);
}

// Render items in cart.html
function renderCartItems() {
  const cartList = document.getElementById("cart-items-list");
  const emptyMsg = document.getElementById("empty-cart-message");
  const subtotalEl = document.getElementById("cart-subtotal");
  const totalEl = document.getElementById("cart-total");

  if (!cart.length) {
    emptyMsg.style.display = "block";
    cartList.innerHTML = "";
    subtotalEl.textContent = "₹0.00";
    totalEl.textContent = "₹0.00";
    return;
  }

  emptyMsg.style.display = "none";
  cartList.innerHTML = "";

  let subtotal = 0;

  cart.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <h4>${item.name}</h4>
      <p>Price: ₹${item.price}</p>
      <div class="quantity">
        <button onclick="decrementItem(${index})">−</button>
        <span>${item.quantity}</span>
        <button onclick="incrementItem(${index})">+</button>
        <button class="remove-btn" onclick="removeItem(${index})">Remove</button>
      </div>
    `;
    cartList.appendChild(div);
    subtotal += item.price * item.quantity;
  });

  subtotalEl.textContent = `₹${subtotal.toFixed(2)}`;
  totalEl.textContent = `₹${subtotal.toFixed(2)}`;
}

// Quantity control functions
function incrementItem(index) {
  cart[index].quantity++;
  saveCart();
  renderCartItems();
}

function decrementItem(index) {
  if (cart[index].quantity > 1) {
    cart[index].quantity--;
  } else {
    cart.splice(index, 1);
  }
  saveCart();
  renderCartItems();
}

function removeItem(index) {
  cart.splice(index, 1);
  saveCart();
  renderCartItems();
}

// Checkout page render
function renderCheckoutItems() {
  const list = document.getElementById("checkout-items");
  const subtotalEl = document.getElementById("checkout-subtotal");
  const totalEl = document.getElementById("checkout-total");

  if (!cart.length) {
    list.innerHTML = "<p>Your cart is empty.</p>";
    subtotalEl.textContent = "₹0.00";
    totalEl.textContent = "₹0.00";
    return;
  }

  list.innerHTML = "";
  let subtotal = 0;

  cart.forEach(item => {
    const div = document.createElement("div");
    div.className = "checkout-item";
    div.innerHTML = `
      <div class="item-name-quantity">${item.name} × ${item.quantity}</div>
      <div class="item-price">₹${(item.price * item.quantity).toFixed(2)}</div>
    `;
    list.appendChild(div);
    subtotal += item.price * item.quantity;
  });
  

  subtotalEl.textContent = `₹${subtotal.toFixed(2)}`;
  totalEl.textContent = `₹${subtotal.toFixed(2)}`;
}

// Handle order placement
function setupCheckoutForm() {
  const form = document.getElementById("checkout-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      alert("Order placed successfully!");
      cart = [];
      saveCart();
      window.location.href = "index.html";
    });
  }
}

// Init
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  if (document.getElementById("cart-items-list")) renderCartItems();
  if (document.getElementById("checkout-items")) renderCheckoutItems();
  setupCheckoutForm();
});

