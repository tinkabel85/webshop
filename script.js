// (function () {
//   document.querySelector("#form").addEventListener("submit", estimateOrder);

//   function estimateOrder(event) {
//     event.preventDefault();
//     console.log("order sumbitted");
//   }
// })();

/* ========== Fetch the Products =========== */
const getProducts = async () => {
  try {
    const results = await fetch("products.json");
    const data = await results.json();
    const products = data.products;
    console.log(products);
    return products;
  } catch (err) {
    console.log(err);
  }
};
const productsWrapper = document.getElementById("products");

window.addEventListener("DOMContentLoaded", async function () {
  let products = await getProducts();
  // products = products.filter((product) => product.category === "Motherboard");
  console.log(products);
  displayProductItems(products);
  //   loadData();
});
/* ========== Display Products =========== */
const displayProductItems = (items) => {
  let displayProduct = items.map(
    (product) => `
      <div class="item">
      <div class="top d-flex">
        <img src=${product.url} alt="item image" />
        <div class="icon d-flex">
          <i class="bx bxs-heart"></i>
        </div>
      </div>
      <div class="bottom">
        <h4>${product.title}</h4>
        <div class="d-flex">
          <div class="price">$${product.price}</div>
          <button class="cart-btn">Add to Cart</button>
        </div>
      </div>
    </div>
        `
  );

  displayProduct = displayProduct.join("");
  productsWrapper.innerHTML = displayProduct;
};

let filters = document.querySelectorAll(".filters div");
filters = [...filters];
console.log(filters);
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
