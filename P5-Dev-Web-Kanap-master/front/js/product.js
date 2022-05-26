const urlProduct = new URL(document.location);
let params = urlProduct.searchParams;
let id = params.get('id');

console.log(id);
console.log(params);
console.log(urlProduct);

const titleElementHtml = document.getElementById("title"); //récup title du html
const priceElementHtml = document.getElementById("price");
const photoElementHtml = document.getElementById("photo");
const descriptionElementHtml = document.getElementById("description");
const colorsElementHtml = document.getElementById("colors");
const urlApi = `http://localhost:3000/api/products/${id}`;

console.log(urlApi); // pour s'assurer que l'élément apparait dans la console (et comment il apparait) 
fetch(urlApi) // récupérer contenu url
    .then(function(response) { // PUIS fonction DANS fonction 
        console.log(response);
        return response.json();
    })
    .then(function(data) {
        console.log(data); //données du produit

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