(function() {
    function agregarBotonesPorVendedor() {
        const tarjetas = document.querySelectorAll('.card, [class*="vendedor"], [class*="terminal"]');
        
        tarjetas.forEach((card, index) => {
            if (card.querySelector('.btn-cierre-vendedor')) return;

            let nombreVendedor = "Vendedor_" + (index + 1);
            const titulo = card.querySelector('h3, h4, .title, strong, b');
            if (titulo && titulo.innerText.trim() !== '') {
                nombreVendedor = titulo.innerText.trim();
            }

            const btnCierre = document.createElement('button');
            btnCierre.className = 'btn-cierre-vendedor';
            btnCierre.innerHTML = '🔄 Reiniciar / Cierre de ' + nombreVendedor;
            btnCierre.style.cssText = `
                width: 100%;
                margin-top: 10px;
                background-color: #d9534f;
                color: white;
                font-weight: bold;
                padding: 8px 12px;
                border: none;
                border-radius: 5px;
                font-size: 13px;
                cursor: pointer;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            `;

            btnCierre.onclick = function(e) {
                e.stopPropagation();
                const confirmar = confirm(`⚠️ ¿Deseas hacer el Cierre Diario para "${nombreVendedor}"?\n\nSe archivará el historial de ventas de este vendedor y su banca volverá a $0.`);
                if (confirmar) {
                    const claveHistorial = 'historial_' + nombreVendedor.replace(/\s+/g, '_');
                    const ventasActuales = JSON.parse(localStorage.getItem(claveHistorial) || localStorage.getItem('historialRomasport') || '[]');
                    const reportesPrevios = JSON.parse(localStorage.getItem('reportesDiariosGuardados') || '[]');
                    
                    reportesPrevios.push({
                        vendedor: nombreVendedor,
                        fecha: new Date().toLocaleDateString(),
                        hora: new Date().toLocaleTimeString(),
                        totalVentas: ventasActuales
                    });

                    localStorage.setItem('reportesDiariosGuardados', JSON.stringify(reportesPrevios));
                    localStorage.removeItem(claveHistorial);
                    if (index === 0) localStorage.removeItem('historialRomasport');
                    
                    alert(`✅ Cierre completado para ${nombreVendedor}. Sus ventas pasaron al historial y su banca está en $0.`);
                    window.location.reload();
                }
            };

            card.appendChild(btnCierre);
        });
    }

    document.addEventListener("DOMContentLoaded", agregarBotonesPorVendedor);
    setInterval(agregarBotonesPorVendedor, 1500);
})();
