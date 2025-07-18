import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { createOrder } from '../../features/order';
import { clearCart } from '../../features/cart';

export default function SuccessScreen() {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);

    const userId = useSelector(state => state.auth);
    const cartItems = useSelector(state => state.cartData.cartItems);
    const totalAmount = useSelector(state => state.cartData.totalPrice);

    useEffect(() => {
        if (cartItems.length > 0 && userId) {
            dispatch(createOrder({ userId, items: cartItems, totalPrice: totalAmount }))
                .unwrap()
                .then(() => {
                    dispatch(clearCart({ userId }));
                    setLoading(false);
                })
                .catch((err) => {
                    console.error("Order creation failed:", err);
                    setLoading(false);
                });
        } else {
            setLoading(false); // no cart data, skip
        }
    }, []);

    const handleGoToHistory = () => {
        router.replace('/(tabs)/history');
    };

    return (
        <View style={styles.container}>
            {loading ? (
                <>
                    <ActivityIndicator size="large" color="#D17842" />
                    <Text style={styles.infoText}>Placing your order...</Text>
                </>
            ) : (
                <>
                    <Ionicons name="checkmark-circle-outline" size={100} color="#4BB543" />
                    <Text style={styles.successText}>Payment Successful!</Text>
                    <Text style={styles.infoText}>Your order has been placed.</Text>

                    <TouchableOpacity style={styles.historyButton} onPress={handleGoToHistory}>
                        <Text style={styles.historyButtonText}>View Order History</Text>
                    </TouchableOpacity>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    successText: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#fff',
        marginTop: 20,
    },
    infoText: {
        color: '#aaa',
        fontSize: 16,
        marginTop: 10,
        marginBottom: 30,
        textAlign: 'center',
    },
    historyButton: {
        backgroundColor: '#D17842',
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 10,
    },
    historyButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
