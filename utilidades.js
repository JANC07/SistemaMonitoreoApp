// Importamos la conexión a tu base de datos y los métodos para obtener datos de una sola vez (get)
import { db } from './firebase'; 
import { ref, get } from 'firebase/database';

// 1. Memoria temporal: Guardamos unos valores por defecto por si el internet falla
export let umbralesApp = {
  mq5: 300,   // Límite por defecto del MQ5 en ppm
  mq135: 150  // Límite por defecto del MQ135 en ppm
};

// 2. Función para descargar los umbrales de Firebase UNA SOLA VEZ al abrir la app
export const cargarUmbralesDesdeFirebase = async () => {
  try {
    // Apuntamos al nodo de configuración en tu base de datos
    const umbralesRef = ref(db, 'umbrales_configuracion');
    const snapshot = await get(umbralesRef);
    
    if (snapshot.exists()) {
      const data = snapshot.val();
      // Actualizamos nuestra memoria temporal con los datos reales de Firebase
      umbralesApp.mq5 = parseFloat(data.conf_mq5.valor_limite);
      umbralesApp.mq135 = parseFloat(data.conf_mq135.valor_limite);
      console.log("Umbrales dinámicos cargados exitosamente:", umbralesApp);
    }
  } catch (error) {
    console.error("Error al descargar los umbrales:", error);
  }
};

// 3. Lógica centralizada para los colores
export const calcularColor = (valor, tipoSensor) => {
  // Verificamos de qué sensor estamos hablando para usar su límite específico
  const limiteBase = tipoSensor === 'MQ-5' ? umbralesApp.mq5 : umbralesApp.mq135;

  if (valor < limiteBase) return '#2ecc71'; // Verde (Seguro)
  if (valor < (limiteBase * 1.5)) return '#f1c40f'; // Amarillo (Precaución) - Ej. hasta un 50% más del límite
  return '#e74c3c'; // Rojo (Peligro) - Supera el nivel amarillo
};

// 4. Lógica centralizada para el texto de Estado
export const calcularEstadoTexto = (valor, tipoSensor) => {
  const limiteBase = tipoSensor === 'MQ-5' ? umbralesApp.mq5 : umbralesApp.mq135;

  if (valor < limiteBase) return 'Seguro';
  if (valor < (limiteBase * 1.5)) return 'Precaución';
  return 'Peligro';
};