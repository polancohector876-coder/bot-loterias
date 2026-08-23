(function() {
    function agregarBotonCierreAdmin() {
        if (document.getElementById('btn-cierre-diario')) return;

        const contenedor = document.querySelector('.container, main, body');
        if (!contenedor) return;

        const btnCierre = document.createElement('button');
        btnCierre.id = 'btn-cierre-diario';
        btnCierre.innerHTML = '📊 Cierre Diario / Reiniciar Banca ($0)';
        btnCierre.style.cssText = `
            width: 100%;
            max-width: 400px;
            margin: 15px auto;
            display: block;
            background-color: #008cba;
            color: white;
            font-weight: bold;
            padding: 14px;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            cursor: pointer;
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        `;

        btnCierre.onclick = function() {
            const confirmar = confirm("⚠️ ¿Deseas hacer el Cierre Diario?\n\nSe guardará el historial de ventas actual como reporte del día anterior y se reiniciará el balance en $0 para el vendedor.");
            if (confirmar) {
                const ventasActuales = JSON.parse(localStorage.getItem('historialRomasport') || '[]');
                const reportesPrevios = JSON.parse(localStorage.getItem('reportesDiariosGuardados') || '[]');
                
                const fechaHoy = new Date().toLocaleDateString();
                reportesPrevios.push({
                    fecha: fechaHoy,
                    totalVentas: ventasActuales
                });

                localStorage.setItem('reportesDiariosGuardados', JSON.stringify(reportesPrevios));
                localStorage.removeItem('historialRomasport');
                
                alert("✅ Cierre completado. Las ventas anteriores quedaron archivadas y el balance está en $0.");
                window.location.reload();
            }
        };

        contenedor.prepend(btnCierre);
    }

    document.addEventListener("DOMContentLoaded", agregarBotonCierreAdmin);
    setTimeout(agregarBotonCierreAdmin, 1000);
})();
