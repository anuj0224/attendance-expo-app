import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Toast from 'react-native-toast-message';
import employeeData from '../assets/employee.json';
import Logo from '../components/Logo';

const ForgotPasswordPage = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [employeeId, setEmployeeId] = useState('');

    const handlePasswordReset = () => {
        const user = employeeData.employees.find(
            (emp) => emp.employeeId === employeeId && emp.email === email
        );

        if (user) {
            Toast.show({
                type: 'success',
                text1: 'Password Reset',
                text2: 'A reset link has been sent to your email.',
            });
            navigation.goBack();
        } else {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Invalid employee ID or email.',
            });
        }
    };

    return (
        <View style={styles.container}>
            <Logo />
            <View style={styles.formContainer}>
                <Text style={styles.heading}>Forgot Password</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Employee ID"
                    value={employeeId}
                    onChangeText={setEmployeeId}
                    keyboardType="default"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                />
                <TouchableOpacity style={styles.submitButton} onPress={handlePasswordReset}>
                    <Text style={styles.submitButtonText}>Submit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.backButtonText}>Back to Login</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
        justifyContent: 'center',
        padding: 20,
    },
    formContainer: {
        backgroundColor: '#fff',
        padding: 30,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        width: '100%',
        maxWidth: 350,
        alignSelf: 'center',
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 30,
        color: '#333',
    },
    input: {
        height: 45,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 15,
        fontSize: 16,
        backgroundColor: '#f9f9f9',
    },
    submitButton: {
        backgroundColor: '#007BFF',
        paddingVertical: 12,
        borderRadius: 8,
        marginTop: 15,
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    backButton: {
        marginTop: 10,
        alignItems: 'center',
    },
    backButtonText: {
        color: '#007BFF',
        fontSize: 16,
        textDecorationLine: 'underline',
    },
});

export default ForgotPasswordPage;
