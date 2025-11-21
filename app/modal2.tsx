import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, Image, ScrollView, View, TextInput, Button } from 'react-native';

import { Text } from '@/components/Themed';
import { useLocalSearchParams } from 'expo-router';

import { ResizeMode, Video } from 'expo-av';

import { useAuth } from "./authContext";
import { useState } from "react";

export default function ModalScreen() {
const { id, title, description, nbEpisode, image } = useLocalSearchParams();

// make sure uri is string or undefined
const posterUri = image ? image.toString() : undefined;

const { connected } = useAuth();
const [comment, setComment] = useState("");
const [comments, setComments] = useState<string[]>([]);

return (
    <ScrollView contentContainerStyle={styles.scroll}>
    <View style={styles.container}>
        <Text style={styles.title}>Infos</Text>

        <Text style={styles.field}>ID: {id}</Text>
        <Text style={styles.field}>Titre: {title}</Text>
        <Text style={styles.field}>Episodes: {nbEpisode}</Text>
        <Text style={styles.description}>{description}</Text>

        {posterUri ? (
        <Image
            style={styles.poster}
            source={{ uri: posterUri }}
            accessibilityLabel="Poster"
        />
        ) : null}

        <Text style={styles.sectionTitle}>Lecture :</Text>
        
        <Video
            source={require('../assets/TAS.mp4')}
            useNativeControls
            resizeMode={ResizeMode.CONTAIN}
            style={styles.video}
        />
        <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
    {connected && (
            <View style={{ width: "100%", marginTop: 20, alignItems: "flex-start" }}>
                <Text style={styles.sectionTitle}>Commentaires :</Text>

                <TextInput
                    placeholder="Écris un commentaire..."
                    placeholderTextColor="#999"
                    style={{
                        backgroundColor: "#222",
                        color: "white",
                        padding: 10,
                        borderRadius: 8,
                        marginBottom: 10,
                        width: "100%",
                    }}
                    value={comment}
                    onChangeText={setComment}
                />

                <Button
                    title="Post"
                    onPress={() => {
                        if (comment.trim().length === 0) return;
                        setComments(prev => [...prev, comment]);
                        setComment("");
                        console.log(comments);
                    }}
                />

                <View style={{ marginTop: 10 }}>
                    {comments.map((c, i) => (
                        <Text key={i} style={{ color: "black", marginBottom: 6 }}>
                            • {c}
                        </Text>
                    ))}
                </View>
            </View>
        )}
    </ScrollView>
);
}

const styles = StyleSheet.create({
scroll: {
    paddingBottom: 40,
},

container: {
    padding: 20,
    alignItems: 'center',
    width: '100%',
},

title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 16,
},

field: {
    fontSize: 18,
    marginBottom: 6,
},

description: {
    fontSize: 16,
    marginVertical: 10,
    textAlign: 'center',
    maxWidth: 900,
},

poster: {
    width: '100%',
    maxWidth: 720,
    aspectRatio: 16 / 9,
    height: undefined,
    resizeMode: 'cover',
    borderRadius: 10,
    marginVertical: 12,
    alignSelf: 'center',
    backgroundColor: '#222',
},

sectionTitle: {
    fontSize: 22,
    marginTop: 20,
    marginBottom: 10,
    fontWeight: 'bold',
    alignSelf: 'center',
},

video: {
width: '100%',
maxWidth: 720,
height: 400,
alignSelf: 'center',
},
});
