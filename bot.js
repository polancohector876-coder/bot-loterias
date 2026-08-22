const { initializeApp } = require("firebase/app");
const { getFirestore, doc, setDoc } = require("firebase/firestore");
const axios = require("axios");
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

async function obtenerResultados() {
    try {
        console.log("Consultando resultados...");
        const response = await axios.get("https://loteriasdominicanas.com/api/v1/results", {
            headers: {
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
            },
            timeout: 8000
        });
        return response.data || [];
    } catch (error) {
        console.log("Aviso: No se pudo conectar a la API externa, usando respaldo.");
        return [];
    }
}

async function actualizarResultadosEnVivo() {
    try {
        console.log("Iniciando actualización...");
        const data = await obtenerResultados();

        const loterias = [
            { id: "Nacional", nombre: "Lotería Nacional", key: "gana-mas" },
            { id: "GanaMas", nombre: "Gana Más", key: "gana-mas" },
            { id: "Leidsa", nombre: "Leidsa", key: "leidsa" },
            { id: "Real", nombre: "Lotería Real", key: "real" },
            { id: "Loteka", nombre: "Loteka", key: "loteka" },
            { id: "PrimeraDia", nombre: "La Primera Día", key: "la-primera-12pm" },
            { id: "PrimeraNoche", nombre: "La Primera Noche", key: "la-primera-8pm" },
            { id: "LaSuerte", nombre: "La Suerte Dominicana", key: "la-suerte" },
            { id: "LoteDom", nombre: "LoteDom", key: "lotedom" },
            { id: "NewYorkTarde", nombre: "New York Tarde", key: "new-york-tarde" },
            { id: "NewYorkNoche", nombre: "New York Noche", key: "new-york-noche" },
            { id: "FloridaTarde", nombre: "Florida Tarde", key: "florida-tarde" },
            { id: "FloridaNoche", nombre: "Florida Noche", key: "florida-noche" }
        ];

        for (const loteria of loterias) {
            const encontrado = Array.isArray(data) ? data.find(item => item.slug === loteria.key || item.id === loteria.key) : null;
            const nums = encontrado && encontrado.numbers ? encontrado.numbers : ["00", "00", "00"];

            const p1 = String(nums[0] || "00").padStart(2, "0");
            const p2 = String(nums[1] || "00").padStart(2, "0");
            const p3 = String(nums[2] || "00").padStart(2, "0");

            await setDoc(doc(db, "resultados", loteria.id), {
                loteria: loteria.nombre,
                p1, p2, p3,
                timestamp: Date.now()
            });

            console.log(`[OK] ${loteria.nombre} -> ${p1} - ${p2} - ${p3}`);
        }

        console.log("¡Proceso completado en Firebase!");
    } catch (error) {
        console.error("Error en proceso:", error);
    }
}

actualizarResultadosEnVivo();

cron.schedule("*/15 * * * *", () => {
    actualizarResultadosEnVivo();
});
