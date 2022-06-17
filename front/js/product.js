const urlProduct = new URL(document.location); // récup identifiant produit depuis URL
let params = urlProduct.searchParams;
let id = params.get('id');
const validationMessageHtml = document.getElementById("validationPanier");


console.log(id);
console.log(params);
console.log(urlProduct);

const titleElementHtml = document.getElementById("title"); //récupération title du html
const priceElementHtml = document.getElementById("price");
const photoElementHtml = document.getElementById("photo");
const descriptionElementHtml = document.getElementById("description");
const colorsElementHtml = document.getElementById("colors");
const urlApi = `http://localhost:3000/api/products/${id}`;

const quantityElementHtml = document.getElementById("quantity");

/*Fonction de vérification de saisie de quantité

*/
function checkQuantity(quantityUser, quantityMax) {
    console.log(quantityUser);
    const errorMessage = document.getElementById("quantityErrorMessage");
    if (quantityUser <= quantityMax && quantityUser > 0) {
        errorMessage.innerText = "";
        return true
    } else {
        errorMessage.innerText = `Quantité max autorisée : ${quantityMax}`;
        return false
    }

}

function editProductIfExist(panier, newProduct) {
    let erreurPanierHtml = document.getElementById("erreurPanier");
    let productExisting = false;
    for (let product of panier) {
        if (product.id == newProduct.id && product.colors == newProduct.colors) { // si l'id ET la couleur snt déjà dans panier
            if (product.quantity + newProduct.quantity <= 100) {
                product.quantity += newProduct.quantity; // ajouter quantity à quantity déjà existante
                validationMessageHtml.innerText = `${newProduct.quantity} produit(s) ajouté(s) au panier`;
            } else {
                console.log("Produit pas ajouté car quantité trop grande");
                erreurPanierHtml.innerText = "Produit pas ajouté car quantité trop grande";
            }
            productExisting = true;
        }
    }
    return productExisting;
}


console.log(urlApi); // pour s'assurer que l'élément apparait dans la console (et comment il apparait)
fetch(urlApi) // récupérer contenu url
    .then(function(response) { // PUIS fonction DANS fonction
        console.log(response);
        return response.json();
    })
    .then(function(data) {
        console.log(data); //données du produit

        document.title = data.name;
        titleElementHtml.innerText = data.name;
        priceElementHtml.innerText = data.price;
        photoElementHtml.src = data.imageUrl;
        photoElementHtml.alt = data.altTxt;
        descriptionElementHtml.innerText = data.description;
        let txt = "<option value=\"\" disabled>--SVP, choisissez une couleur --</option>";
        for (let color of data.colors) {
            console.log(color);
            // txt += "<option value=\"" + color + "\">" + color + "</option>";
            txt += `<option value="${color}">${color}</option>`
        }
        console.log(txt);
        colorsElementHtml.innerHTML = txt;
    });

quantityElementHtml.addEventListener("input", function() {
    //let quantityIsValid = quantityElementHtml.value <= 100;
    let quantityUser = quantityElementHtml.value;
    console.log(quantityUser);
    let flag = checkQuantity(quantityUser, 100);
    console.log(flag);
    if (!flag) {
        alert("Quantité max atteinte !")
    }
});


document.getElementById("addToCart").addEventListener("click", function(evt) {
    console.log(evt.target.textContent);
    let quantityString = quantityElementHtml.value; // transformation quantity de string à nombre
    let quantity = Number.parseInt(quantityString, 10);
    let colors = colorsElementHtml.value;
    let erreurPanierHtml = document.getElementById("erreurPanier");
    console.log(id);
    console.log(colors);
    console.log(quantity);

    let panierStringOriginal = window.localStorage.getItem("panier"); // récup contenu storage
    if (panierStringOriginal == null) { //si pas de panier = création panier vide
        panierStringOriginal = "[]";
    }
    let panier = JSON.parse(panierStringOriginal); // conversion string json vers objet js
    console.log(panier);
    validationMessageHtml.innerText = "";
    erreurPanierHtml.innerText = "";

    let newProduct = {
        id: id,
        quantity: quantity,
        colors: colors
    };
    let productExist = editProductIfExist(panier, newProduct); //si produit existe déjà dans panier incrémentation quantité
    if (!productExist && newProduct.quantity <= 100) { //si le produit n'existe pas dans le panier et qu'on en ajoute moins de 100
        panier.push(newProduct);
        validationMessageHtml.innerText = `${newProduct.quantity} produit(s) ajouté(s) au panier`;
    }

    let panierString = JSON.stringify(panier);
    window.localStorage.setItem('panier', panierString);
    console.log(panier)
});