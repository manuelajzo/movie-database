window.onload = function () {
    mostrarLista();
};

var favoritas = JSON.parse(localStorage.getItem("favoritas"));

if (favoritas == null) {
    let divFav = document.getElementById("listaPelis");
    divFav.setAttribute("class", "text-center");
    divFav.innerHTML = `Todavía no agregaste ningún elemento a la lista.`;
}

function mostrarLista () {
    let listaPelis = document.getElementById("listaPelis");
    if (favoritas.length == 0) {
        listaPelis.innerHTML = `<h2>Todavía no agregaste elementos a la lista.</h2>`;
    } else {
        for (let pelicula of favoritas) {
            console.log(pelicula, "hola!! esto es el for of");

            let container = document.getElementById("auxiliar");
            let divContenedor = document.createElement("div");
            divContenedor.setAttribute("class", "divContenedor card");
            divContenedor.setAttribute("id", pelicula.imdbID);

            let posterPelicula = document.createElement("img");
            posterPelicula.setAttribute("class", "card-img-top");
            posterPelicula.src = pelicula.Poster;

            let nombrePelicula = document.createElement("h2");
            nombrePelicula.setAttribute("id", "h2");
            nombrePelicula.innerHTML = `${pelicula.Title}`;

            let sinopsisPelicula = document.createElement("p");
            sinopsisPelicula.setAttribute("class", "card-text");
            sinopsisPelicula.innerHTML = `Sinopsis: ${pelicula.Plot}`;

            let directorPelicula = document.createElement("p");
            directorPelicula.setAttribute("class", "card-text");
            directorPelicula.innerHTML = `Director: ${pelicula.Director}`;

            let agregarBotonQuitar = crearBotonQuitar(pelicula);

            divContenedor.append(posterPelicula, nombrePelicula, sinopsisPelicula, directorPelicula, agregarBotonQuitar);
            listaPelis.appendChild(divContenedor);
        }        
    }
}

function crearBotonQuitar (peli) {
    let botonQuitar = document.createElement("button");
    botonQuitar.setAttribute("class", "btn btn-danger");
    botonQuitar.innerHTML = `Quitar de la lista`;

    botonQuitar.addEventListener('click', () => {
        let lista = JSON.parse(localStorage.getItem("favoritas"));
        let yaAgregada = lista.some(peliculaGuardada => { 
            if (peliculaGuardada.Title == peli.Title) {
                favoritas = lista.filter(item => item.Title !== peli.Title);
                localStorage.setItem("favoritas", JSON.stringify(favoritas));
                let divContenedor = document.getElementById(peliculaGuardada.imdbID);
                divContenedor.remove();
            }            
        })
        console.log(yaAgregada);
    })

    return botonQuitar;
}


