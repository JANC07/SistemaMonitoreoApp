// URL base del backend de Yii2
// Emulador Android: '10.0.2.2' apunta al localhost de tu PC.
// Dispositivo físico: reemplaza con la IP local de tu PC (ej: 192.168.1.X).
const API_BASE_URL = 'http://192.168.101.22/sistema_monitoreo_yii/frontend/web/index.php?r=';

// 1. Memoria temporal: Valores por defecto por si la red falla
export let umbralesApp = {
  mq5: 1200,      // Fallback MQ-5 (fuga de gas)
  mq135: 3100,    // Fallback MQ-135 (nivel amarillo)
  mq135Rojo: 3500 // Fallback MQ-135 (nivel rojo)
};

// 2. Función para descargar los umbrales desde Yii2 UNA SOLA VEZ al abrir la app
export const cargarUmbralesDesdeFirebase = async () => {
  try {
    const respuesta = await fetch(`${API_BASE_URL}sensor/umbrales`);
    const json = await respuesta.json();

    if (json.ok) {
      umbralesApp.mq135     = json.mq135_amarillo;
      umbralesApp.mq135Rojo = json.mq135_rojo;
      umbralesApp.mq5       = json.mq5_fuga;
      console.log('Umbrales dinámicos cargados exitosamente:', umbralesApp);
    }
  } catch (error) {
    console.error('Error al cargar umbrales desde Yii2:', error);
  }
};

// 3. Lógica centralizada para los colores
export const calcularColor = (valor, tipoSensor) => {
  if (tipoSensor === 'MQ-5') {
    // MQ-5: solo dos zonas (seguro / fuga)
    if (valor < umbralesApp.mq5) return '#2ecc71';  // Verde  (Seguro)
    return '#e74c3c';                                // Rojo   (Fuga de gas)
  } else {
    // MQ-135: tres zonas (seguro / precaución / peligro)
    if (valor < umbralesApp.mq135)    return '#2ecc71';  // Verde  (Seguro)
    if (valor < umbralesApp.mq135Rojo) return '#f1c40f'; // Amarillo (Precaución)
    return '#e74c3c';                                    // Rojo   (Peligro)
  }
};

// 4. Lógica centralizada para el texto de Estado
export const calcularEstadoTexto = (valor, tipoSensor) => {
  if (tipoSensor === 'MQ-5') {
    if (valor < umbralesApp.mq5) return 'Seguro';
    return 'Peligro';
  } else {
    if (valor < umbralesApp.mq135)    return 'Seguro';
    if (valor < umbralesApp.mq135Rojo) return 'Precaución';
    return 'Peligro';
  }
};