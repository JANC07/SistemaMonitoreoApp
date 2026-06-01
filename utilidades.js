// URL base del backend de Yii2
// Emulador Android: '10.0.2.2' apunta al localhost de tu PC.
// Dispositivo físico: reemplaza con la IP local de tu PC (ej: 192.168.1.X).
const API_BASE_URL = 'http://192.168.101.22/sistema_monitoreo_yii/frontend/web/index.php?r=';

// 1. Memoria temporal: Valores por defecto por si la red falla
export let umbralesApp = {
  mq5: 300,   // Límite por defecto del MQ-5 en ppm
  mq135: 150  // Límite por defecto del MQ-135 en ppm
};

// 2. Función para descargar los umbrales desde Yii2 UNA SOLA VEZ al abrir la app
export const cargarUmbralesDesdeFirebase = async () => {
  try {
    const respuesta = await fetch(`${API_BASE_URL}sensor/umbrales`);
    const json = await respuesta.json();

    if (json.ok) {
      umbralesApp.mq5   = json.mq5;
      umbralesApp.mq135 = json.mq135;
      console.log('Umbrales dinámicos cargados exitosamente:', umbralesApp);
    }
  } catch (error) {
    console.error('Error al cargar umbrales desde Yii2:', error);
  }
};

// 3. Lógica centralizada para los colores
export const calcularColor = (valor, tipoSensor) => {
  const limiteBase = tipoSensor === 'MQ-5' ? umbralesApp.mq5 : umbralesApp.mq135;

  if (valor < limiteBase) return '#2ecc71';            // Verde  (Seguro)
  if (valor < limiteBase * 1.5) return '#f1c40f';      // Amarillo (Precaución)
  return '#e74c3c';                                    // Rojo   (Peligro)
};

// 4. Lógica centralizada para el texto de Estado
export const calcularEstadoTexto = (valor, tipoSensor) => {
  const limiteBase = tipoSensor === 'MQ-5' ? umbralesApp.mq5 : umbralesApp.mq135;

  if (valor < limiteBase) return 'Seguro';
  if (valor < limiteBase * 1.5) return 'Precaución';
  return 'Peligro';
};