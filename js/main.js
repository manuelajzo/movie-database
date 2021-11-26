const API_KEY = "79e8b537";
const button = document.getElementById("botonBuscar");
const input = document.getElementById("inputBuscar");

var favoritas = JSON.parse(localStorage.getItem("favoritas"));

const dataLocalStorage = JSON.parse(localStorage.getItem("dataGuardada"));

if (dataLocalStorage != null) {
    cardPelicula(dataLocalStorage);
} 


button.addEventListener("click", () => {
    buscarPelicula(input.value);
});

input.addEventListener("keyup", function (event) {  
    if(event.code == "Enter") {
      event.preventDefault();
      buscarPelicula(input.value);
    }   
  });

function buscarPelicula(pelicula) {
    fetch(`http://www.omdbapi.com/?t=${pelicula}&apikey=${API_KEY}&`)
    .then(function(response){
        return response.json();
    })
    .then(function(respuestaParseada){
        console.log(respuestaParseada);
        guardarData(respuestaParseada);
        if (document.querySelector("#divContenedor")) {
            document.querySelector("#divContenedor").remove();
        }
        cardPelicula(respuestaParseada);
    })
    .catch(function(error) {
        console.log('Hubo un problema con la petición Fetch:' + error.message);
      });
}

function guardarData (data){
    localStorage.setItem("dataGuardada", JSON.stringify(data));
}

function listaFavoritas (){
    if (favoritas != null) {
        localStorage.setItem("favoritas", JSON.stringify(favoritas));
    }
}

listaFavoritas();

function cardPelicula (nombre) {
    let posterPelicula = document.createElement("img");
    posterPelicula.setAttribute("class", "card-img-top");
    posterPelicula.src = nombre.Poster;

    let nombrePelicula = document.createElement("h2");
    nombrePelicula.setAttribute("id", "h2");
    nombrePelicula.innerHTML = `${nombre.Title}`;
    let container = document.getElementById("auxiliar");
    let divContenedor = document.createElement("div");
    divContenedor.setAttribute("id", "divContenedor");
    divContenedor.setAttribute("class", "card");
    
    let sinopsisPelicula = document.createElement("p");
    sinopsisPelicula.setAttribute("class", "card-text");
    sinopsisPelicula.innerHTML = `Sinopsis: ${nombre.Plot}`;

    let ratingPelicula = document.createElement("p");
    ratingPelicula.setAttribute("class", "card-text");
    ratingPelicula.innerHTML = `Calificación: ${nombre.Ratings[1].Value}`;

    let agregarBotonFav = crearBotonAgregar(nombre);
    let agregarBotonQuitar = crearBotonQuitar(nombre);


    divContenedor.append(nombrePelicula, posterPelicula, ratingPelicula, sinopsisPelicula, agregarBotonFav, agregarBotonQuitar);
    container.appendChild(divContenedor);
}

function crearBotonAgregar (peli) {
    let botonAgregar = document.createElement("button");
    botonAgregar.setAttribute("class", "btn btn-success");
    botonAgregar.innerHTML = `Agregar a la lista`;

    botonAgregar.addEventListener('click', () => {
        console.log('click');
        agregarFav(peli);
        botonAgregar.remove();
        crearBotonQuitar(peli);
    })

    return botonAgregar;
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
            }            
        })
        console.log(yaAgregada);
    })

    return botonQuitar;
}

function agregarFav(pelicula) {
    if (favoritas != null) {
        let lista = JSON.parse(localStorage.getItem("favoritas"));
        console.log(lista)
        let yaAgregada = lista.some(peliculaGuardada => { 
            return peliculaGuardada.Title === pelicula.Title ? true : false;
        })
        if (!yaAgregada){
            lista.push(pelicula);
            localStorage.setItem("favoritas", JSON.stringify(lista));
        };    
    } else {
        favoritas = [];
        favoritas.push(pelicula);
        localStorage.setItem("favoritas", JSON.stringify(favoritas));
    }
}
