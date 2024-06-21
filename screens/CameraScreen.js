import React, { useState, useRef } from 'react';
import { View, Text, Button, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { RNCamera } from 'react-native-camera';
import RNFS from 'react-native-fs';

const CameraScreen = () => {
  const cameraRef = useRef(null);
  const [photo, setPhoto] = useState(null);

  const takePicture = async () => {
    if (cameraRef.current) {
      const options = { quality: 0.5, base64: true };
      const data = await cameraRef.current.takePictureAsync(options);
      setPhoto(data.uri);
    }
  };

  const savePicture = async () => {
    const destPath = `${RNFS.DocumentDirectoryPath}/${Date.now()}.jpg`;
    await RNFS.moveFile(photo, destPath);
    setPhoto(null);
    // Return to camera for another picture
  };

  const discardPicture = async () => {
    await RNFS.unlink(photo);
    setPhoto(null);
    // Return to camera for another picture
  };

  return (
    <View style={styles.container}>
      {photo ? (
        <>
          <Image source={{ uri: photo }} style={styles.preview} />
          <Button title="Save" onPress={savePicture} />
          <Button title="Discard" onPress={discardPicture} />
        </>
      ) : (
        <RNCamera ref={cameraRef} style={styles.camera} />
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
