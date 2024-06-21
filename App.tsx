import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import CameraScreen from './screens/CameraScreen';
import SensorsScreen from './screens/SensorsScreen';
import GalleryScreen from './screens/GalleryScreen';
import SlideshowScreen from './screens/SlideshowScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Camera">
        <Stack.Screen name="Camera" component={CameraScreen} options={{ title: 'Camera' }} />
        <Stack.Screen name="Sensors" component={SensorsScreen} options={{ title: 'Sensors' }} />
        <Stack.Screen name="Gallery" component={GalleryScreen} options={{ title: 'Gallery' }} />
        <Stack.Screen name="Slideshow" component={SlideshowScreen} options={{ title: 'Slideshow' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
