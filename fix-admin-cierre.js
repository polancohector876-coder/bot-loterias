(function() {
    function agregarBotonesExactos() {
        // Selecciona las tarjetas reales de los vendedores
        const tarjetas = document.querySelectorAll('#monitoreoContent .card, .vendedor-card, div[class*="terminal-card"]');
        
        tarjetas.forEach((card) => {
            if (card.querySelector('.btn-cierre-vendedor')) return;

            // Obtener el nombre del vendedor
            const tituloEl = card.querySelector('.card-header, h3, h4, strong') || card;
            const nombreVendedor = (tituloEl.innerText || "Vendedor").split('\n')[0].trim();

            const btnCierre = document.createElement('button');
            btnCierre.className = 'btn-cierre-vendedor';
            btnCierre.innerHTML = '🔄 Reiniciar ($0)';
            btnCierre.style.cssText = `
                float: right;
                background-color: #dc3545;
                color: white;
                font-weight: bold;
                padding: 4px 10px;
                border: none;
                border-radius: 4px;
                font-size: 12px;
                cursor: pointer;
                margin-left: 10px;
            `;

            btnCierre.onclick = function(e) {
                e.stopPropagation();
                const confirmar = confirm(`⚠️ ¿Reiniciar la banca de "${nombreVendedor}" a $0?\n\nLas ventas actuales se guardarán en el historial diario.`);
                if (confirmar) {
                    const reportes = JSON.parse(localStorage.getItem('reportesDiariosGuardados') || '[]');
                    const ventasVendedor = JSON.parse(localStorage.getItem('historial_' + nombreVendedor) || '[]');
                    
                    reportes.push({
                        vendedor: nombreVendedor,
                        fecha: new Date().toLocaleDateString(),
                        hora: new Date().toLocaleTimeString(),
                        ventas: ventasVendedor
                    });

                    localStorage.setItem('reportesDiariosGuardados', JSON.stringify(reportes));
                    localStorage.removeItem('historial_' + nombreVendedor);
                    
                    alert(`✅ Cierre completado para ${nombreVendedor}. Banca en $0.`);
                    window.location.reload();
                }
            };

            const header = card.querySelector('.card-header, div:first-child') || card;
            header.appendChild(btnCierre);
        });
    }

    document.addEventListener("DOMContentLoaded", agregarBotonesExactos);
    setTimeout(agregarBotonesExactos, 1000);
})();
