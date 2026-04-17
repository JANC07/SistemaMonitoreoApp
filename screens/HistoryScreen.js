// Reemplaza TODO el contenido de screens/HistoryScreen.js
import React from 'react';
import { StyleSheet, View, Text, FlatList, StatusBar, TouchableOpacity } from 'react-native';

const HistoryScreen = ({ navigation, route }) => {
  const { nombreSensor = 'Todos los sensores' } = route.params || {};
  // Datos de historial simulados con el nuevo diseño
  const historyData = [
    { id: '1', sensor: 'MQ-135', valor: 400, estado: 'Seguro', hora: '10:30 AM', icon: '🍃' },
    { id: '2', sensor: 'CO2', valor: 700, estado: 'Precaución', hora: '10:28 AM', icon: '💨' },
    { id: '3', sensor: 'Gas', valor: 1200, estado: 'Peligroso', hora: '10:25 AM', icon: '⚠️' },
    { id: '4', sensor: 'Temperatura', valor: 28, estado: 'Normal', hora: '10:20 AM', icon: '🌡️' },
    { id: '5', sensor: 'MQ-135', valor: 380, estado: 'Seguro', hora: '10:15 AM', icon: '🍃' },
  ];

  const getStatusColor = (estado) => {
    switch (estado) {
      case 'Seguro': case 'Normal': return '#2ecc71'; // Verde neón
      case 'Precaución': return '#f1c40f'; // Amarillo
      case 'Peligroso': return '#e74c3c'; // Rojo
      default: return '#fff';
    }
  };

  const renderHistoryItem = ({ item }) => {
    const statusColor = getStatusColor(item.estado);
    
    return (
      <View style={styles.historyCard}>
        {/* Indicador lateral de color (estilo neón) */}
        <View style={[styles.statusIndicator, { backgroundColor: statusColor }]} />
        
        <View style={styles.cardContent}>
          <View style={styles.itemHeader}>
            <Text style={styles.itemTitle}>{item.icon} {item.sensor}</Text>
            <Text style={styles.itemTime}>{item.hora}</Text>
          </View>
          
          <View style={styles.itemDataRow}>
            <Text style={styles.itemLabel}>Valor:</Text>
            <Text style={styles.itemValue}>{item.valor}</Text>
          </View>
          
          <View style={styles.itemDataRow}>
            <Text style={styles.itemLabel}>Estado:</Text>
            <Text style={[styles.itemStatus, { color: statusColor }]}>{item.estado}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Cabecera personalizada para que combine */}
      <View style={styles.headerH}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtnH}>
          <Text style={styles.backBtnTextH}>〈</Text>
        </TouchableOpacity>
        <Text style={styles.titleH}>Historial de Mediciones 📊</Text>
      </View>
      <Text style={styles.filtroTexto}>Mostrando: {nombreSensor}</Text>

      <FlatList
        data={historyData}
        renderItem={renderHistoryItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', paddingTop: 50 },
  headerH: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 20 },
  backBtnH: { marginRight: 15 },
  backBtnTextH: { color: '#3498db', fontSize: 26, fontWeight: 'bold' },
  titleH: { fontSize: 22, fontWeight: 'bold', color: '#fff', letterSpacing: 1 },
  listContent: { paddingBottom: 30 },
  historyCard: {
    backgroundColor: '#161b22', borderRadius: 12, marginHorizontal: 15, marginBottom: 15, flexDirection: 'row', overflow: 'hidden',
    elevation: 8, shadowColor: '#fff', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 5,
  },
  statusIndicator: { width: 6, height: '100%' },
  cardContent: { flex: 1, padding: 15 },
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, paddingBottom: 5, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  itemTitle: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
  itemTime: { fontSize: 12, color: '#8b949e' },
  itemDataRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  itemLabel: { fontSize: 13, color: '#8b949e', marginRight: 8 },
  itemValue: { fontSize: 13, color: '#fff', fontWeight: '600' },
  itemStatus: { fontSize: 13, fontWeight: 'bold' },
  filtroTexto: { color: '#8b949e', fontSize: 13, marginLeft: 15, marginBottom: 10 }
});

export default HistoryScreen;