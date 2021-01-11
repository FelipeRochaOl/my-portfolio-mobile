import React, {useState, useEffect} from 'react';
import api from './services/api'

import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

export default function App() {
  const [repositories, setRepositories] = useState([])

  async function handleLikeRepository(id) {
    const response = await api.post(`/repositories/${id}/like`)
    const {likes} = response.data
    const repositoriesUpdated = repositories.map(repository => {
      if (repository.id === id) {
        repository.likes = likes
      }
      return repository
    })
    setRepositories(repositoriesUpdated)
  }

  function getRepositories() {
    api
      .get('/repositories')
      .then(repository => setRepositories(repository.data))
  }

  useEffect(() => {
    getRepositories()
  }, [])

  return (
    <>
      <StatusBar barStyle='light-content' backgroundColor='#7159c1' />
      <SafeAreaView style={styles.container}>
        <FlatList
          data={repositories}
          keyExtractor={repository => repository.id}
          renderItem={({ item: repository }) => {
            let likes = `${repository.likes} curtida`
            if (parseInt(repository.likes) > 1) {
              likes = `${repository.likes} curtidas`
            }
            return (
              <View key={repository.id} style={styles.repositoryContainer}>
                <Text style={styles.repository}>{repository.title}</Text>

                    <FlatList
                      data={repository.techs}
                      style={styles.techsContainer}
                      keyExtractor={(item) => item}
                      renderItem={({item}) => (<Text style={styles.tech}>{item}</Text>)}
                    />
                      
                <View style={styles.likesContainer}>
                  <Text
                    style={styles.likeText}
                    testID={`repository-likes-${repository.id}`}
                  >
                    {likes}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleLikeRepository(repository.id)}
                  testID={`like-button-${repository.id}`}
                >
                  <Text style={styles.buttonText}>Curtir</Text>
                </TouchableOpacity>
              </View>
            )
          }}
        />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7159c1',
  },
  repositoryContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: '#fff',
    padding: 20,
  },
  repository: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  techsContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  tech: {
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 10,
    backgroundColor: '#04d361',
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: '#fff',
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  likeText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 10,
  },
  button: {
    marginTop: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 10,
    color: '#fff',
    backgroundColor: '#7159c1',
    padding: 15,
  },
});
