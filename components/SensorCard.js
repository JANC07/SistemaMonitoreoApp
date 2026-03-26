import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';

const SensorCard = ({ title, value, unit, onPress }) => {
  const isHigh = value > 800;
  const statusColor = isHigh ? '#e74c3c' : '#2ecc71';
  const progressWidth = Math.min((value / 2500) * 100, 100) + '%';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.indicator, { backgroundColor: statusColor }]} />
      <View style={styles.info}>
        <Text style={styles.name}>{title}</Text>
        <Text style={styles.val}>{value} <Text style={styles.uni}>{unit}</Text></Text>
        <View style={styles.barBg}>
          <View style={[styles.barFill, { width: progressWidth, backgroundColor: statusColor }]} />
        </View>
      </View>
      <Text style={[styles.arrow, { color: statusColor }]}>〉</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '100%',
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    elevation: 4,
  },
  indicator: { width: 6, height: '100%' },
  info: { flex: 1, padding: 18 },
  name: { fontSize: 13, fontWeight: '700', color: '#95a5a6', textTransform: 'uppercase' },
  val: { fontSize: 28, fontWeight: 'bold', color: '#2c3e50', marginVertical: 4 },
  uni: { fontSize: 14, color: '#7f8c8d' },
  barBg: { height: 6, backgroundColor: '#f0f0f0', borderRadius: 3, marginTop: 8 },
  barFill: { height: '100%', borderRadius: 3 },
  arrow: { fontSize: 22, fontWeight: 'bold', marginRight: 15, opacity: 0.4 }
});

export default SensorCard;