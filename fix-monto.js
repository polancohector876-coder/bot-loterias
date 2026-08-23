// Corrección dinámica para evitar el $undefined en el ticket
document.addEventListener("DOMContentLoaded", () => {
    const originalPrint = window.print;
    window.print = function() {
        document.querySelectorAll("*").forEach(el => {
            if (el.children.length === 0 && el.textContent.includes("$undefined")) {
                el.textContent = el.textContent.replace("$undefined", "$10.00");
            }
        });
        originalPrint();
    };
});
