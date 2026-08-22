const horariosCierre = {
    "Anguila 10 AM": "09:50",
    "Gana Más": "14:20",
    "Anguila 1 PM": "12:50",
    "Lotería Real": "12:45",
    "New York Tarde": "14:20",
    "Leidsa": "20:45",
    "La Primera Día": "11:50",
    "La Primera Noche": "19:50",
    "Anguila 6 PM": "17:50",
    "Lotería Nacional": "20:50",
    "New York Noche": "22:20",
    "Anguila 9 PM": "20:50",
    "La Suerte Tarde": "12:20",
    "La Suerte Noche": "17:50",
    "King Lottery Tarde": "13:20",
    "King Lottery Noche": "19:20"
};

function verificarLoteriasAbiertas() {
    let ahora = new Date();
    let horaActualMinutos = ahora.getHours() * 60 + ahora.getMinutes();
    
    for (let lot in horariosCierre) {
        let [h, m] = horariosCierre[lot].split(':').map(Number);
        if (horaActualMinutos <= (h * 60 + m)) {
            return true;
        }
    }
    return false;
}

function validarCierreLoteria(nombreLoteria) {
    let horaLimite = horariosCierre[nombreLoteria];
    if (!horaLimite) return true;

    let ahora = new Date();
    let horaActualMinutos = ahora.getHours() * 60 + ahora.getMinutes();
    let [h, m] = horaLimite.split(':').map(Number);

    if (horaActualMinutos > (h * 60 + m)) {
        alert(`❌ La lotería "${nombreLoteria}" ya cerró su horario de venta (${horaLimite}).`);
        return false;
    }
    return true;
}

// Función para limpiar el selector y dejar SOLO las loterías abiertas
function actualizarSelectLoterias() {
    let select = document.getElementById('loteriaSelect');
    if (!select) return;
    
    let ahora = new Date();
    let horaActualMinutos = ahora.getHours() * 60 + ahora.getMinutes();
    
    // Guardar la opción seleccionada actual si sigue abierta
    let valorActual = select.value;
    select.innerHTML = '';

    let hayAbiertas = false;

    for (let lot in horariosCierre) {
        let [h, m] = horariosCierre[lot].split(':').map(Number);
        let cierreMinutos = h * 60 + m;

        // Si la hora actual es menor o igual al cierre, la agregamos
        if (horaActualMinutos <= cierreMinutos) {
            let option = document.createElement('option');
            option.value = lot;
            option.innerText = `${lot} (Cierra ${horariosCierre[lot]})`;
            select.appendChild(option);
            hayAbiertas = true;
        }
    }

    if (!hayAbiertas) {
        let option = document.createElement('option');
        option.value = "";
        option.innerText = "🔒 TODAS LAS LOTERÍAS CERRADAS";
        select.appendChild(option);
    } else {
        // Intentar mantener la selección si aún está disponible
        select.value = valorActual;
    }
}