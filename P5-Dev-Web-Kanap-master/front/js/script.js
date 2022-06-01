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
        let txt = "";
        for (let kanap of data) {
            console.log(kanap.name + kanap._id);
            txt += `<a href="./product.html?id=${kanap._id}">
            <article>
                <img src="${kanap.imageUrl}" alt="Lorem ipsum dolor sit amet, Kanap name1">
                <h3 class="productName">${kanap.name}</h3>
                <p class="productDescription">${kanap.description}</p>
            </article>
        </a>`;
        }
        console.log(txt);
        let node = document.getElementById("items");
        console.log(node);
        node.innerHTML = txt;
    }); // manipuler le DOM, utiliser création d'éléments = supprimer innerHtml