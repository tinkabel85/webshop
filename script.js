/* === Fetch the Products from json file === */
/* asynchronous function: the program will wait till the data is loaded and then proceed further  */
const getProducts = async () => {
  /* try and catch block to handle errors */
  try {
    const results = await fetch("products.json");
    const data = await results.json();
    const products = data.products;
    return products;
  } catch (err) {
    /* in case of failure to load the products data the error will be cought and displayed on console */
    console.log(err);
  }
};
/* getting access to DOM element with id ""products""*/
const productsWrapper = document.getElementById("products");
/* getting access to button "More" */
// const loadButton = document.querySelector(".load-btn");

let cart = [];
let cartTotal = 0;
function addToCart(id) {
  const productDom = document.querySelector(`[data-id=item-${id}]`);
  console.log("product Dom", productDom);
  const productInCart = {
    name: productDom.querySelector(".item-name").innerText,
    price: parseInt(productDom.querySelector(".price").innerText.substring(1)),
    quantity: parseInt(productDom.querySelector(".quantity").value),
  };

  let shippingMethod =
    document.querySelector("[name=method]:checked").value || "";
  console.log(shippingMethod);
  let shippingCost;
  switch (shippingMethod) {
    case "hermes":
      shippingCost = 3.99;
      break;
    case "dhl":
      shippingCost = 4.79;
      break;
    default:
      shippingCost = 0;
      break;
  }
  console.log("Ship costs", shippingCost);
  let totalItemPrice = productInCart.price * productInCart.quantity;
  console.log("totalItemPrice", totalItemPrice);
  estimate = "$" + (totalItemPrice + shippingCost).toFixed(2);
  productInCart.totalItemPrice = totalItemPrice;
  cart.push(productInCart);
  console.log("Cart", cart);
  const itemsInCart = cart.reduce((sum, obj) => {
    return sum + obj.quantity;
  }, 0);
  console.log("Items in cart", itemsInCart);
  const totalPrice = cart.reduce((sum, obj) => {
    return sum + obj.totalItemPrice;
  }, 0);
  document.getElementById("items-qnt").value = itemsInCart;
  document.getElementById("shipping-sum").value = "$" + shippingCost;
  document.getElementById("total-sum").value = "$" + totalPrice;
}

/* asynchronous function: the program will wait till DOM content has been loaded and then proceed further with displaying products  */
window.addEventListener("DOMContentLoaded", async function () {
  let products = await getProducts();
  products = products.filter((product) => product.category === "Motherboard");
  displayProductItems(products);
  // loadData();
});

/* === Display Products === */
/* arror function that received the array of items passed as a parameter, creates the new array with the nested div element containing the item data for each item.  */

const displayProductItems = (items) => {
  let displayProduct = items.map(
    (product) => `
      <div class="item" data-id="item-${product.id}">
        <div class="top d-flex">
          <img src=${product.url} alt="item image" />
          <div class="icon d-flex">
            <i class="bx bxs-heart"></i>
          </div>
        </div>
        <div class="bottom">
          <h4 class="item-name">${product.title}</h4>
          <div class="d-flex">
            <div class="price">$${product.price}</div>
              <input class="quantity" type="number" min="0" max="10" id="quantity" size="3" placeholder="0">
            <button onclick="addToCart(${product.id})" class="cart-btn" type="button" data-action="add-to-cart">Add to Cart</button>
          </div>
        </div>
      </div>
    </div>
        `
  );

  displayProduct = displayProduct.join("");
  productsWrapper.innerHTML = displayProduct;
};
function displayCart() {
  cartDom.style.display = "block";
  cartDom.innerHTML = "<div>Text</div>";
  productsWrapper.style.display = "none";
}
/* ==== Filter Products ==== */
let filters = document.querySelectorAll(".filters div");
filters = [...filters];
filters.forEach((filter) => {
  filters[1].classList.add("active");
  filter.addEventListener("click", async (e) => {
    const id = e.target.getAttribute("data-filter");
    const target = e.target;
    const items = await getProducts();
    filters.forEach((btn) => {
      btn.classList.remove("active");
    });
    target.classList.add("active");
    if (id === "All") {
      return displayProductItems(items);
    } else {
      let selection = items.filter((item) => {
        if (item.category === id) {
          return item;
        }
      });
      displayProductItems(selection);
    }
  });
});
