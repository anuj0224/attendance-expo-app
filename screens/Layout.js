import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import Header from '../components/Header';
import CustomBottomTabs from '../components/CustomBottomTabs';

const Layout = ({ children }) => {
  return (
    <SafeAreaView style={styles.container}>
      <Header style={styles.header} />
      <View style={styles.content}>
        {children}
      </View>
      <CustomBottomTabs style={styles.bottomTabs} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  content: {
    marginTop: 60,
    backgroundColor: '#fff',
  },
  bottomTabs: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
});

export default Layout;
