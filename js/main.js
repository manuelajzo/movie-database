const API_KEY = "79e8b537";
const button = document.getElementById("botonBuscar");
const input = document.getElementById("inputBuscar");

var favoritas = JSON.parse(localStorage.getItem("favoritas"));

const dataLocalStorage = JSON.parse(localStorage.getItem("dataGuardada"));

var statusDiv = document.getElementById("status");

var spinner = document.querySelector(".spinner-border");
			
window.addEventListener('load', function(e) {
    if (navigator.onLine) {
        statusDiv.innerHTML = "User is online";
        statusDiv.classList.add("success");
    } else {
        statusDiv.innerHTML = "User is offline";
        statusDiv.classList.remove("success");
        statusDiv.classList.add("error");
        }
    }, false);
            
window.addEventListener('online', function(e) {
    statusDiv.innerHTML = "User is back online";
    statusDiv.classList.remove("error");
    statusDiv.classList.add("success");
}, false);
            
window.addEventListener('offline', function(e) {
    statusDiv.innerHTML = "User went offline";
    statusDiv.classList.remove("success");
    statusDiv.classList.add("error");
}, false);

if (dataLocalStorage != null) {
    cardPelicula(dataLocalStorage);
} 


button.addEventListener("click", () => {
    spinner.style.visibility = "visible";
    buscarPelicula(input.value);
});

input.addEventListener("keyup", function (event) {  
    if(event.code == "Enter") {
      event.preventDefault();
      spinner.style.visibility = "visible";
      buscarPelicula(input.value);
    }   
  });

function buscarPelicula(pelicula) {
    let divAux = document.getElementById("resultados");
    fetch(`https://www.omdbapi.com/?t=${pelicula}&apikey=${API_KEY}&`)
    .then(function(response){
        return response.json();        
    })
    .then(function(respuestaParseada){
        if (respuestaParseada.Response == 'False') {
            borrarElemento();
            divAux.style.visibility = "visible";
            spinner.style.visibility = "hidden";
            return;
        }
        console.log(respuestaParseada);
        borrarElemento();
        guardarData(respuestaParseada);        
        spinner.style.visibility = "hidden";
        divAux.style.visibility = "hidden";
        cardPelicula(respuestaParseada);        
    })
    .catch(function(error) {
        spinner.style.visibility = "hidden";        
        divAux.style.visibility = "visible";
      });
}

function borrarElemento() {
    if (document.querySelector("#divContenedor")) {
        document.querySelector("#divContenedor").remove();
    }
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
    ratingPelicula.innerHTML = `Calificación: ${nombre.Ratings[0].Value}`;

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


