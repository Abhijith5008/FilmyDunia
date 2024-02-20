import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import MovieList from '../components/movieList';

const MovieScreen = () => {

  const [movies, setMovies] = useState('');
  const [page, setPage] = useState(1);

  const callApi = () => {
    setPage(page + 1);
    const options = {
      method: 'GET',
      url: 'https://api.themoviedb.org/3/movie/popular',
      params: { language: 'en-US', page, region: 'US' },
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3YTE1MDJjNjhmYmZmMDAzNTI3Y2M3NDY1OGVhYWEzYSIsInN1YiI6IjY1ZDQ4OWZmMWQzNTYzMDE3YzFmNDZlYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.43XLAjqb1h9OtmSdQ2XmERG-j0g1A_4vhcuvli5X6nk'
      }
    };

    axios
      .request(options)
      .then(function (response) {
        setMovies(prevMovies => [...prevMovies, ...response.data.results]);
      })
      .catch(function (error) {
        console.error(error);
      });
  }


  useEffect(() => {
    callApi();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>Popular Movies</Text>
      <MovieList movies={movies} callBack={callApi} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingTop: 45,
    backgroundColor: '#fcfcf7',
  },
});

export default MovieScreen;

