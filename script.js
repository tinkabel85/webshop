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
/* getting access to DOM element with id products*/
const productsWrapper = document.getElementById("products");
/* getting access to button "More" */
const loadButton = document.querySelector(".load-btn");

let cart = [];
let cartTotal = 0;
function addToCart(id) {
  const productDom = document.querySelector(`[data-id=item-${id}]`);
  console.log("product Dom", productDom);
  const productInCart = {
    name: productDom.querySelector(".item-name").innerText,
    price: productDom.querySelector(".price").innerText,
    quantity: productDom.querySelector(".quantity").value,
  };
  console.log(productInCart);
  cart.push(productInCart);
  console.log(cart);
}

/* asynchronous function: the program will wait till DOM content has been loaded and then proceed further with displaying products  */
window.addEventListener("DOMContentLoaded", async function () {
  let products = await getProducts();
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

  // const addToCartBtnDom = document.querySelectorAll(".cart-btn");
  // addToCartBtnDom.forEach((btn) => {
  //   btn.addEventListener("click", (e) => {
  //     console.log(btn);
  //     const productDom = btn.parentNode.parentNode.parentNode;
  //     console.log("product Dom", productDom);
  //     const productInCart = {
  //       name: productDom.querySelector(".item-name").innerText,
  //       price: productDom.querySelector(".price").innerText,
  //       quantity: productDom.querySelector(".quantity").value,
  //     };
  //     console.log(productInCart);
  //     e.stopPropagation();
  //     cart.push(productInCart);
  //     console.log(cart);
  //   });
  // });
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
  filters[0].classList.add("active");
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
