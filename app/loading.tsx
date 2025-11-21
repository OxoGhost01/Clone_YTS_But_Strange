import { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { Audio } from 'expo-av';

SplashScreen.preventAutoHideAsync();

export default function LoadingScreen() {
    useEffect(() => {
        const prepare = async () => {
        // 1) Charger et jouer le son
        const { sound } = await Audio.Sound.createAsync(
            require('../assets/sounds/startup.mp3') // Mets ton fichier ici
        );
        await sound.playAsync();

        // 2) Attendre (optionnel)
        await new Promise(res => setTimeout(res, 2000));

        // 3) Cacher le splash
        await SplashScreen.hideAsync();
        };

        prepare();
    }, []);

    return (
        <View style={styles.container}>
        <Text style={styles.title}>Loading...</Text>
        <ActivityIndicator size="large" color="#AA00FF" />
        </View>
    );
    }

    const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black'
    },
    title: {
        color: 'white',
        fontSize: 22,
        marginBottom: 20
    }
});
