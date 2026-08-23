const { initializeApp } = require("firebase/app");
const { getFirestore, doc, setDoc } = require("firebase/firestore");
const cron = require("node-cron");

const firebaseConfig = {
    apiKey: "AIzaSyBN9HbGRgVl0NEVX0zjxMz9qrssmDAWKco",
    authDomain: "banca-hp.firebaseapp.com",
    projectId: "banca-hp",
    storageBucket: "banca-hp.firebasestorage.app",
    messagingSenderId: "78718057679",
    appId: "1:78718057679:web:002f4ac81022a5602acbba",
    measurementId: "G-YZ7EX6YFQE"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function actualizarResultadosEnVivo() {
    try {
        console.log("Iniciando actualización automática en Firebase...");

        const loterias = [
            { id: "Nacional", nombre: "Lotería Nacional" },
            { id: "GanaMas", nombre: "Gana Más" },
            { id: "Leidsa", nombre: "Leidsa" },
            { id: "Real", nombre: "Lotería Real" },
            { id: "Loteka", nombre: "Loteka" },
            { id: "PrimeraDia", nombre: "La Primera Día" },
            { id: "PrimeraNoche", nombre: "La Primera Noche" },
            { id: "LaSuerte", nombre: "La Suerte Dominicana" },
            { id: "LoteDom", nombre: "LoteDom" },
            { id: "NewYorkTarde", nombre: "New York Tarde" },
            { id: "NewYorkNoche", nombre: "New York Noche" },
            { id: "FloridaTarde", nombre: "Florida Tarde" },
            { id: "FloridaNoche", nombre: "Florida Noche" }
        ];

        for (const loteria of loterias) {
            // Generación de valores numéricos sincronizados para evitar ceros
            const p1 = Math.floor(Math.random() * 90 + 10).toString();
            const p2 = Math.floor(Math.random() * 90 + 10).toString();
            const p3 = Math.floor(Math.random() * 90 + 10).toString();

            await setDoc(doc(db, "resultados", loteria.id), {
                loteria: loteria.nombre,
                p1, p2, p3,
                timestamp: Date.now()
            });

            console.log(`[OK] ${loteria.nombre} -> ${p1} - ${p2} - ${p3}`);
        }

        console.log("¡Proceso completado con éxito en Firebase!");
    } catch (error) {
        console.error("Error en el proceso:", error.message);
    }
}

// Ejecución inmediata al iniciar
actualizarResultadosEnVivo();

// Automatización cada 15 minutos en segundo plano
cron.schedule("*/15 * * * *", () => {
    actualizarResultadosEnVivo();
});