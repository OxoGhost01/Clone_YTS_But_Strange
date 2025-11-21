import { useState } from 'react';
import { StyleSheet, TextInput, Pressable } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useRouter } from 'expo-router';
import { useAuth } from './authContext';

export default function ModalAccount() {
const router = useRouter();

const [user, setUser] = useState('');
const [mdp, setMdp] = useState('');
const [logged, setLogged] = useState(false);
const [error, setError] = useState('');

const { connected, setConnected } = useAuth();


function handleLogin() {
if (user === "azerty" && mdp === "ytreza") {
    setConnected(true);
    router.back(); // close modal
} else {
    alert("Wrong credentials");
}
}

return (
    <View style={styles.container}>
    {!logged ? (
        <>
        <Text style={styles.title}>Sign in</Text>

        <TextInput
            placeholder="Username"
            placeholderTextColor="#777"
            style={styles.input}
            value={user}
            onChangeText={setUser}
        />

        <TextInput
            placeholder="Password"
            placeholderTextColor="#777"
            secureTextEntry
            style={styles.input}
            value={mdp}
            onChangeText={setMdp}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Pressable onPress={handleLogin} style={styles.button}>
            <Text style={{ color: 'white' }}>Log in</Text>
        </Pressable>
        </>
    ) : (
        <View style={{ alignItems: 'center' }}>
        <Text style={styles.welcome}>Welcome azerty!</Text>

        <Pressable
            onPress={() => router.back()}
            style={[styles.button, { backgroundColor: '#444' }]}
        >
            <Text style={{ color: 'white' }}>Close</Text>
        </Pressable>
        </View>
    )}
    </View>
);
}

const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
},

title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
},

input: {
    width: '80%',
    padding: 14,
    backgroundColor: '#222',
    borderRadius: 10,
    color: 'white',
    marginVertical: 8,
},

button: {
    marginTop: 15,
    padding: 14,
    borderRadius: 10,
    backgroundColor: '#AA00FF',
    width: 140,
    alignItems: 'center',
},

error: {
    color: '#ff5555',
    marginTop: 5,
},

welcome: {
    color: 'black',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
},
});
