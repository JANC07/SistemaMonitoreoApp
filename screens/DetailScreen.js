import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, ScrollView, TouchableOpacity } from 'react-native';

const { width } = Dimensions.get('window');

export default function DetailScreen({ route, navigation }) {
  const { sensor, valor, unidad, fecha } = route.params || {};
  const [valorActual, setValorActual] = useState(valor);
  const scale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scale, { toValue: 1, friction: 5, useNativeDriver: true }).start();
    const interval = setInterval(() => {
      setValorActual(v => v + Math.floor(Math.random() * 10 - 5));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const getColor = () => {
    if (valorActual < 500) return '#2ecc71';
    if (valorActual < 1000) return '#f1c40f';
    return '#e74c3c';
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.headerTitle}>{sensor}</Text>

        <Animated.View style={[styles.mainCard, { borderColor: getColor(), transform: [{ scale }] }]}>
          <Text style={styles.label}>VALOR EN TIEMPO REAL</Text>
          <View style={styles.row}>
            <Text style={styles.bigValue}>{valorActual}</Text>
            <Text style={styles.unit}>{unidad}</Text>
          </View>
          <View style={[styles.badge, { backgroundColor: getColor() }]}>
            <Text style={styles.badgeText}>{valorActual < 800 ? 'ESTABLE' : 'CRÍTICO'}</Text>
          </View>
        </Animated.View>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>MÉTRICAS DETALLADAS</Text>
          <View style={styles.dataRow}><Text style={styles.dataL}>Última toma:</Text><Text style={styles.dataV}>{fecha}</Text></View>
          <View style={styles.dataRow}><Text style={styles.dataL}>Estado:</Text><Text style={[styles.dataV, {color: getColor()}]}>{valorActual < 800 ? 'Saludable' : 'Riesgo'}</Text></View>
          <View style={styles.dataRow}><Text style={styles.dataL}>Hardware:</Text><Text style={styles.dataV}>Activo</Text></View>
        </View>

        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>REGRESAR AL DASHBOARD</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0b10' },
  scroll: { alignItems: 'center', padding: 20 },
  headerTitle: { fontSize: 24, fontWeight: '900', color: '#fff', marginTop: 50, marginBottom: 30, letterSpacing: 2 },
  mainCard: { 
    width: width * 0.85, 
    backgroundColor: '#161b22', 
    borderRadius: 30, 
    padding: 40, 
    alignItems: 'center', 
    borderWidth: 2,
    elevation: 25, shadowColor: '#000', shadowOpacity: 0.5, shadowRadius: 15
  },
  label: { color: '#8b949e', fontSize: 12, fontWeight: 'bold', marginBottom: 10 },
  row: { flexDirection: 'row', alignItems: 'baseline' },
  bigValue: { fontSize: 75, fontWeight: '900', color: '#fff' },
  unit: { fontSize: 20, color: '#8b949e', marginLeft: 10 },
  badge: { marginTop: 20, paddingHorizontal: 25, paddingVertical: 8, borderRadius: 20 },
  badgeText: { fontWeight: 'bold', fontSize: 14 },
  infoBox: { width: width * 0.85, backgroundColor: '#161b22', marginTop: 30, borderRadius: 20, padding: 25 },
  infoTitle: { color: '#8b949e', fontSize: 12, fontWeight: 'bold', marginBottom: 15 },
  dataRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  dataL: { color: '#fff', opacity: 0.6 },
  dataV: { color: '#fff', fontWeight: 'bold' },
  backBtn: { marginTop: 40 },
  backBtnText: { color: '#58a6ff', fontWeight: 'bold', letterSpacing: 1 }
});