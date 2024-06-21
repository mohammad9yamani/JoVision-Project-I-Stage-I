import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, RefreshControl } from 'react-native';
import RNFS from 'react-native-fs';

const GalleryScreen = () => {
  const [images, setImages] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadImages = async () => {
    const files = await RNFS.readDir(RNFS.DocumentDirectoryPath);
    const imageFiles = files.filter((file) => file.name.endsWith('.jpg'));
    setImages(imageFiles);
  };

  useEffect(() => {
    loadImages();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadImages().then(() => setRefreshing(false));
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={images}
        keyExtractor={(item) => item.path}
        renderItem={({ item }) => <Image source={{ uri: item.path }} style={styles.image} />}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: 100,
    height: 100,
    margin: 5,
  },
});

export default GalleryScreen;
