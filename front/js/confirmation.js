const urlOrder = new URL(document.location); // récup identifiant produit depuis URL
let params = urlOrder.searchParams;
let orderId = params.get('orderid');
const orderIdHtml = document.getElementById("orderId");
orderIdHtml.innerText = orderId;