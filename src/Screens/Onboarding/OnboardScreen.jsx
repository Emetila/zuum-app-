import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Alert,
   ActivityIndicator
} from "react-native";
import React, { useState, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import * as Location from 'expo-location';

const { width, height } = Dimensions.get("window");

const slides = [
  {
    id: "1",
    image: require("../../../assets/Images/Onboarding1.png"),
    title: "Request Ride",
    description: "Request a ride get picked up by a nearby community driver",
  },
  {
    id: "2",
    image: require("../../../assets/Images/Onboarding2.png"),
    title: "Confirm Your Driver",
    description:
      "Huge drivers network helps you find comfortable, safe and cheap ride",
  },
  {
    id: "3",
    image: require("../../../assets/Images/Onboarding3.png"),
    title: "Track your ride",
    description:
      "Know your driver in advance and be able to view current location in real time on the map",
  },
  {
    id: "4",
    image: require("../../../assets/Images/Onboarding4.png"),
    title: "Hi, nice to meet you!",
    description: "Choose your location to start find restaurants around you.",
    isWideImage: true,
  },
];

const Onboarding = () => {
  const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef(null);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = {
    viewAreaCoveragePercentThreshold: 50,
  };

  const handleGetStarted = () => {
    flatListRef.current.scrollToIndex({ index: 3, animated: true });
  };

  const handleUseCurrentLocation = async () => {
    setIsLoading(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Please enable location services to use this feature');
        return;
      }

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      navigation.navigate('Home', { 
        location: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        }
      });
    } catch (error) {
      Alert.alert('Error', 'Could not get your location. Please try again or select manually.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualSetup = () => {
    navigation.navigate('ManualLocation');
  };

  const renderItem = ({ item }) => (
    <View style={styles.slide}>
      <Image
        source={item.image}
        style={[styles.image, item.isWideImage && styles.wideImage]}
        resizeMode={item.isWideImage ? "cover" : "contain"}
      />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>

      {item.id === "3" && (
        <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
          <Text style={styles.buttonText}>GET STARTED!</Text>
        </TouchableOpacity>
      )}

      {item.id === "4" && (
        <View style={styles.locationButtons}>
          <TouchableOpacity
            style={[styles.GpLocationbutton, styles.locationButton]}
            onPress={handleUseCurrentLocation}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#0282F8" />
            ) : (
              <View style={styles.locationButtonContent}>
                <Image
                  source={require("../../../assets/Images/locationicon.png")}
                  style={styles.locationIcon}
                  resizeMode="contain"
                />
                <Text style={styles.GpLocationbuttonText}>
                  Use Current Location
                </Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={handleManualSetup}>
            <Text style={styles.manualText}>Set Location Manually</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />

      {/* Pagination indicators */}
      <View style={styles.pagination}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, currentIndex === index && styles.activeDot]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  slide: {
    width,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  image: {
    width: 290,
    height: 280,
    marginBottom: 40,
  },
  wideImage: {
    width: width * 1.0,
    height: height * 0.3,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontFamily: "Barlow-SemiBold",
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    paddingHorizontal: 30,
    color: "#666",
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#0282F8",
    paddingVertical: 15,
    paddingHorizontal: 55,
    borderRadius: 15,
    marginTop: 20,
  },
  GpLocationbutton: {
    borderColor: "#0282F8",
    borderWidth: 2,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 15,
    marginTop: 20,
    width: '80%',
  },
  locationButtonContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10, 
  },
  locationIcon: {
    width: 20,
    height: 20,
  },
  GpLocationbuttonText: {
    color: "#0282F8",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  locationButtons: {
    alignItems: "center",
    width: "100%",
  },
  locationButton: {
    width: "80%",
    alignItems: "center",
    marginBottom: 20,
  },
  manualText: {
    color: "#F52D56",
    fontSize: 14,
    textDecorationLine: "underline",
  },
  pagination: {
    flexDirection: "row",
    position: "absolute",
    bottom: 50,
    alignSelf: "center",
  },
  dot: {
    width: 25,
    height: 5,
    borderRadius: 5,
    backgroundColor: "#ccc",
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: "#0282F8",
  },
});

export default Onboarding;
