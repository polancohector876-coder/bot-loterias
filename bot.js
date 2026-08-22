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

// Lista completa de loterías
const loterias = [
    { id: "Nacional", nombre: "Lotería Nacional", p1: "53", p2: "02", p3: "40" },
    { id: "GanaMas", nombre: "Gana Más", p1: "82", p2: "54", p3: "16" },
    { id: "Leidsa", nombre: "Leidsa", p1: "00", p2: "00", p3: "00" },
    { id: "Real", nombre: "Lotería Real", p1: "00", p2: "00", p3: "00" },
    { id: "Loteka", nombre: "Loteka", p1: "00", p2: "00", p3: "00" },
    { id: "PrimeraDia", nombre: "La Primera Día", p1: "00", p2: "00", p3: "00" },
    { id: "PrimeraNoche", nombre: "La Primera Noche", p1: "00", p2: "00", p3: "00" },
    { id: "LaSuerte", nombre: "La Suerte Dominicana", p1: "00", p2: "00", p3: "00" },
    { id: "LoteDom", nombre: "LoteDom", p1: "00", p2: "00", p3: "00" },
    { id: "NewYorkTarde", nombre: "New York Tarde", p1: "00", p2: "00", p3: "00" },
    { id: "NewYorkNoche", nombre: "New York Noche", p1: "00", p2: "00", p3: "00" },
    { id: "FloridaTarde", nombre: "Florida Tarde", p1: "00", p2: "00", p3: "00" },
    { id: "FloridaNoche", nombre: "Florida Noche", p1: "00", p2: "00", p3: "00" }
];

async function actualizarResultadosEnVivo() {
    try {
        console.log("Consultando resultados en vivo...");

        // Recorre cada lotería e inserta o actualiza su documento único en Firebase
        for (const loteria of loterias) {
            await setDoc(doc(db, "resultados", loteria.id), {
                loteria: loteria.nombre,
                p1: loteria.p1,
                p2: loteria.p2,
                p3: loteria.p3,
                timestamp: Date.now()
            });
        }

        console.log("¡Todas las loterías actualizadas en Firebase con éxito!");
    } catch (error) {
        console.error("Error al actualizar resultados:", error);
    }
}

// Ejecución al iniciar en Render
actualizarResultadosEnVivo();

// Programado para actualizar automáticamente cada hora en segundo plano
cron.schedule("0 * * * *", () => {
    console.log("Ejecutando actualización programada...");
    actualizarResultadosEnVivo();
});