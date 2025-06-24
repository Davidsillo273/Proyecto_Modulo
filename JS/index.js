const API_URL = 'https://685af76589952852c2d83324.mockapi.io/UShoes/shoes'; 

const container = document.getElementById("Shoes-div");

async function CargarCatalogos() {
    try{
        const res = await fetch(API_URL);
        const data = await res.json();
        CargarTarjetas(data);
    } catch(err){
        console.error('Error al cargar datos' , err);
        container.innerHTML = '<p>Error  al cargar los datos</p>';
    }
}

function CargarTarjetas(zapatos){
    container.innerHTML = '';

    if(zapatos.length == 0){
        container.innerHTML = "<p>No hay personas registradas</p>";
        return;
    }

    zapatos.forEach(zapato => {
        container.innerHTML += `
            <div class="card">
                <img src="${zapato.imagenes}" alt="">
                <h2>${zapato.nombre}</h2>
                <div>
                    <h3>${zapato.categoria}</h3>
                    <h4>$${zapato.precio}</h4>               
                </div>
                <button class="card-button">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search-icon lucide-search"><path d="m21 21-4.34-4.34"/><circle cx="11" cy="11" r="8"/></svg>
                </button>
            </div>
        `
    });
}

//Al cargar la pagina:
window.addEventListener('DOMContentLoaded', CargarCatalogos);