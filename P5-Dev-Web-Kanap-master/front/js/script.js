const url = "http://localhost:3000/api/products";
console.log(url); // pour s'assurer que l'élément apparait dans la console (et comment il apparait) 
fetch(url) // récupérer contenu url
    .then(function(response) { // PUIS fonction DANS fonction 
        console.log(response);
        return response.json();
    })
    .then(function(data) {
        console.log(data);
        console.log(data.name);
        let sectionKanap = document.getElementById("items");

        for (let kanap of data) {
            console.log(kanap.name + kanap._id);
            let lien = document.createElement("a"); //createElement pour créer élément HTML 
            lien.setAttribute("href", `./product.html?id=${kanap._id}`);

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

            article.append(image); //ajoute l'image
            article.append(titre); // ajoute titre etc
            article.append(paragraphe);

            lien.append(article);

            sectionKanap.append(lien);
        }
        console.log(sectionKanap);
    }); // manipuler le DOM, utiliser création d'éléments = supprimer innerHtml (fait)
// utiliser document.createElement (fait)