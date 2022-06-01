//let panier = JSON.parse(window.localStorage.getItem("panier")); 
let panierString = window.localStorage.getItem("panier"); // récup contenu storage
let panier = JSON.parse(panierString); // conversion string json vers objet js
console.log(panier);

const cartItemsHtml = document.getElementById("cart__items");
const quantityTotalHtml = document.getElementById("totalQuantity");

let contentHTML = "";
let quantityTotal = 0;

for (let product of panier) {
    contentHTML += `<p>${product.id}</p>`;
    quantityTotal += product.quantity;
}

cartItemsHtml.innerHTML = contentHTML;
quantityTotalHtml.innerText = quantityTotal;