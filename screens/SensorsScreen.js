import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { accelerometer, SensorTypes, setUpdateIntervalForType } from 'react-native-sensors';

const SensorsScreen = () => {
  const [location, setLocation] = useState({});
  const [orientation, setOrientation] = useState({});

  useEffect(() => {
    // Update location every 10 seconds
    const locationWatchId = Geolocation.watchPosition(
      (position) => {
        const { altitude, longitude, latitude, speed } = position.coords;
        setLocation({ altitude, longitude, latitude, speed });
      },
      (error) => console.log(error),
      { enableHighAccuracy: true, distanceFilter: 0, interval: 10000 }
    );

    // Update orientation every 500 milliseconds
    setUpdateIntervalForType(SensorTypes.accelerometer, 500);
    const orientationSubscription = accelerometer.subscribe(
      ({ x, y, z }) => {
        setOrientation({ x, y, z });
      },
      (error) => console.log('The sensor is not available')
    );

    return () => {
      Geolocation.clearWatch(locationWatchId);
      orientationSubscription.unsubscribe();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text>Altitude: {location.altitude}</Text>
      <Text>Longitude: {location.longitude}</Text>
      <Text>Latitude: {location.latitude}</Text>
      <Text>Speed: {location.speed}</Text>
      <Text>X: {orientation.x}</Text>
      <Text>Y: {orientation.y}</Text>
      <Text>Z: {orientation.z}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SensorsScreen;
