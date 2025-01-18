import React, { useState } from 'react';
import { View, Text, Button, Modal, TouchableOpacity, StyleSheet } from 'react-native';


const LeaveRequestPage = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [notification, setNotification] = useState({
    sender: 'John Doe',
    reason: 'Medical Leave',
    date: '2023-10-01'
  });

  const handleApprove = () => {
    setModalVisible(false);
  };

  const handleReject = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading} >Notifications</Text>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <View style={styles.notification}>
          <Text style={styles.notificationText}>Sender: {notification.sender}</Text>
          <Text style={styles.notificationText}>Reason: {notification.reason}</Text>
          <Text style={styles.notificationText}>Date: {notification.date}</Text>
        </View>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text>Do you want to approve or reject the leave request?</Text>
            <View style={styles.buttonContainer}>
              <Button title="Approve" onPress={handleApprove} />
              <Button title="Reject" onPress={handleReject} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  heading: {
    marginTop: 20,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
},
  notification: {
    padding: 15,
    backgroundColor: '#e7f3fe',
    borderLeftWidth: 5,
    borderLeftColor: '#2196F3',
    marginVertical: 10,
    borderRadius: 5,
  },
  notificationText: {
    fontSize: 16,
    color: '#333',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
});

// ...existing code...
export default LeaveRequestPage;
