// récup identifiant produit depuis URL
const urlProduct = new URL(document.location);
//la propriété searchparams permet de récupérer des données d'une URL, en l'occurrence les ID
let params = urlProduct.searchParams;
let id = params.get('id');

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
// pour s'assurer que l'élément apparait dans la console (et comment il apparait)
console.log(urlApi);
// récupérer contenu url
fetch(urlApi)
    .then(function(response) { // PUIS fonction DANS fonction 
        console.log(response);
        return response.json();
    })
    .then(function(data) {
        console.log(data); //données du produit
        // ici, on complète le contenu des balises HTML directement par les données associées dans l'API (nom, prix, image...)
        titleElementHtml.innerText = data.name;
        priceElementHtml.innerText = data.price;
        photoElementHtml.src = data.imageUrl;
        photoElementHtml.alt = data.altTxt;
        descriptionElementHtml.innerText = data.description;
        //variable associée au choix des couleurs
        let txt = "<option value=\"\" disabled>--SVP, choisissez une couleur --</option>";
        // création d'une boucle permettant de récupérer chacune des couleurs de chaque produit 
        for (let color of data.colors) {
            console.log(color);
            // txt += "<option value=\"" + color + "\">" + color + "</option>";
            // les ${} permettent de récupérer les données de l'API et de les intégrer dans l'HTML
            txt += `<option value="${color}">${color}</option>`
        }
        console.log(txt);
        colorsElementHtml.innerHTML = txt;
    });
/*Dans un premier temps, on crée l'interaction avec la balise addToCart (ajouter au panier) en récupérant la balise
Puis on lui ajoute la fonction addEventListener du clic */
document.getElementById("addToCart").addEventListener("click", function(evt) {
    console.log(evt.target.textContent);
    // transformation quantity de string à nombre
    let quantityString = quantityElementHtml.value;
    // transformer string en nombres entiers
    let quantity = Number.parseInt(quantityString, 10);
    let colors = colorsElementHtml.value;
    console.log(id);
    console.log(colors);
    console.log(quantity);

    // récup contenu storage
    let panierStringOriginal = window.localStorage.getItem("panier");
    if (panierStringOriginal == null) {
        //si pas de panier = création panier vide
        panierStringOriginal = "[]";
    }
    let panier = JSON.parse(panierStringOriginal); // conversion string json vers objet js
    console.log(panier);

    //si produit existe déjà dans panier incrémentation quantité
    let productExisting = false;
    for (let product of panier) {
        if (product.id == id && product.colors == colors) { // si l'id ET la couleur snt déjà dans panier
            if (product.quantity + quantity >= 100) {
                product.quantity = 100;
            } else {
                product.quantity += quantity; // ajouter quantity à quantity déjà existante
            }
            productExisting = true;
        }
    }

    if (!productExisting && quantity <= 100) { //si le produit n'existe pas dans le panier et qu'on en ajoute moins de 100
        panier.push({
            id: id,
            quantity: quantity,
            colors: colors,
        });
    } else {
        console.log("Produit pas ajouté car quantité trop grande");
    }

    let panierString = JSON.stringify(panier);
    //On ajoute les éléments ajoutés au panier directement le local storage du navigateur
    window.localStorage.setItem('panier', panierString);
    console.log(panier);
});