document.addEventListener("DOMContentLoaded", async () => {
    setTimeout(async () => {
        loaderCards(true); //Mostrar cards
        obtenerPisos();
        pedidos = await obtenerPedidos();
        loaderCircle(false); // Ocultar loader
    }, 3000); //Cuando se consulta información por solicitud no será necesario el timeout para mostrar login.
    loaderCircle(true); // Mostrar loader
    loaderCards(false); //Ocultar cards
});


var cantidades = document.getElementById('titulo');
var pedidos = [];
var conteoPedtTot = 0;
var conteoPedSinAsignar = 0;
var reloadFolios = false;
// Variables para Sortable
const pisos = document.getElementById('grid12x12')
var folioPrimerElemento = '';
var IDsegundoElemento = ''; 
var foliosSegundoElemento = '';
var regex = /\d{6}/g;; //Busca 6 digitos (folios)
var regexID = /id="[\w\d]+"/i; //Busca el ID
var foliosCoincidencias = 0; 

const obtenerPedidos = async () => {
    try {
        conteoPedtTot = 0;
        conteoPedSinAsignar = 0;
        const res = await fetch('ProductosPorAsignar.json'); //Aqui Consumir servicio para obtener los productos que se pueden asignar a un piso
        const data = await res.json();
        //Crearmos un nuevo array con los datos que requerimos mostrar en el select del modal.
        const newArrayFolios = data.map(element => {
            conteoPedtTot++;
            if (element.Piso === "Sin asignar") {
                conteoPedSinAsignar++;
                return `${element.Folio} - ${element.piezas}PZS - ${element.Cliente}`
            }
            return;
        });
        //Eliminamos del select del modal los undefined que regresa cuando no tienen el "Sin asignar" en el map
        const newArrayFoliosFiltrado = newArrayFolios.filter(element => {
            if (element!=undefined) {
                return element
            }
        });
        return newArrayFoliosFiltrado;
    } catch (error) {
        console.log(error);
    }
    AOS.init();
}

async function solicitarFolio(e) {
    try {
        Swal.fire({
            title: `Piso: ${e.childNodes[3].textContent}`,
            text: `Seleccione el pedido:`,
            input: 'select',
            inputAttributes: {
                class: 'my-input-class',
            },
            inputOptions: {
                Pedidos: pedidos.sort(),
            },
            showClass: {
                popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
                popup: 'animate__animated animate__zoomOutUp'
            },
            showCancelButton: true,
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar',
            cancelButtonColor: '#DC143C',
            confirmButtonColor: '#0000FF',
            inputValidator: (value) => {
                return new Promise((resolve) => {
                    if (value !== '') {
                        resolve();
                    } else {
                        resolve('Favor de seleccionar una opción');
                    }
                })
            }
        })
            .then(async (result) => {
                if (result.isConfirmed) {
                    var folio = pedidos[result.value].substring(0, 6)
                    asignarPisos(folio, puesto.idempleado, e.id);
                }
            })
    }
    catch (error) {
        console.log(error);
    }

}

function loaderCircle(enable) {
    const loader = document.getElementById('loader');
    if (enable) {
        loader.classList.remove("none");
    } else {
        loader.classList.add("none");
        AOS.init();
    }
}

function loaderCards(enable) {
    const cards = document.getElementById('grid12x12')

    if (enable) {
        cards.classList.remove("none");
    } else {
        cards.classList.add("none");
    }
}

async function obtenerPisos() {
    var pisosOcupados = [];
    try {
        const res = await fetch(`ProductosAsignados.json`); //Consumir servicio GET para obtener pisos ocupados.
        const data = await res.json();
        data.forEach(element => {
            if (typeof element.folioPedido == 'string') {
                pisosOcupados.push(element)
            }
        });
        if (pisosOcupados.length > 0) {
            MostrarFolios(pisosOcupados)
        }
    } catch (error) {
        console.log(error);
    }
}

function MostrarFolios(pisos) {

    //Foreach para limpiar los folios.
    pisos.forEach(element => {
        var domElementCards = document.getElementById(`${element.idPiso}`)
        domElementCards.lastElementChild.textContent = '';
    });

    //Foreach para agregar los nuevos folios.
    pisos.forEach(element => {
        var domElementCards = document.getElementById(`${element.idPiso}`)
        domElementCards.lastElementChild.textContent += `
        ${element.folioPedido}
        `;
        domElementCards.classList.add('asignado')
        domElementCards.classList.remove('noAsignado')

        // domElementCards.removeAttribute('onclick')
        // domElementCards.classList.add('deshabilitado')
        // domElementCards.removeAttribute('onclick')
    });
}

async function asignarPisos(folio, idEmpleado, idPiso) {

    try {
        const body = { FolioPedido: parseInt(folio), IdEmpleadoAsigna: parseInt(idEmpleado), IdPiso: parseInt(idPiso) }
        const jsonBody = JSON.stringify(body);
        const config = {
            method: 'POST',
            body: jsonBody,
            headers: {
                'Content-Type': 'application/json'
            }
        };
        const res = await fetch(`ProductosAsignados.json`, config); //Consumir servicio POST para asignar el producto al piso
        const data = await res.json();
        pedidos = [];
        pedidos = await obtenerPedidos();
        obtenerPisos();
    }
    catch (error) {
        console.log(error)
    }

}

new Sortable(pisos, {
    animation: 150,
    chosenClass: "seleccionado",
    filter: '.noAsignado',
    onEnd: function(event) {
        if (folioPrimerElemento.match(regex).length == 1) {
            if (IDsegundoElemento.length>5) { //Cuando se deja en un espacio en blanco es 1, -1 o 0 por lo que no debe aplicar.
                if (foliosSegundoElemento.match(regex) != null) { //Los null son nuevos pisos, sin ningun pedido(folio) asignado.
                    foliosSegundoElemento.match(regex).forEach(element => {
                        if (element == folioPrimerElemento.match(regex)[0]) {
                            foliosCoincidencias++;
                        }
                    });
                }
                if (foliosCoincidencias == 0) {
                    // asignarPisos(folioPrimerElemento.match(regex)[0], puesto.idempleado, IDsegundoElemento.match(regexID)[0].replace("id=","").replaceAll('"',"")); //Consumir servicio para asignarPiso
                    Swal.fire(
                        'Piso asignado.',
                        `El pedido ${folioPrimerElemento.match(regex)[0]} fue asignado al piso ${IDsegundoElemento.match(regexID)[0].replace("id=","").replaceAll('"',"")}`,
                        'success'
                      )
                }
            }
        }
    },
    onMove: function (event) {
        foliosCoincidencias=0;
        folioPrimerElemento = event.dragged.innerHTML;
        IDsegundoElemento = event.related.innerHTML;
        foliosSegundoElemento = event.related.innerHTML;
    }
 });