import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import PropTypes from 'prop-types';

const OfflinePage = ({ onRetry }) => {
  return (
    <View style={styles.container}>
        <Text style={styles.text}>No internet connection</Text>
      <Button title="Retry" onPress={onRetry} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 18,
    color: 'red',
    marginBottom: 20,
  },
});
OfflinePage.propTypes = {
  onRetry: PropTypes.func.isRequired,
};

export default OfflinePage;
