import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    Image,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchCartItems,
    updateCartQuantity,
    deleteCartItem,
    clearCart,
} from '../../features/cart/index';
import { Ionicons } from '@expo/vector-icons';
import DeleteAnimation from '../../components/Animation/DeleteAnimation';
import deleteLottie from '../../assets/animations/Delete bubble.json';
import PopUpAnimation from '../../components/Animation/PopUpAnimation';
import successAnimation from '../../assets/animations/Success.json';
import { router } from 'expo-router';
import logo from "../../assets/logo/huge/logo-1.png"

export default function CartScreen() {
    const dispatch = useDispatch();
    const { cartItems } = useSelector((state) => state.cartData);
    const { user } = useSelector((state) => state.auth);
    const [adding, setAdding] = useState(false);
    const [deletingItemKey, setDeletingItemKey] = useState(null);
    const [showAnimation, setShowAnimation] = useState(false);
    const [popupText, setPopupText] = useState('');

    useEffect(() => {
        if (user?.id) {
            dispatch(fetchCartItems(user.id));
        }
    }, [dispatch, user?.id]);

    const handleQuantityChange = (item, delta) => {
        const newQty = item.quantity + delta;
        if (newQty > 0) {
            dispatch(
                updateCartQuantity({
                    userId: user.id,
                    productId: item.productId,
                    size: item.size,
                    quantity: newQty,
                })
            );
        }
    };

    const handleDeleteItem = (item) => {
        const key = `${item.productId}-${item.size}`;
        setDeletingItemKey(key);
        setTimeout(() => {
            dispatch(
                deleteCartItem({
                    userId: user.id,
                    productId: item.productId,
                    size: item.size,
                })
            );
            setDeletingItemKey(null);
        }, 1300);
    };

    const handleClearCart = async () => {
        try {
            setAdding(true);
            await dispatch(clearCart({ userId: user.id })).unwrap();
            await dispatch(fetchCartItems(user.id));
            setPopupText('Cart cleared successfully');
            setShowAnimation(true);
            setTimeout(() => setShowAnimation(false), 2000);
        } catch (err) {
            console.error('❌ Error clearing cart:', err);
            Alert.alert('Error', err.message || 'Failed to clear cart');
        } finally {
            setAdding(false);
        }
    };

    const handlePay = async () => {
        try {
            setAdding(true);
            router.push({
                pathname: '/payment',
                params: {
                    userId: user.id,
                    total: calculateTotal(),
                },
            });


        } catch (error) {
            console.error('Pay error:', error);
            Alert.alert('Error', 'Something went wrong');
        } finally {
            setAdding(false);
        }
    };


    const calculateTotal = () => {
        return cartItems
            ?.reduce((sum, item) => {
                const price = typeof item.price === 'number' ? item.price : 0;
                return sum + price * item.quantity;
            }, 0)
            .toFixed(2);
    };

    return (
        <View style={styles.container}>
            {cartItems?.length === 0 ? (
                <View style={styles.emptyCartContainer}>
                    <Image source={logo} style={{width: 200, height: 150}}/>
                    <Text style={styles.emptyCartText}>Your coffee cup is empty.</Text>
                    <Text style={styles.emptyCartText}>It's Time for a refill!</Text>
                </View>
            ) : (
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
                    {cartItems.map((item) => (
                        <View key={`${item.productId}-${item.size}`} style={styles.card}>
                            <Image source={{ uri: item.image }} style={styles.image} />
                            <View style={{ flex: 1, marginLeft: 12 }}>
                                <View style={styles.topRow}>
                                    <Text style={styles.name}>{item.name}</Text>
                                    <TouchableOpacity onPress={() => handleDeleteItem(item)}>
                                        <Ionicons name="trash-outline" size={20} color="#D17842" />
                                    </TouchableOpacity>
                                </View>
                                <Text style={styles.sub}>{item.type}</Text>
                                <View style={styles.chip}>
                                    <Text style={styles.chipText}>{item.size}</Text>
                                </View>
                                <View style={styles.bottomRow}>
                                    <Text style={styles.price}>
                                        ₹{item.price?.toFixed ? item.price.toFixed(2) : '0.00'}
                                    </Text>
                                    <View style={styles.qtyControl}>
                                        <TouchableOpacity
                                            style={styles.qtyBtn}
                                            onPress={() => handleQuantityChange(item, -1)}
                                        >
                                            <Ionicons name="remove" color="#D17842" size={18} />
                                        </TouchableOpacity>
                                        <Text style={styles.qtyText}>{item.quantity}</Text>
                                        <TouchableOpacity
                                            style={styles.qtyBtn}
                                            onPress={() => handleQuantityChange(item, 1)}
                                        >
                                            <Ionicons name="add" color="#D17842" size={18} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                            {deletingItemKey === `${item.productId}-${item.size}` && (
                                <DeleteAnimation source={deleteLottie} style={{ width: 200, height: 200 }} />
                            )}
                        </View>
                    ))}
                </ScrollView>
            )}

            {showAnimation && (
                <View style={styles.popupWrapper}>
                    <View style={styles.popupContainer}>
                        <PopUpAnimation style={styles.popupAnimation} source={successAnimation} />
                        <Text style={styles.popupText}>{popupText}</Text>
                    </View>
                </View>
            )}

            {cartItems?.length > 0 && (
                <View style={styles.footer}>
                    <View>
                        <Text style={styles.totalText}>Total Price</Text>
                        <Text style={styles.totalAmount}> ₹ {calculateTotal()}</Text>
                    </View>
                    <View style={styles.actionBtns}>
                        <TouchableOpacity
                            style={[styles.clearBtn, adding && { opacity: 0.5 }]}
                            onPress={handleClearCart}
                            disabled={adding}
                        >
                            <Ionicons name="trash-bin" size={20} color="#D17842" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.payBtn, adding && { opacity: 0.5 }]}
                            onPress={handlePay}
                            disabled={adding}
                        >
                            <Text style={styles.payText}>Pay</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000', paddingTop: 5, paddingHorizontal: 20 },
    card: {
        flexDirection: 'row',
        backgroundColor: '#0D0D0D',
        borderRadius: 20,
        padding: 16,
        marginBottom: 16,
        alignItems: 'center',
    },
    image: { width: 120, height: 120, borderRadius: 14 },
    topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    name: { fontSize: 16, color: '#fff', fontWeight: 'bold' },
    sub: { color: '#aaa', fontSize: 13, marginVertical: 2 },
    chip: {
        backgroundColor: '#000',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        marginTop: 4,
        alignSelf: 'flex-start',
    },
    chipText: { color: '#D17842', fontSize: 16, fontWeight: 'bold' },
    bottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
    price: { color: '#D17842', fontSize: 18, fontWeight: 'bold' },
    qtyControl: { flexDirection: 'row', alignItems: 'center' },
    qtyBtn: { backgroundColor: '#2C2C2C', borderRadius: 6, padding: 6, marginHorizontal: 8 },
    qtyText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 20,
        borderTopColor: '#333',
        borderTopWidth: 1,
        backgroundColor: '#000',
    },
    totalText: { color: '#aaa', fontSize: 18 },
    totalAmount: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
    actionBtns: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    clearBtn: { backgroundColor: '#2C2C2C', padding: 12, borderRadius: 10, marginRight: 10 },
    payBtn: { backgroundColor: '#D17842', paddingHorizontal: 40, paddingVertical: 15, borderRadius: 10 },
    payText: { color: '#fff', fontWeight: 'bold', fontSize: 16, textAlign: 'center' },
    popupWrapper: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
    },
    popupContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: 20,
        borderRadius: 16,
    },
    popupAnimation: { width: 150, height: 150 },
    popupText: { color: '#fff', fontSize: 16, marginTop: 10, fontWeight: 'bold', textAlign: 'center' },
    emptyCartContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
        paddingVertical: 230,
    },
    emptyCartText: { color: '#aaa', fontSize: 24, textAlign: 'center' },
});
