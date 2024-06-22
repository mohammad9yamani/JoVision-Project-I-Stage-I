import React, { useState, useRef, useEffect } from 'react';
import { View, Button, StyleSheet, Image, Alert, Text } from 'react-native';
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';
import RNFS from 'react-native-fs';

const CameraScreen = () => {
  const [photo, setPhoto] = useState(null);
  const cameraRef = useRef(null);
  const device = useCameraDevice('back'); 
  const { hasPermission, requestPermission } = useCameraPermission();
  
  useEffect(() => {
    const checkPermission = async () => {
      if (!hasPermission) {
        const status = await requestPermission();
        console.log(status)
        if (!status) {
          Alert.alert('Permission Denied', 'Camera permission is required to take photos.');
        }
      }
    };

    checkPermission();
  }, [hasPermission, requestPermission]);

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo_captured = await cameraRef.current.takePhoto({
        qualityPrioritization: 'speed',
      });
      setPhoto(photo_captured.path);
    }
  };

  const savePicture = async () => {
    const destPath = `${RNFS.DocumentDirectoryPath}/${Date.now()}.jpg`;
    await RNFS.moveFile(photo, destPath);
    setPhoto(null);
    Alert.alert('Photo saved!', 'The photo has been saved successfully.');
  };

  const discardPicture = async () => {
    await RNFS.unlink(photo);
    setPhoto(null);
  };

  if (device == null || !hasPermission) return <View><Text>Loading...</Text></View>;

  return (
    <View style={styles.container}>
      {photo ? (
        <>
          <Image source={{ uri: `file://${photo}` }} style={styles.preview} />
          <Button title="Save" onPress={savePicture} />
          <Button title="Discard" onPress={discardPicture} />
        </>
      ) : (
        <Camera
          style={styles.camera}
          ref={cameraRef}
          device={device}
          isActive={true}
          photo={true}
        />
      )}
      {!photo && <Button title="Take Photo" onPress={takePicture} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  preview: {
    flex: 1,
    width: '100%',
  },
});

export default CameraScreen;
