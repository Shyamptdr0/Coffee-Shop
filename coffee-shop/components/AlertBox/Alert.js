import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';

export default function AlertBox({ visible, title, message, onCancel, onConfirm }) {
    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.alertBox}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.message}>{message}</Text>
                    <View style={styles.buttonRow}>
                        <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
                            <Text style={styles.cancelText}>No</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.confirmBtn} onPress={onConfirm}>
                            <Text style={styles.confirmText}>Yes</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    alertBox: {
        backgroundColor: '#1E1E1E',
        borderRadius: 16,
        padding: 24,
        width: '80%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
    },
    message: {
        fontSize: 16,
        color: '#aaa',
        textAlign: 'center',
        marginBottom: 20,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    cancelBtn: {
        flex: 1,
        backgroundColor: '#333',
        paddingVertical: 12,
        borderRadius: 10,
        marginRight: 10,
        alignItems: 'center',
    },
    confirmBtn: {
        flex: 1,
        backgroundColor: '#D17842',
        paddingVertical: 12,
        borderRadius: 10,
        marginLeft: 10,
        alignItems: 'center',
    },
    cancelText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    confirmText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
