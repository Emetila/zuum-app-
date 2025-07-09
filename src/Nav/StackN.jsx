import { createStackNavigator } from "@react-navigation/stack";
import { useFonts } from "expo-font";
import { View, ActivityIndicator } from "react-native";
import Splash from "../Screens/Onboarding/Splash";
import Onboarding from "../Screens/Onboarding/OnboardScreen";
import SignInScreen from "../Screens/Auth/SignInScreen";
import SignUpScreen from "../Screens/Auth/SignUpScreen";
import HomeScreen from "../Screens/home/HomeScreen";
import ManualLocationScreen from "../Screens/Services/ManualLocationScreen";

const Stack = createStackNavigator();

const StackN = () => {
  const [fontsLoaded] = useFonts({
    "Barlow-Bold": require("../../assets/fonts/Barlow-Bold.ttf"),
    "Barlow-MediumItalic": require("../../assets/fonts/Barlow-MediumItalic.ttf"),
    "Barlow-SemiBold": require("../../assets/fonts/Barlow-SemiBold.ttf"),
    "Barlow-Regular": require("../../assets/fonts/Barlow-Regular.ttf"),
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Splash" component={Splash} />
      <Stack.Screen name="Onboarding" component={Onboarding} />
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="ManualLocation" component={ManualLocationScreen} />
    </Stack.Navigator>
  );
};

export default StackN;
