import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Video, ResizeMode } from 'expo-av';

const VideoBackground = ({ status }) => {
  // Seleccionamos el archivo según el estado
  const videoSource = status === 'BUENO' 
    ? require('../assets/bueno.mp4') 
    : require('../assets/malo.mp4');

  return (
    <View style={styles.container}>
      <Video
        source={videoSource}
        style={styles.video}
        shouldPlay
        isLooping
        resizeMode={ResizeMode.COVER}
        isMuted={true} // Importante: sin sonido para que no moleste
        shouldRasterizeIOS // Mejora el rendimiento en iOS
      />
      {/* Capa de color para que el texto sea legible */}
      <View style={[
        styles.overlay, 
        { backgroundColor: status === 'BUENO' ? 'rgba(46, 204, 113, 0.2)' : 'rgba(0, 0, 0, 0.4)' }
      ]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1, // Se coloca detrás de todo
  },
  video: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  }
});

export default VideoBackground;