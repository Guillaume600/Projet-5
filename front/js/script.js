// On déclare la constante url contenant l'API (la base de données qui contient tous les produits et les informations contenues)
const url = "http://localhost:3000/api/products";
// pour s'assurer que l'élément apparait dans la console (et comment il apparait) 
console.log(url);
// récupérer contenu de la constante url à l'aide la fonction fetch 
fetch(url)
    .then(function(response) {
        // PUIS fonction DANS fonction 
        console.log(response);
        // on le renvoie sous forme de données JS
        return response.json();
    })
    .then(function(data) {
        console.log(data);
        console.log(data.name);
        // création d'une variable qui, à l'aide de l'argument document va permettre d'aller dans le document HTML récupérer une balise et son contenu grâce à son ID
        let sectionKanap = document.getElementById("items");
        // création d'une boucle, littéralement pour chaque élément contenu dans les données (de l'API), on crée une nouvelle carte (créée en CSS)
        // l'argument createElement permet ensuite de le créer en HTML, avec les balises suivantes 
        for (let kanap of data) {
            console.log(kanap.name + kanap._id);
            //createElement pour créer élément HTML
            let lien = document.createElement("a");
            lien.href = `./product.html?id=${kanap._id}`;

            let article = document.createElement("article");

            let image = document.createElement("img");
            image.src = kanap.imageUrl;
            image.alt = kanap.altTxt;

            let titre = document.createElement("h3");
            titre.className = "productName";
            titre.innerText = kanap.name;

            let paragraphe = document.createElement("p");
            paragraphe.className = "productDescription";
            paragraphe.innerText = kanap.description;
            // append permet d'imbriquer les balises image titre et paragraphe dans la balise article
            article.append(image); //ajoute l'image
            article.append(titre); // ajoute titre etc
            article.append(paragraphe);

            lien.append(article);

            sectionKanap.append(lien);
        }
        console.log(sectionKanap);
    }); // manipuler le DOM, utiliser création d'éléments = supprimer innerHtml (fait)
// utiliser document.createElement (fait)