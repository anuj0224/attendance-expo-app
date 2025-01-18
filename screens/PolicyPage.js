import React, { useState } from 'react';
import { View, Button, StyleSheet, Text } from 'react-native';

const PolicyPage = () => {
    const [loading, setLoading] = useState(false);
    
    // Function to simulate loading the policy text
    const loadPolicyText = async () => {
        setLoading(true);
        // Simulate a delay in loading
        setTimeout(() => {
            setLoading(false);
        }, 2000); // Simulate 2 seconds of loading time
    };

    return (
        <View style={styles.container}>
            <Button title="Load Policy Text" onPress={loadPolicyText} disabled={loading} />
            {loading && <Text>Loading Policy...</Text>}

            {/* Static Policy Text */}
            {!loading && (
                <Text style={styles.policyText}>
                    This is a sample policy document. The policy outlines the rules and guidelines for attendance and behavior in the workplace. Please read carefully and adhere to all instructions.
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 25,
    },
    policyText: {
        marginTop: 20,
        fontSize: 16,
        paddingHorizontal: 20,
        textAlign: 'center',
    },
});

export default PolicyPage;
