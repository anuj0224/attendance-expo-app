import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Header = () => {
    const navigation = useNavigation();

    const handleLogout = async () => {
        navigation.navigate('Login');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Attendance App</Text>
            <TouchableOpacity style={styles.headerIcon} onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={24} color="white" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 60,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#6200ea',
        position: 'absolute',
        top: 25,
        left: 0,
        right: 0,
        paddingHorizontal: 20, 
        zIndex: 100,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
    },
    text: {
        fontSize: 20,
        color: '#fff',
        fontWeight: 'bold',
    },
    headerIcon: {
        padding: 10,
    },
});

export default Header;
