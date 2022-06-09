const urlApi = `http://localhost:3000/api/products`;

//let panier = JSON.parse(window.localStorage.getItem("panier")); 
let panierString = window.localStorage.getItem("panier"); // récup contenu storage
if (panierString == null) { // si panier vide
    panierString = "[]";
}
let panier = JSON.parse(panierString); // conversion string json vers objet js

console.log(panier);

const cartItemsHtml = document.getElementById("cart__items");
let data = []; //recup données de l'api (détails des produits)

function calculTotal() {
    let quantityTotal = 0; // commencer à 0 car sélection vide
    let priceTotal = 0; // démarrer à 0 car panier vide
    // let contentCart = "";
    const quantityTotalHtml = document.getElementById("totalQuantity");
    const priceTotalHtml = document.getElementById("totalPrice");
    for (let product of panier) {
        let productDetail = data.find(function(detail) {
            return detail._id == product.id;
        });
        quantityTotal += product.quantity; // sélection vide + contenu storage
        priceTotal += product.quantity * productDetail.price; // quantité produits multiplié par prix
    }
    quantityTotalHtml.innerText = quantityTotal;
    priceTotalHtml.innerHTML = priceTotal;
}

//let contentCart = "";
// Affichage et gestion du panier
console.log(urlApi); // pour s'assurer que l'élément apparait dans la console (et comment il apparait) 
fetch(urlApi) // récupérer contenu url
    .then(function(response) { // PUIS fonction DANS fonction 
        console.log(response);
        return response.json();
    })
    .then(function(products) {
        console.log(products); //données du produit
        data = products;
        for (let product of panier) {
            let productDetail = data.find(function(detail) {
                return detail._id == product.id;
            });
            console.log(productDetail);

            /* contentCart += `<article class="cart__item" data-id="${product.id}" data-color="${product.colors}">
                 <div class="cart__item__img">
                 <img src="${productDetail.imageUrl}" alt="${productDetail.altTxt}">
                 </div>
                 <div class="cart__item__content">
                 <div class="cart__item__content__description">
                 <h2>${productDetail.name}</h2>
                 <p>${product.colors}</p>
                 <p>${productDetail.price} €</p>
                 </div>
                 <div class="cart__item__content__settings">
                 <div class="cart__item__content__settings__quantity">
                 <p>Qté : </p>
                 <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.quantity}">
                 </div>
                 <div class="cart__item__content__settings__delete">
                 <p class="deleteItem">Supprimer</p>
                 </div>
                 </div>
                 </div>
                 </article>`; */

            //création manuelle des balises et de leur contenu a l'aide de createElement
            let article = document.createElement("article");
            article.className = "cart__item";
            article.dataset.id = product.id;
            article.dataset.color = product.colors;

            let divImage = document.createElement("div");
            divImage.className = "cart__item__img";

            let image = document.createElement("img");
            image.src = productDetail.imageUrl;
            image.alt = productDetail.altTxt;


            let divItem = document.createElement("div");
            divItem.className = "cart__item__content";

            let divItemDescription = document.createElement("div");
            divItemDescription.className = "cart__item__content__description";

            let titre = document.createElement("h2");
            titre.innerText = productDetail.name;

            let paragrapheColors = document.createElement("p");
            paragrapheColors.innerText = product.colors;
            let paragraphePrice = document.createElement("p");
            paragraphePrice.innerText = productDetail.price + " €";


            let divItemParam = document.createElement("div");
            divItemParam.className = "cart__item__content__settings";

            let divItemParamQuantity = document.createElement("div");
            divItemParamQuantity.className = "cart__item__content__settings__quantity";

            let paragrapheQuantity = document.createElement("p");
            paragrapheQuantity.innerText = "Qte : ";


            let inputQuantity = document.createElement("input");
            inputQuantity.type = "number";
            inputQuantity.className = "itemQuantity";
            inputQuantity.name = "itemQuantity";
            inputQuantity.min = "1";
            inputQuantity.max = "100";
            inputQuantity.value = product.quantity;

            let paragrapheError = document.createElement("p");
            paragrapheError.className = "errorMessage";

            let divItemParamDelete = document.createElement("div");
            divItemParamDelete.className = "cart__item__content__settings__delete";

            let buttonDelete = document.createElement("button"); // remplacer par p si besoin
            buttonDelete.className = "deleteItem";
            buttonDelete.innerText = "Supprimer";

            //imbrication via append

            divImage.append(image);
            divItemDescription.append(titre, paragrapheColors, paragraphePrice);
            divItem.append(divItemDescription);
            divItemParamQuantity.append(paragrapheQuantity, inputQuantity, paragrapheError);
            divItemParamDelete.append(buttonDelete);
            divItemParam.append(divItemParamQuantity, divItemParamDelete);
            divItem.append(divItemParam);
            article.append(divImage, divItem);

            cartItemsHtml.append(article);


        }

        //cartItemsHtml.innerHTML = contentCart;
        calculTotal();

        const inputsQuantity = document.getElementsByClassName("itemQuantity");
        const buttonsDelete = document.getElementsByClassName("deleteItem");

        for (const inputQuantity of inputsQuantity) {
            inputQuantity.addEventListener("change", function(event) {
                console.log("maj quantity");
                // empêcher + 100 articles avec message d'erreur
                const errorMessage = event.currentTarget.nextSibling;
                if (inputQuantity.valueAsNumber > 100) {
                    errorMessage.innerText = "Quantité maximale : 100";
                    return;
                }
                errorMessage.innerText = "";

                const article = event.currentTarget.closest(".cart__item");
                const productId = article.dataset.id;
                const productColor = article.dataset.color;
                console.log(productId);
                console.log(productColor);
                for (const product of panier) {
                    if (product.id == productId && product.colors == productColor) {
                        product.quantity = inputQuantity.valueAsNumber; //maj quantité produits dans panier SI produit de même couleur et même ID
                    }
                }
                let panierString = JSON.stringify(panier);
                window.localStorage.setItem('panier', panierString);
                calculTotal();
            });
        }

        for (const buttonDelete of buttonsDelete) {
            buttonDelete.addEventListener("click", function(event) {
                console.log("supprimerProduitSelect");
                //effacer contenu HTML

                const article = event.currentTarget.closest(".cart__item");
                const productId = article.dataset.id;
                const productColor = article.dataset.color;

                cartItemsHtml.removeChild(article);
                const nouveauPanier = panier.filter(function(productPanier) {
                    return productPanier.id != productId || productPanier.colors != productColor;

                });
                // maj panier dans storage
                let panierString = JSON.stringify(nouveauPanier);
                window.localStorage.setItem('panier', panierString);
                panier = nouveauPanier;
                calculTotal();
            });
        }

    });

