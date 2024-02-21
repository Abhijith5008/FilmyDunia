import React, { useState, PureComponent } from 'react';
import { View, Text, FlatList, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { AirbnbRating } from 'react-native-ratings';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get("window");

class MovieList extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            bookmarkedMovies: [],
            favoritedMovies: [],
        };
    }

    formatDate = (date) => {
        let newDate = date;
        if (newDate) {
            newDate = moment(date).format("YYYY");
        }
        newDate = "(" + newDate + ")";
        return newDate;
    };

    handleBookMark = async (itemId) => {
        try {
            const { movies } = this.props;
            const { bookmarkedMovies } = this.state;

            let updatedMovies = [...movies];
            let updatedBookmarkedMovies;

            if (bookmarkedMovies.includes(itemId)) {
                updatedBookmarkedMovies = bookmarkedMovies.filter(id => id !== itemId);
            } else {
                updatedBookmarkedMovies = [...bookmarkedMovies, itemId];
            }

            this.setState({ bookmarkedMovies: updatedBookmarkedMovies });

            updatedMovies = updatedMovies.map(movie => {
                if (movie.id === itemId) {
                    movie.bookmarked = !movie.bookmarked;
                }
                return movie;
            });

            await AsyncStorage.setItem('Movies', JSON.stringify(updatedMovies));

            console.log('Bookmark updated successfully!');
        } catch (error) {
            console.error('Error updating bookmark:', error);
        }
    };

    handleFavorite = async (itemId) => {
        try {
            const { movies } = this.props;
            const { favoritedMovies } = this.state;

            let updatedMovies = [...movies];
            let updatedFavedMovies;

            if (favoritedMovies.includes(itemId)) {
                updatedFavedMovies = favoritedMovies.filter(id => id !== itemId);
            } else {
                updatedFavedMovies = [...favoritedMovies, itemId];
            }

            this.setState({ favoritedMovies: updatedFavedMovies });

            updatedMovies = updatedMovies.map(movie => {
                if (movie.id === itemId) {
                    movie.fav = !movie.fav;
                }
                return movie;
            });

            await AsyncStorage.setItem('Movies', JSON.stringify(updatedMovies));
        } catch (error) {
            console.error('Error updating bookmark:', error);
        }
    };

    handleRating = async (rate, itemId) => {
        const { movies } = this.props;

        const updatedMovies = movies.map(movie => {
            if (movie.id === itemId) {
                movie.userRating = rate;
            }
            return movie;
        });

        try {
            await AsyncStorage.setItem('Movies', JSON.stringify(updatedMovies));
            console.log('User rating saved successfully!');
        } catch (error) {
            console.error('Error saving user rating:', error);
        }
    };

    handleBookMarkIcon = (item) => {
        const { bookmarkedMovies } = this.state;
        if (item.bookmarked)
            return item.bookmarked
        else
            bookmarkedMovies.includes(item.id)
    };


    handleFavIcon = (item) => {
        const { favoritedMovies } = this.state;
        if (item.fav)
            return item.fav
        else
            favoritedMovies.includes(item.id)
    };

    renderItem = ({ item }) => {
        return (
            <View style={[styles.container, { flex: 1, flexDirection: 'row', justifyContent: "space-around", alignItems: 'center', marginBottom: 5 }]}>
                <Image source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }} style={{ width: 120, height: 170, marginLeft: 20 }} />
                <View style={styles.inlinContainer}>
                    <View style={[styles.textContainer, { marginVertical: 10, marginLeft: 20 }]}>
                        <Text numberOfLines={4} style={{ fontSize: 20, fontWeight: '700', textAlign: "left" }}>{item.title}</Text>
                        <Text style={{ fontSize: 16, fontWeight: '300', marginTop: 3, paddingLeft: 5, textAlign: "center" }}>{this.formatDate(item.release_date)}</Text>
                    </View>
                    {item.adult === true ? <Text style={{ fontSize: 18, fontWeight: '300', marginRight: width / 3.2, padding: 5, marginVertical: 10 }}>R</Text> : <Text style={{ fontSize: 18, fontWeight: '300', marginRight: width / 3.2, padding: 5, marginVertical: 10 }}>PG-13</Text>}
                    <AirbnbRating
                        defaultRating={item.userRating ? item.userRating : 0}
                        onFinishRating={(e) => this.handleRating(e, item.id)}
                        selectedColor='#ffba3b'
                        ratingBackgroundColor='#fff'
                        ratingContainerStyle={{ alignItems: "flex-start" }}
                        starContainerStyle={{ marginRight: width / 8, marginVertical: 5 }}
                        reviewSize={15}
                        size={17}
                    />
                </View>
                <View style={styles.iconContainer}>
                    <TouchableOpacity style={{ marginVertical: 25 }} onPress={() => this.handleBookMark(item.id)}>
                        <MaterialIcons name={this.handleBookMarkIcon(item) ? 'bookmark' : 'bookmark-border'} size={25} color={'blue'} />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ marginVertical: 25 }} onPress={() => this.handleFavorite(item.id)}>
                        <MaterialIcons name={this.handleFavIcon(item) ? 'favorite' : 'favorite-border'} size={25} color={'red'} />
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    handleEndReached = () => {
        const { callBack, reRenderCall } = this.props;
        if (reRenderCall === true) {
            callBack();
        }
    };

    render() {
        const { movies } = this.props;

        return (
            <FlatList
                data={movies}
                renderItem={this.renderItem}
                keyExtractor={(item, index) => item.id.toString() + index.toString()}
                onEndReached={this.handleEndReached}
                onEndReachedThreshold={0.1}
            />
        );
    }
}

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
        width: width / 2.2,
        marginLeft: 10,
        flexDirection: "row",
    },
    iconContainer: {
        justifyContent: "center",
        alignItems: "center",
        margin: 5,
        marginTop: 25,
        padding: 5
    },
});

export default MovieList;
