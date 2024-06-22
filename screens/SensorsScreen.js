import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { accelerometer, SensorTypes, setUpdateIntervalForType } from 'react-native-sensors';
import { requestMultiple, PERMISSIONS } from 'react-native-permissions';

const SensorsScreen = () => {
  const [location, setLocation] = useState({});
  const [orientation, setOrientation] = useState({});
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    const requestPermissions = async () => {
      const statuses = await requestMultiple([
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
      ]);
      if (statuses[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION] === 'granted' &&
          statuses[PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION] === 'granted') {
        setHasPermission(true);
      } else {
        Alert.alert('Permissions not granted', 'Please enable location and sensor permissions in your device settings.');
      }
    };

    requestPermissions();
  }, []);

  useEffect(() => {
    if (!hasPermission) return;

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
  }, [hasPermission]);

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text>Waiting for permissions...</Text>
      </View>
    );
  }

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
