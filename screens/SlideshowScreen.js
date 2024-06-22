import React, { useEffect, useState, useRef } from 'react';
import { View, Button, FlatList, Image, StyleSheet } from 'react-native';
import RNFS from 'react-native-fs';

const SlideshowScreen = () => {
  const [images, setImages] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const flatListRef = useRef(null);
  const currentIndex = useRef(0);

  const loadImages = async () => {
    const files = await RNFS.readDir(RNFS.DocumentDirectoryPath);
    const imageFiles = files.filter((file) => file.name.endsWith('.jpg'));
    setImages(imageFiles);
  };

  useEffect(() => {
    loadImages();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused && images.length > 0) {
        currentIndex.current = (currentIndex.current + 1) % images.length;
        flatListRef.current.scrollToIndex({ index: currentIndex.current, animated: true });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [images, isPaused]);

  return (
    <View style={styles.container}>
      <Button title={isPaused ? 'Resume' : 'Pause'} onPress={() => setIsPaused(!isPaused)} />
      <FlatList
        ref={flatListRef}
        data={images}
        keyExtractor={(item) => item.path}
        renderItem={({ item }) => <Image source={{ uri: `file://${item.path}` }} style={styles.image} />}
        horizontal
        pagingEnabled
        scrollEnabled={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: 300,
    height: 300,
  },
});

export default SlideshowScreen;
