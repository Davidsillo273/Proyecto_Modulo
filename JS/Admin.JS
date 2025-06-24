//Coloca tu endpoint de Retool API
const API_URL = 'https://685af76589952852c2d83324.mockapi.io/UShoes/shoes';

//Coloca tu endpoint de ImgBB
const IMG_API_URL = 'https://api.imgbb.com/1/upload?key=3a1084e9178ce1828378dfb94eca8f34';

const form = document.getElementById('productos-form');
const nombreEl = document.getElementById('nombre');
const precioEl = document.getElementById('precio');
const categoriaEl = document.getElementById('categoria')
const imagenFileEl = document.getElementById('imagen-file');
const imagenUrlEl = document.getElementById('imagen-url');
const idEl = document.getElementById('zapatos-id');
const cancelBtn = document.getElementById('btn-cancel');
const submitBtn = document.getElementById('btn-submit');
const tbody = document.getElementById('zapatos-tbody');


async function CargarProductos() {
    const res = await fetch(API_URL);
    const data = await res.json();
    CargarTabla(data);
}

function CargarTabla(productos){
    tbody.innerHTML = '';
    productos.forEach(producto => {
        tbody.innerHTML += `
            <tr>
                <td><img src="${producto.imagenes}" alt="Foto de ${producto.nombre}" /></td>
                <td>${producto.precio}</td>
                <td>${producto.categoria}</td>
                <td>
                    <button onclick="CargarParaEditar('${producto.id}')">Editar</button>
                    <button onclick="BorrarProducto('${producto.id}')">Eliminar</button>
                </td>
            </tr> 
        `;
    });
}

async function BorrarProducto(id) {
    const confirmacion = confirm('¿Eliminar este producto?');

    if(confirmacion) {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        CargarProductos();
        alert("El registro fue eliminado");
    }

    else{
        alert("Se Canceló la accion");
        return;
    }
}

async function CargarParaEditar(id) {
    const res = await fetch(`${API_URL}/${id}`);
    const p = await res.json();

    nombreEl.value = p.nombre;
    precioEl.value = p.precio;
    imagenUrlEl.value = p.imagenes;
    imagenFileEl.value = '';
    idEl.value = p.id;

    submitBtn.textContent = 'Actualizar';
    cancelBtn.hidden = false;
}

cancelBtn.addEventListener('click', () => {
    form.reset();
    idEl.value = '';
    submitBtn.textContent = 'Agregar';
    cancelBtn.hidden = true;
});

async function subirImagen(file) {
    const fd = new FormData();
    fd.append('image', file);
    const res = await fetch(IMG_API_URL, { method: 'POST', body: fd });
    const obj = await res.json();
    return obj.data.url;
}

form.addEventListener('submit', async e => {
    e.preventDefault();

    let imageUrl = imagenUrlEl.value;
    if (imagenFileEl.isDefaultNamespace.length > 0) {
        imageUrl = await subirImagen(imagenFileEl.files[0]);
    }

    const payload = {
        nombre: nombreEl.value,
        telefono: telefonoEl.value,
        imagen: imageUrl
    };

    if(idEl.value){
        await fetch(`${API_URL}/${idEl.value}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        alert("Registro actualizado");
    }
    else{
        await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        alert("Registro agregado");
    }

    form.reset();
    cancelBtn.hidden = true;
    submitBtn.textContent = 'Agregar';
    CargarProductos();
});


//Carga Inicial
window.addEventListener('DOMContentLoaded', CargarPersonas);