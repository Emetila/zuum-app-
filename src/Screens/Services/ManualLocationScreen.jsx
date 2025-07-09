import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const ManualLocationScreen = ({ navigation }) => {
 
  const [region, setRegion] = useState({
    latitude: 11.8469,
    longitude: 13.1571,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const [selectedLocation, setSelectedLocation] = useState(null);

  const handleMapPress = (e) => {
    const newCoordinate = e.nativeEvent.coordinate;
    setSelectedLocation(newCoordinate);
    
    // Update region to center on selected location
    setRegion({
      ...region,
      latitude: newCoordinate.latitude,
      longitude: newCoordinate.longitude,
    });
  };

  const handleConfirm = () => {
    if (!selectedLocation) return;
    
    navigation.navigate('Home', { 
      location: {
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
        address: 'Maiduguri, Borno State, Nigeria'
      }
    });
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={region}
        region={region}
        onPress={handleMapPress}
      >
        {selectedLocation && (
          <Marker
            coordinate={selectedLocation}
            title="Selected Location"
            description="Maiduguri, Borno State, Nigeria"
          />
        )}
      </MapView>

      <TouchableOpacity
        style={[
          styles.confirmButton,
          !selectedLocation && styles.disabledButton
        ]}
        onPress={handleConfirm}
        disabled={!selectedLocation}
      >
        <Text style={styles.buttonText}>Confirm Your Location</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  confirmButton: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    backgroundColor: '#0282F8',
    padding: 15,
    borderRadius: 10,
    width: '80%',
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default ManualLocationScreen;