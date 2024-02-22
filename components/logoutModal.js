import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useRef } from 'react';
import { Modal, View, Text, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import * as Animatable from 'react-native-animatable';
const { width, height } = Dimensions.get("window");

const logoutModal = ({ visible, nav, onClose, firstName }) => {
    const closeModalRef = useRef(null);

    const handleClose = () => {
        closeModalRef.current?.animate('zoomOutRight', 600, 0, 'ease-out');
        setTimeout(function () { onClose() }, 100);
    }

    const remUser = async () => {
        AsyncStorage.removeItem('token');
        nav.navigate('Login');
    }

    const handleLogout = () => {
        closeModalRef.current?.animate('zoomOutDown', 300, 0, 'ease-out');
        setTimeout(function () { remUser() }, 100);
    };

    return (
        <Modal
            transparent={true}
            visible={visible}
            onRequestClose={handleClose}
        >
            <Animatable.View
                animation="zoomInRight"
                duration={400}
                easing={'ease-in'}
                ref={closeModalRef}
                style={styles.modalContainer}
            >
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Hello {firstName}</Text>
                    <View style={{ borderBottomColor: 'black', borderBottomWidth: StyleSheet.hairlineWidth, width: 160, marginVertical: 10 }} />
                    <View style={[styles.buttonsContainer, { justifyContent: "space-between", marginVertical: 5, marginRight: 10 }]}>
                        <TouchableOpacity style={[styles.touch, { backgroundColor: "black", width: width / 5, height: 40  }]} onPress={handleLogout}>
                            <Text style={{ color: "#fff", fontSize: 15, textAlign: "center",marginVertical:10 }}>Logout</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.touch, { backgroundColor: "black", width: width / 5, height: 40 }]} onPress={handleClose} >
                            <Text style={{ color: "#fff", fontSize: 15,textAlign: "center",marginVertical:10 }}>close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Animatable.View>
        </Modal >
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: "absolute",
        top: 80,
        right: 30
    },
    modalContent: {
        height: height / 5,
        width: width / 1.8,
        backgroundColor: '#fcfcf7',
        padding: 20,
        borderRadius: 20,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    touch: {
        width: width / 1.1 - 10,
        height: height / 14,
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
});

export default logoutModal;
