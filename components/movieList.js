import React, { useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Rating } from 'react-native-ratings';
import moment from 'moment';

const { width, height } = Dimensions.get("window");

const MovieList = ({ movies, callBack }) => {

    const [bookmarkedMovies, setBookmarkedMovies] = useState([]);
    const [favoritedMovies, setFavoritedMovies] = useState([]);

    const formatDate = (date) => {
        let newDate = date;
        if (newDate) {
            newDate = moment(date).format("YYYY");
        }
        newDate = "(" + newDate + ")";
        return newDate;
    };

    const handleBookMark = (itemId) => {
        if (bookmarkedMovies.includes(itemId)) {
            const filteredMovies = bookmarkedMovies.filter(id => id !== itemId);
            setBookmarkedMovies(filteredMovies);
        } else {
            setBookmarkedMovies([...bookmarkedMovies, itemId]);
        }
    };

    const handleFavorite = (itemId) => {
        if (favoritedMovies.includes(itemId)) {
            const filteredMovies = favoritedMovies.filter(id => id !== itemId);
            setFavoritedMovies(filteredMovies);
        } else {
            setFavoritedMovies([...favoritedMovies, itemId]);
        }
    };

    const renderItem = ({ item }) => (
        <View style={[styles.container, { flex: 1, flexDirection: 'row', justifyContent: "space-around", alignItems: 'center', marginBottom: 5 }]}>
            <Image source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }} style={{ width: 120, height: 170, marginLeft: 20 }} />
            <View style={styles.inlinContainer}>
                <View style={[styles.textContainer, { marginVertical: 10, marginLeft: 20 }]}>
                    <Text numberOfLines={4} style={{ fontSize: 20, fontWeight: '700', textAlign: "left" }}>{item.title}</Text>
                    <Text style={{ fontSize: 16, fontWeight: '300', marginTop: 3, paddingLeft: 5, textAlign: "center" }}>{formatDate(item.release_date)}</Text>
                </View>
                {item.adult === true ? <Text style={{ fontSize: 18, fontWeight: '300', marginRight: width / 3.2, padding: 5, marginVertical: 10 }}>R</Text> : <Text style={{ fontSize: 18, fontWeight: '300', marginRight: width / 3.2, padding: 5, marginVertical: 10 }}>PG-13</Text>}
                <Rating
                    type='custom'
                    ratingColor='#ffba3b'
                    ratingBackgroundColor='#fff'
                    style={{ marginRight: width / 7, padding: 5, marginVertical: 20 }}
                    imageSize={25}
                />
            </View>
            <View style={styles.iconContainer}>
                <TouchableOpacity style={{ marginVertical: 25 }} onPress={() => handleBookMark(item.id)}>
                    <MaterialIcons name={bookmarkedMovies.includes(item.id) ? 'bookmark' : 'bookmark-border'} size={35} color={'blue'} />
                </TouchableOpacity>
                <TouchableOpacity style={{ marginVertical: 25 }} onPress={() => handleFavorite(item.id)}>
                    <MaterialIcons name={favoritedMovies.includes(item.id) ? 'favorite' : 'favorite-border'} size={35} color={'red'} />
                </TouchableOpacity>
            </View>
        </View>
    );

    const handleEndReached = () => {
        console.log("end reached")
        callBack();
    };

    return (
        <FlatList
            data={movies}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
            onEndReached={handleEndReached}
            onEndReachedThreshold={0.1}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        height: height / 4,
        backgroundColor: '#fcfcf7',
        borderRadius: 10,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 1,
    },
    inlinContainer: {
        justifyContent: "center",
        alignItems: "center",
        margin: 5,
        padding: 5
    },
    textContainer: {
        flex: 1,
        width: width / 2,
        marginLeft: 10,
        flexDirection: "row",
    },
    iconContainer: {
        justifyContent: "center",
        alignItems: "center",
        margin: 5,
        padding: 5
    },
});

export default MovieList;
