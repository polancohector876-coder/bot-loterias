(function() {
    function agregarBotonReiniciarVendedor() {
        if (document.getElementById('btn-reset-vendedor')) return;
        
        const btnReset = document.createElement('button');
        btnReset.id = 'btn-reset-vendedor';
        btnReset.innerHTML = '🔄 Cambiar Vendedor / Reiniciar Terminal';
        btnReset.style.cssText = `
            width: 90%;
            margin: 10px auto;
            display: block;
            background-color: #ff3333;
            color: white;
            font-weight: bold;
            padding: 12px;
            border: none;
            border-radius: 8px;
            font-size: 14px;
            cursor: pointer;
            box-shadow: 0 4px 6px rgba(0,0,0,0.3);
        `;

        btnReset.onclick = function() {
            const confirmar = confirm("⚠️ ¿Estás seguro de reiniciar esta terminal para un NUEVO VENDEDOR?\n\nSe borrará el historial de tickets del celular y se pedirá la identificación del nuevo vendedor.");
            if (confirmar) {
                const nuevoVendedor = prompt("Ingresa el nombre o número del nuevo vendedor:");
                if (nuevoVendedor && nuevoVendedor.trim() !== "") {
                    localStorage.clear();
                    sessionStorage.clear();
                    localStorage.setItem('vendedor', nuevoVendedor.trim());
                    alert("✅ Terminal lista para el nuevo vendedor: " + nuevoVendedor);
                    window.location.reload();
                } else {
                    alert("Operación cancelada. Debes ingresar un nombre de vendedor.");
                }
            }
        };

        const panelLateral = document.querySelector('.menu-lateral, #sidebar, header, nav') || document.body;
        panelLateral.prepend(btnReset);
    }

    document.addEventListener("DOMContentLoaded", agregarBotonReiniciarVendedor);
    setTimeout(agregarBotonReiniciarVendedor, 1000);
})();