//Gestion du formulaire et de ses éléments
const firstNameInputHtml = document.getElementById("firstName");
const lastNameInputHtml = document.getElementById("lastName");
const addressInputHtml = document.getElementById("address");
const cityInputHtml = document.getElementById("city");
const emailInputHtml = document.getElementById("email");
const formulaireFormHtml = document.getElementById("formulaire");

let firstNameIsValid = false;
let lastNameIsValid = false;
let addressIsValid = false;
let cityIsValid = false;
let emailIsValid = false;
//fonction permettant d'attribuer les conditions de validation de confirmation de commande
//le regex permet d'assurer l'utilisation de bons caractères dans les champs à remplir
//récupération de toutes les données
firstNameInputHtml.addEventListener("input", function() {
    const regexName = /([a-zA-Z]+)/;
    firstNameIsValid = firstNameInputHtml.value.match(regexName);
    const errorMessage = document.getElementById("firstNameErrorMsg");
    if (firstNameIsValid) {
        errorMessage.innerText = "";
    } else {
        errorMessage.innerText = "Le prénom doit faire plus de 2 caractères";
    }
});

lastNameInputHtml.addEventListener("input", function() {
    const regexName = /([a-zA-Z]+)/;
    lastNameIsValid = lastNameInputHtml.value.match(regexName);
    const errorMessage = document.getElementById("lastNameErrorMsg");
    if (lastNameIsValid) {
        errorMessage.innerText = "";
    } else {
        errorMessage.innerText = "Le nom doit faire au moins 1 caractère";
    }
});

addressInputHtml.addEventListener("input", function() {
    addressIsValid = addressInputHtml.value.length > 0;
    const errorMessage = document.getElementById("addressErrorMsg");
    if (addressIsValid) {
        errorMessage.innerText = "";
    } else {
        errorMessage.innerText = "Addresse requise pour continuer";
    }
});

cityInputHtml.addEventListener("input", function() {
    cityIsValid = cityInputHtml.value.length > 0;
    const errorMessage = document.getElementById("cityErrorMsg");
    if (cityIsValid) {
        errorMessage.innerText = "";
    } else {
        errorMessage.innerText = "Ville requise pour continuer";
    }
});

emailInputHtml.addEventListener("input", function() {
    //construction regex :caractères, chiffres et symboles , ensuite @ , ensuite caractères et points, ensuite . ensuite caractères uniquement
    const regexMail = /([a-zA-Z0-9-_+]+@[a-zA-Z0-9.]+\.[a-z]+)/;
    emailIsValid = emailInputHtml.value.match(regexMail);
    const errorMessage = document.getElementById("emailErrorMsg");
    if (emailIsValid) {
        errorMessage.innerText = "";
    } else {
        errorMessage.innerText = "Veuillez entrer une adresse email valide";
    }
});

formulaireFormHtml.addEventListener("submit", function(event) {
    event.preventDefault();
    // Si formulaire invalide ET/ou panier vide
    if (!firstNameIsValid ||
        !lastNameIsValid ||
        !addressIsValid ||
        !cityIsValid ||
        !emailIsValid ||
        panier.length == 0
    ) {
        console.log("formulaireInvalide")
        return;
    }
    console.log(firstNameInputHtml.value, lastNameInputHtml.value, addressInputHtml.value, cityInputHtml.value, emailInputHtml.value);
    const products = [];
    for (const product of panier) {
        products.push(product.id);
    }
    //création de l'objet contenant toutes les informations 
    const order = {
        contact: {
            firstName: firstNameInputHtml.value,
            lastName: lastNameInputHtml.value,
            address: addressInputHtml.value,
            city: cityInputHtml.value,
            email: emailInputHtml.value
        },
        products: products
    };
    //requête POST pour récupérer l'ID de la commande (orderID)
    fetch(`${urlApi}/order`, {
            method: "POST",
            body: JSON.stringify(order),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        .then(function(response) {
            return response.json();
        })
        .then(function(response) {
            console.log(response);
            window.location.href = `confirmation.html?orderid=${response.orderId}`;
        });
});