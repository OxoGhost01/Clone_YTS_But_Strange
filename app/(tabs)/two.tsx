import { StyleSheet, Image, ScrollView, Pressable, TextInput } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import { Text, View } from '@/components/Themed';
import { Link } from 'expo-router';
import { useEffect, useState } from 'react';

type Serie = {
  id: number,
  title: string,
  description: string,
  nbEpisode: number,
  image: string,
  episodesInfos: {
    id: number,
    title: string,
    duration: number,
    views: number,
    serieId: number
  }[]
};

type SerieProps = { serie: Serie };

const SerieCard = ({ serie }: SerieProps) => {
  return (
    <View style={styles.card}>
      <Image style={styles.cardImage} source={{ uri: serie.image }} />

      <Text style={styles.cardTitle}>{serie.title}</Text>
      <Text style={styles.cardEpisodes}>{serie.nbEpisode} episodes</Text>

      <Text style={styles.cardDescription} numberOfLines={3}>
        {serie.description}
      </Text>

      <Link
        href={{
          pathname: '/modal2',
          params: {
            id: serie.id,
            title: serie.title,
            description: serie.description,
            nbEpisode: serie.nbEpisode,
            image: serie.image,
          },
        }}
        style={styles.button}
        asChild
      >
        <Pressable>
          <Text style={{ color: "white", fontWeight: '600' }}>
            <FontAwesome name="info-circle" size={18} />
            &nbsp; See more
          </Text>
        </Pressable>
      </Link>
    </View>
  );
};

export default function TabTwoScreen() {
  const [series, setSeries] = useState<Serie[]>([]);
  const [filter, setFilter] = useState('');
  const [filterByPopularity, setFilterByPopularity] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const reponse = await fetch('http://72.61.102.58:3000/series');
      const data = await reponse.json();
      setSeries(data);
    };
    fetchData();
  }, []);

  const getPopularity = (serie: Serie) =>
    serie.episodesInfos?.reduce((acc, ep) => acc + ep.views, 0) || 0;

  let filteredSeries = series.filter((s) =>
    s.title.toLowerCase().includes(filter.toLowerCase())
  );

  if (filterByPopularity) {
    filteredSeries = [...filteredSeries].sort(
      (a, b) => getPopularity(b) - getPopularity(a)
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Our torrents</Text>

        <TextInput
          style={styles.input}
          placeholder="Search"
          placeholderTextColor="#888"
          value={filter}
          onChangeText={setFilter}
        />

        <Text
          style={{
            ...styles.button,
            backgroundColor: filterByPopularity ? "#AA00FF" : "#22FF00",
            alignSelf: "center",
          }}
          onPress={() => setFilterByPopularity(!filterByPopularity)}
        >
          Trier par popularité
        </Text>

        <View style={styles.grid}>
          {filteredSeries.map((s) => (
            <SerieCard key={s.id} serie={s} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingVertical: 20,
    paddingBottom: 60,
  },

  container: {
    flex: 1,
  },

  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
    color: 'black',
  },

  input: {
    width: 260,
    padding: 10,
    backgroundColor: '#222',
    color: 'white',
    borderRadius: 8,
    marginVertical: 10,
    alignSelf: 'center',
  },

  button: {
    backgroundColor: '#AA00FF',
    width: 140,
    alignSelf: 'center',
    padding: 10,
    margin: 10,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    color: 'white',
  },

  grid: {
  width: '100%',
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: 15,
  paddingBottom: 60,
},

card: {
  width: '23%',
  minWidth: 260,
  backgroundColor: '#1a1a1a',
  padding: 15,
  borderRadius: 12,
  shadowColor: '#000',
  shadowOpacity: 0.3,
  shadowOffset: { width: 0, height: 4 },
  shadowRadius: 6,
  elevation: 5,
  marginBottom: 20,
},


  cardImage: {
    width: '100%',
    height: 180,
    borderRadius: 10,
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 10,
    color: 'white',
  },

  cardEpisodes: {
    fontSize: 16,
    marginTop: 4,
    marginBottom: 8,
    color: '#AAA',
  },

  cardDescription: {
    fontSize: 14,
    color: '#CCC',
    marginBottom: 12,
  },
});
