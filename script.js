// Fetch the Products from json file
// asynchronous function: the program will wait till the data is loaded and then proceed further
const getProducts = async () => {
  // try and catch block to handle errors
  try {
    const results = await fetch("products.json");
    const data = await results.json();
    const products = data.products;
    return products;
  } catch (err) {
    // in case of failure to load the products data the error will be cought and displayed on console
    console.log(err);
  }
};
// getting access to DOM element with id "products"
const productsWrapper = document.getElementById("products");
// getting access to button "Estimate Total"
const button = document.getElementById("btn-estimate");
// === Calculation of the order total sum ===
/* in case of the button click, the program will calculate the total order sum as well as shipping costs, 
total item in cart and total sum of all items */
button.addEventListener("click", (e) => {
  e.preventDefault();
  // calculation of shipping costs based on the selected shipping method
  let shippingMethod = document.querySelector("[name=method]:checked").value;
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

  const itemsInCart = cart.reduce((sum, obj) => {
    return sum + obj.quantity;
  }, 0);
  const totalItemsPrice = cart.reduce((sum, obj) => {
    return sum + obj.totalItemPrice;
  }, 0);
  const totalSum = shippingCost + totalItemsPrice;
  document.getElementById("items-qnt").value = itemsInCart;
  document.getElementById("shipping-sum").value = "$" + shippingCost;
  document.getElementById("total-sum").value = "$" + totalSum;
});

let cart = [];

function addToCart(id) {
  const productDom = document.querySelector(`[data-id=item-${id}]`);
  const productInCart = {
    name: productDom.querySelector(".item-name").innerText,
    price: parseInt(productDom.querySelector(".price").innerText.substring(1)),
    quantity: parseInt(productDom.querySelector(".quantity").value),
  };

  let totalItemPrice = productInCart.price * productInCart.quantity;
  productInCart.totalItemPrice = totalItemPrice;
  cart.push(productInCart);
  console.log("Cart", cart);
}

// Display Products
// asynchronous function: the program will wait till DOM content has been loaded and then proceed further with displaying products
window.addEventListener("DOMContentLoaded", async function () {
  let products = await getProducts();
  products = products.filter((product) => product.category === "Motherboard");
  displayProductItems(products);
});

/* arror function that received the array of items passed as a parameter, 
 creates the new array with the nested div element containing the item data for each item. */

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

//Filter Products
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
