import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  ScrollView,
  Animated
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { PanGestureHandler } from "react-native-gesture-handler";

const { width, height } = Dimensions.get("window");

export default function RideBookingMap() {
  const [selectedLocation, setSelectedLocation] = useState("pickup");
  const mapRef = useRef(null);

  // Sample coordinates (Lagos, Nigeria area)
  const initialRegion = {
    latitude: 6.5244,
    longitude: 3.3792,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  const currentLocation = {
    latitude: 6.5244,
    longitude: 3.3792,
  };

  const poloLocation = {
    latitude: 6.5254,
    longitude: 3.3802,
  };

  const handleCenterMap = () => {
    mapRef.current?.animateToRegion(initialRegion, 1000);
  };

  const handleMyLocation = () => {
    mapRef.current?.animateToRegion(
      {
        ...currentLocation,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      },
      1000
    );
  };

  // Bottom panel animation
  const translateY = useRef(new Animated.Value(0)).current;
  const [panelHeight, setPanelHeight] = useState(300); // Default height
  const minHeight = 120; // Collapsed height
  const maxHeight = 400; // Expanded height

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationY: translateY } }],
    { useNativeDriver: false }
  );

  const onHandlerStateChange = (event) => {
    if (event.nativeEvent.oldState === 4) {
      // ACTIVE state ended
      const { translationY, velocityY } = event.nativeEvent;

      let toValue = 0;

      // Determine final position based on gesture
      if (velocityY > 400 || translationY > 100) {
        // Collapse panel
        toValue = maxHeight - minHeight;
        setPanelHeight(minHeight);
      } else if (velocityY < -500 || translationY < -100) {
        // Expand panel
        toValue = 0;
        setPanelHeight(maxHeight);
      } else {
        // Return to current state
        toValue = panelHeight === minHeight ? maxHeight - minHeight : 0;
      }

      Animated.spring(translateY, {
        toValue,
        useNativeDriver: false,
        tension: 100,
        friction: 8,
      }).start();
    }
  };

  const togglePanel = () => {
    const isCollapsed = panelHeight === minHeight;
    const toValue = isCollapsed ? 0 : maxHeight - minHeight;

    setPanelHeight(isCollapsed ? maxHeight : minHeight);

    Animated.spring(translateY, {
      toValue,
      useNativeDriver: false,
      tension: 100,
      friction: 8,
    }).start();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      {/* Google Map */}
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={initialRegion}
          showsUserLocation={true}
          showsMyLocationButton={false}
          showsCompass={false}
          toolbarEnabled={false}
          mapType="standard"
        >
          {/* Current Location Marker */}
          <Marker
            coordinate={currentLocation}
            title="My Current Location"
            description="Pickup location"
          >
            <View style={styles.currentLocationMarker}>
              <View style={styles.currentLocationDot} />
            </View>
          </Marker>

          {/* Polo Destination Marker */}
          <Marker
            coordinate={poloLocation}
            title="Polo"
            description="Drop-off location"
          >
            <View style={styles.destinationMarker}>
              <Ionicons name="location" size={30} color="#F44336" />
            </View>
          </Marker>
        </MapView>

        {/* Profile Picture Overlay */}
        <View style={styles.profileContainer}>
          <View style={styles.profilePicture}>
            <View style={styles.profileImage} />
          </View>
        </View>

        {/* Navigation Button Overlay */}
        <TouchableOpacity
          style={styles.navigationButton}
          onPress={handleCenterMap}
        >
          <FontAwesome5 name="location-arrow" size={24} color="white" />
        </TouchableOpacity>

        {/* Current Location Button Overlay */}
        <TouchableOpacity
          style={styles.locationButton}
          onPress={handleMyLocation}
        >
          {/* <Ionicons name="locate" size={20} color="black" /> */}
          <MaterialIcons name="my-location" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Bottom Panel */}
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
      >
        <Animated.View
          style={[
            styles.bottomPanel,
            {
              height: maxHeight,
              transform: [{ translateY }],
            },
          ]}
        >
          {/* Handle */}
          <TouchableOpacity
            onPress={togglePanel}
            style={styles.handleContainer}
          >
            <View style={styles.handle} />
          </TouchableOpacity>

          {/* Expandable Content */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.expandableContent}
          >
            <View style={{ flexDirection: "column" }}>
              <View>
                <Text style={styles.sectionTitle}>PICKUP</Text>

                <TouchableOpacity
                  style={[
                    styles.locationItem,
                    selectedLocation === "pickup" && styles.selectedLocation,
                  ]}
                  onPress={() => {
                    setSelectedLocation("pickup");
                    mapRef.current?.animateToRegion(
                      {
                        ...currentLocation,
                        latitudeDelta: 0.005,
                        longitudeDelta: 0.005,
                      },
                      1000
                    );
                  }}
                >
                  <View style={styles.greenDot} />
                  <View style={styles.locationTextContainer}>
                    <Text style={styles.locationTitle}>My current</Text>
                    <Text style={styles.locationTitle}>location</Text>
                  </View>
                </TouchableOpacity>
              </View>

              <View style={{ flexDirection: "row", paddingBottom: 30 }}>
                <View style={{ gap: 4, paddingLeft: 10, marginTop: -15 }}>
                  <View
                    style={{ width: 2, backgroundColor: "#C8C7CC", height: 8 }}
                  ></View>
                  <View
                    style={{ width: 2, backgroundColor: "#C8C7CC", height: 8 }}
                  ></View>
                  <View
                    style={{ width: 2, backgroundColor: "#C8C7CC", height: 8 }}
                  ></View>
                  <View
                    style={{ width: 2, backgroundColor: "#C8C7CC", height: 8 }}
                  ></View>
                </View>
                <View>
                  <Text style={[styles.sectionTitle, { marginTop: 15 }]}>
                    DROP-OFF
                  </Text>

                  <TouchableOpacity
                    style={[
                      styles.locationItem,
                      selectedLocation === "dropoff" && styles.selectedLocation,
                    ]}
                    onPress={() => {
                      setSelectedLocation("dropoff");
                      mapRef.current?.animateToRegion(
                        {
                          ...poloLocation,
                          latitudeDelta: 0.005,
                          longitudeDelta: 0.005,
                        },
                        1000
                      );
                    }}
                  >
                    <View style={{ marginLeft: -15 }}>
                      <MaterialIcons
                        name="location-pin"
                        size={24}
                        color="red"
                      />
                    </View>
                    <Text style={styles.locationTitle}>Polo</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Suggestion Pills */}
            <View style={styles.suggestionContainer}>
              <TouchableOpacity style={styles.suggestionPill}>
                <Text style={styles.suggestionText}>
                  University of Maiduguri
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.suggestionPill}>
                <Text style={styles.suggestionText}>Post Office</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.suggestionPill}>
                <Text style={styles.suggestionText}>Sport Center</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Animated.View>
      </PanGestureHandler>
      {/* Home Indicator */}
      <View style={styles.homeIndicator} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },

  mapContainer: {
    flex: 1,
    position: "relative",
  },
  map: {
    flex: 1,
  },
  currentLocationMarker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "rgba(76, 175, 80, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "white",
  },
  currentLocationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#4CAF50",
  },
  destinationMarker: {
    alignItems: "center",
    justifyContent: "center",
  },
  profileContainer: {
    position: "absolute",
    top: 40,
    left: 20,
  },
  profilePicture: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  profileImage: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#8B4513",
  },
  navigationButton: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -25,
    marginLeft: -25,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#2196F3",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  locationButton: {
    position: "absolute",
    bottom: 140,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  bottomPanel: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: "#DADADA",
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 8,
    marginBottom: 20,
  },
  locationSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    color: "#C8C7CC",
    fontWeight: "500",
    letterSpacing: 1,
    paddingLeft: 10,
  },
  locationItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 5,
    borderRadius: 8,
  },

  greenDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#4CAF50",
    marginRight: 15,
  },
  redDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#F44336",
    marginRight: 15,
  },
  locationTextContainer: {
    flex: 1,
  },
  locationTitle: {
    fontSize: 16,
    color: "#333",
    fontWeight: "400",
  },
  suggestionContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    paddingBottom: 20,
  },
  suggestionPill: {
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  suggestionText: {
    fontSize: 14,
    color: "#666",
  },
  homeIndicator: {
    width: 134,
    height: 5,
    backgroundColor: "black",
    borderRadius: 2.5,
    alignSelf: "center",
    marginBottom: 10,
  },
});
