import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import StackN from './src/Nav/StackN'; // Import your StackN component
import 'react-native-gesture-handler';

export default function App() {
  return (
    <NavigationContainer>
      <StackN />
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}