import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, Dimensions, Modal } from 'react-native';
import axios from 'axios';
import MovieList from '../components/movieList';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Animatable from 'react-native-animatable';
import { FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
import Fuse from 'fuse.js';
import { LANG_MAP } from '../components/languageMapper';
import LogoutModal from '../components/logoutModal';
import { Rating } from 'react-native-ratings';
import SelectDropdown from 'react-native-select-dropdown';

const { width, height } = Dimensions.get("window");

const MovieScreen = ({ navigation }) => {
  const languages = [
    'Chinese (Hong Kong)',
    'Czech',
    'Danish',
    'English',
    'Greek',
    'Hindi',
    'Irish',
    'Japanese',
    'Korean',
    'Malayalam',
    'Polish',
    'Punjabi',
    'Romanian',
    'Russian',
    'Serbian',
    'Slovak',
    'Slovenian',
    'Sorbian',
    'Swedish',
    'Urdu'
  ];

  const [movies, setMovies] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [searchMovies, setSearchMovies] = useState('');
  const [rating, setRating] = useState('');
  const [cert, setCert] = useState('');
  const [voteAvg, setVoteAvg] = useState('');
  const [page, setPage] = useState(1);
  const [filterPage, setFilterPage] = useState(1);
  const searchRef = useRef(null);
  const logoRef = useRef(null);
  const [hideSearch, setHideSearch] = useState(false);
  const [popularityFlag, setPopularityFlag] = useState(false);
  const [asortFlag, setAsortFlag] = useState(false);
  const [zsortFlag, setZsortFlag] = useState(false);
  const [filterFlag, setFilterFlag] = useState(false);
  const [renderFlag, setRenderFlag] = useState(true);
  const [searchInput, setSearchInput] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [logoutVisible, setLogoutVisible] = useState(false);
  const [bkMrkFlag, setBkMarkFlag] = useState(false);
  const [favFlag, setFavFlag] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [firstName, setFirstName] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);

  const getPopMovie = () => {
    if (filterFlag === true) {
      filterMovies();
    }
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
      .then(async function (response) {
        setIsLoading(false);
        setMovies(prevMovies => [...prevMovies, ...response.data.results]);
        setSearchMovies(prevMovies => [...prevMovies, ...response.data.results]);
        const updatedMovies = [...movies, ...response.data.results];
        await AsyncStorage.setItem('Movies', JSON.stringify(updatedMovies));
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  const filterMovies = () => {
    setIsLoading(true);
    setModalVisible(false);
    setFilterPage(filterPage + 1);
    const options = {
      method: 'GET',
      url: 'https://api.themoviedb.org/3/discover/movie',
      params: {
        with_original_language: LANG_MAP.get(selectedLanguage),
        page: filterPage,
        include_adult: cert === "Adult" ? true : false,
        vote_average: rating * 2,
        vote_count: voteAvg
      },
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3YTE1MDJjNjhmYmZmMDAzNTI3Y2M3NDY1OGVhYWEzYSIsInN1YiI6IjY1ZDQ4OWZmMWQzNTYzMDE3YzFmNDZlYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.43XLAjqb1h9OtmSdQ2XmERG-j0g1A_4vhcuvli5X6nk'
      }
    };
    console.log(options);
    axios
      .request(options)
      .then(async function (response) {
        setIsLoading(false);
        setMovies(response.data.results); 
        setSearchMovies(response.data.results);
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  const searchMoviesList = (value) => {
    setSearchInput(value);
    const fuse = new Fuse(searchMovies, {
      shouldSort: true,
      threshold: 0.1,
      location: 0,
      distance: 100,
      keys: ['title']
    });
    const results = fuse.search(value);
    const finalResult = [];
    if (results && results.length > 0) {
      results.forEach((item) => {
        finalResult.push(item.item);
      });
      const fuseResult = [...finalResult];
      setSearchMovies(fuseResult);
    } else {
      setSearchMovies(movies);
    }
  };

  const getLocal = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('Movies');
      if (jsonValue) {
        const parsedNotes = JSON.parse(jsonValue);
        setMovies(parsedNotes);
        setIsLoading(false);
        setSearchMovies(parsedNotes);
      } else {
        getPopMovie();
      }
    } catch (e) {
      console.error('Error loading notes:', e);
    }
  };

  const handleView = () => {
    setSearchMovies(movies);
    if (searchRef.current) {
      searchRef.current.animate("bounceOut", 400);
    };
    setTimeout(function () {
      setHideSearch(false);
    }, 200);
  };

  const handleSearchClear = () => {
    if (searchInput === null) {
      searchRef.current?.animate("bounceOut", 400);
      setSearchInput(null);
      setTimeout(function () {
        setHideSearch(false);
      }, 200);
    } else {
      setSearchInput(null);
    }
  };

  const handleFilterBtn = () => {
    setFilterFlag(true);
    setModalVisible(true);
  };

  const sortByPopularity = () => {
    setRenderFlag(!renderFlag);
    setPopularityFlag(!popularityFlag);
    if (popularityFlag === false) {
      const sorted = [...movies].sort((a, b) => b.popularity - a.popularity);
      setSearchMovies(sorted);
    } else {
      setSearchMovies(movies);
    }
  };

  const sortByAlphabetical = () => {
    setAsortFlag(!asortFlag);
    setRenderFlag(!renderFlag);
    if (asortFlag === false) {
      const sorted = [...movies].sort((a, b) => a.title.localeCompare(b.title));
      setSearchMovies(sorted);
    } else {
      setSearchMovies(movies);
    }

  };

  const sortByAlphabeticalRev = () => {
    setZsortFlag(!zsortFlag);
    setRenderFlag(!renderFlag);
    if (zsortFlag === false) {
      const sorted = [...movies].sort((a, b) => a.title.localeCompare(b.title)).reverse();
      setSearchMovies(sorted);
    } else {
      setSearchMovies(movies);
    }

  };

  const sortByFav = () => {
    setFavFlag(!favFlag);
    setRenderFlag(!renderFlag);
    if (favFlag === false) {
      const sorted = movies.filter(movie => movie.fav === true);
      setSearchMovies(sorted);
    } else {
      setSearchMovies(movies);
    }
  };

  const sortByWatchList = () => {
    setBkMarkFlag(!bkMrkFlag);
    setRenderFlag(!renderFlag);
    if (bkMrkFlag === false) {
      const sorted = movies.filter(movie => movie.bookmarked === true);
      setSearchMovies(sorted);
    } else {
      setSearchMovies(movies);
    }
  };

  const handleIconPress = () => {
    setHideSearch(true);
  };

  const handleFilterClick = () => {
    let lang;
    let sorted;
    if (selectedLanguage) {
      lang = LANG_MAP.get(selectedLanguage);
      sorted = movies.filter(movie => movie.original_language === lang);
      setRenderFlag(!renderFlag);
      setSearchMovies(sorted);
    }
    if (rating) {
      lang = LANG_MAP.get(selectedLanguage);
      sorted = movies.filter(movie => movie.userRating >= rating);
      setRenderFlag(!renderFlag);
      setSearchMovies(sorted);
    }
    setModalVisible(!modalVisible);
  };

  useEffect(() => {
    getLocal();
  }, []);

  const getUserData = async () => {
    const storedUseData = await AsyncStorage.getItem('userDetails');
    const parsedData = JSON.parse(storedUseData);
    setFirstName(parsedData.firstName);
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <View style={styles.container}>
      <Image
        style={styles.titleImage}
        source={require('../assets/filmyBg.png')}
      />
      {hideSearch == false ?
        <Animatable.View ref={logoRef} animation={"fadeIn"} duration={400} easing="ease" style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>Popular Movies</Text>
          <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
            <TouchableOpacity style={[{ width: 30, height: 30, marginHorizontal: 5 }]} onPress={handleIconPress}>
              <Ionicons name="search" size={25} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.sortButton, { width: 30, height: 30, marginHorizontal: 5 }]} onPress={() => setLogoutVisible(true)}>
              <Text style={{ fontSize: 20, color: 'purple' }}>{Array.from(firstName ? firstName : <></>)[0]}</Text>
            </TouchableOpacity>
          </View>
        </Animatable.View>
        :
        <Animatable.View
          ref={searchRef}
          easing="ease"
          animation="bounceInRight"
          duration={600}
          style={[styles.touchView, { marginLeft: 14, margin: 5, flexDirection: "row", justifyContent: "space-between" }]}
        >
          <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-around" }}>
            <TouchableOpacity onPress={handleView}>
              <Ionicons name="chevron-back" size={24} color="#000" />
            </TouchableOpacity>
            <TextInput
              placeholder="Search .."
              value={searchInput}
              style={{
                color: "#333232",
                fontSize: 10 * 2,
                marginLeft: 10,
                width: 200
              }}
              onChangeText={(e) => searchMoviesList(e)}
            />
            <Ionicons name="search" size={24} color="#000" />
          </View>
          <TouchableOpacity onPress={handleSearchClear}>
            <Ionicons name="close-outline" size={25} color="#000" />
          </TouchableOpacity>
        </Animatable.View>
      }
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.sortButton} onPress={handleFilterBtn}>
          <FontAwesome5 name="filter" size={24} color={filterFlag === true ? "black" : "grey"} />
        </TouchableOpacity>
        {/* <TouchableOpacity style={styles.sortButton} onPress={sortByPopularity}>
          <Entypo name="line-graph" size={24} color={popularityFlag === true ? "black" : "grey"} />
        </TouchableOpacity>
        */}
        <TouchableOpacity style={styles.sortButton} onPress={sortByAlphabetical}>
          <FontAwesome5 name="sort-alpha-down" size={24} color={asortFlag === true ? "black" : "grey"} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.sortButton} onPress={sortByAlphabeticalRev}>
          <FontAwesome5 name="sort-alpha-down-alt" size={24} color={zsortFlag === true ? "black" : "grey"} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.sortButton} onPress={sortByWatchList}>
          <MaterialIcons name={bkMrkFlag ? 'bookmark' : 'bookmark-border'} size={24} color={bkMrkFlag === true ? "blue" : "grey"} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.sortButton} onPress={sortByFav}>
          <MaterialIcons name={favFlag ? 'favorite' : 'favorite-border'} size={24} color={favFlag === true ? "red" : "grey"} />
        </TouchableOpacity>
      </View>
      {isLoading === true && (
        <Image
          source={require("../assets/gihf.gif")}
          style={styles.loaderWrapper}
        ></Image>
      )}
      {isLoading === false && (
        <MovieList movies={searchMovies} callBack={getPopMovie} reRenderCall={renderFlag} />
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={[styles.modalText, { fontWeight: 600 }]}>Apply Filters</Text>
            <View style={{ borderBottomColor: 'black', borderBottomWidth: StyleSheet.hairlineWidth, width: 300, marginVertical: 10 }} />
            <View style={styles.sideColumn}>
              <TouchableOpacity
                style={[styles.sideButton, selectedSection === "Vote Average" && styles.selectedButton]}
                onPress={() => setSelectedSection("Vote Average")}
              >
                <Text>Vote Average</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.sideButton, selectedSection === "Vote Count" && styles.selectedButton]}
                onPress={() => setSelectedSection("Vote Count")}
              >
                <Text>Vote Count</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.sideButton, selectedSection === "Certification" && styles.selectedButton]}
                onPress={() => setSelectedSection("Certification")}
              >
                <Text>Certification</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.sideButton, selectedSection === "Language" && styles.selectedButton]}
                onPress={() => setSelectedSection("Language")}
              >
                <Text>Language</Text>
              </TouchableOpacity>
            </View>

            {/* Corresponding views for each section */}
            {selectedSection === "Vote Average" && (
              <View>
                <Rating
                  imageSize={30}
                  onFinishRating={(e) => setRating(e)}
                  style={{ paddingVertical: 10, position: "absolute", marginTop: 20, left: -5 }}
                />

              </View>
            )}
            {selectedSection === "Vote Count" && (
              <View style={styles.userInput}>
                <TextInput
                  placeholder="Set Vote Count"
                  value={voteAvg}
                  style={{
                    textAlign: "left",
                    color: "#333232",
                    fontSize: 10 * 2,
                    marginLeft: 10,
                    width: 200
                  }}
                  onChangeText={(e) => setVoteAvg(e)}
                />
              </View>
            )}
            {selectedSection === "Certification" && (
              <View style={{ position: "absolute", top: 105, right: 80 }}>
                <TouchableOpacity
                  style={[styles.sideButton, cert === "PG-13" && styles.selectedButton, { marginVertical: 50 }]}
                  onPress={() => setCert("PG-13")}
                >
                  <Text>PG-13</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.sideButton, cert === "Adult" && styles.selectedButton]}
                  onPress={() => setCert("Adult")}
                >
                  <Text>Adult</Text>
                </TouchableOpacity>
              </View>
            )}
            {selectedSection === "Language" && (
              <View>
                <SelectDropdown
                  data={languages}
                  onSelect={(selectedItem) => {
                    setSelectedLanguage(selectedItem);
                  }}
                  defaultButtonText={selectedLanguage ? selectedLanguage : "Select Language"}
                  buttonStyle={styles.dropBtn}
                  buttonTextStyle={{ color: '#333' }}
                  dropdownStyle={{ marginTop: -3, backgroundColor: '#fafafa' }}
                  dropdownTextStyle={{ color: '#333' }}
                />
              </View>
            )}

            {/* Apply and close buttons */}
            <View style={[styles.buttonsContainer, { position: "absolute", bottom: 20 }]}>
              <TouchableOpacity
                style={[styles.touch, { backgroundColor: "black" }]}
                onPress={filterMovies}
              >
                <Text style={{ color: "#fff", fontSize: 16 }}>Apply</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.touch, { backgroundColor: "black" }]}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text style={{ color: "#fff", fontSize: 16 }}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <LogoutModal
        visible={logoutVisible}
        nav={navigation}
        onClose={() => setLogoutVisible(false)}
        firstName={firstName}
      />
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
  selectedButton: {
    backgroundColor: "lightblue",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  sideColumn: {
    position: "absolute",
    left: 15,
    top: height / 10,
    alignItems: "center",
    marginRight: 20,
  },
  sideButton: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 20,
    borderRadius: 5,
  },
  userInput: {
    position: "absolute",
    right: 20,
    top: 170,
    width: 185,
    height: 50,
    padding: 10,
    margin: 5,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#fcfcf7',
    borderRadius: 9,
    marginVertical: 20
  },
  titleImage: {
    width: width / 2,
    height: 40,
    alignSelf: "center",
    resizeMode: "cover",
  },
  dropBtn: {
    position: "absolute",
    top: 120,
    left: -25,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#fcfcf7',
    borderRadius: 9,
    marginVertical: 20
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  sortButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#fcfcf7',
    borderRadius: 9,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 1,
  },
  touch: {
    width: width / 5,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    margin: 10,
  },
  touchView: {
    width: width / 1.1 - 10,
    height: height / 14,
    margin: 2,
    backgroundColor: '#fcfcf7',
    padding: 15,
    borderRadius: 9,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 1,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    width: width / 1,
    height: height / 1.5,
    position: "absolute",
    bottom: 0,
    margin: 20,
    backgroundColor: '#fcfcf7',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    fontSize: 20,
    textAlign: 'center',
  },
  loaderWrapper: {
      width: 450,
      height: 450,
      resizeMode: "contain",
      alignSelf: "center"
  },
});

export default MovieScreen;

