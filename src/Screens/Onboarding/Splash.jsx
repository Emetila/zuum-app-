import { Image, StyleSheet, Text, View, Animated } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';

const Splash = () => {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      navigation.navigate('Onboarding');
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [navigation, fadeAnim]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.logoContainer, { opacity: fadeAnim }]}>
        <Image 
          resizeMode='contain'   
          source={require('../../../assets/Images/Main Logo.png')} 
          style={styles.mainLogo}  
        />
      </Animated.View>
      
      <Animated.View style={[styles.bottomContainer, { opacity: fadeAnim }]}>
        <Image 
          resizeMode='contain'   
          source={require('../../../assets/Images/bottomLogo.png')} 
          style={styles.bottomLogo}  
        />
      </Animated.View>
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0282F8'
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainLogo: {
    width: 200, 
    height: 100,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 2,
  },
  bottomLogo: {
    width: 550,  
    height: 320,

  },
});