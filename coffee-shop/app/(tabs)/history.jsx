import React, {useEffect} from 'react';
import {
    View,
    Text,
    ScrollView,
    Image,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {router} from 'expo-router';
import moment from 'moment';
import {getUserOrders} from "../../features/order";
import logo from "../../assets/logo/huge/logo-1.png";

export default function History() {
    const dispatch = useDispatch();
    const {isAuthenticated, user} = useSelector((state) => state.auth);
    const {orderItems} = useSelector((state) => state.order);

    const parseCartItem = (itemStr) => {
        if (typeof itemStr !== 'string') return itemStr;

        try {
            // Clean up the string to resemble valid JSON
            const jsonLike = itemStr
                .replace(/([{,])\s*([a-zA-Z0-9_]+)\s*:/g, '$1"$2":') // key: → "key":
                .replace(/'([^']+)'/g, '"$1"')                         // 'value' → "value"
                .replace(/new ObjectId\("(.+?)"\)/g, '"$1"')           // new ObjectId("abc") → "abc"
                .replace(/new ObjectId\('(.+?)'\)/g, '"$1"');          // also single quotes version

            return JSON.parse(jsonLike);
        } catch (e) {
            console.error("Failed to parse itemStr:", itemStr, e);
            return null;
        }
    };

    useEffect(() => {
        if (!isAuthenticated) {
            router.replace("/(auth)");
        } else {
            dispatch(getUserOrders(user.id));
        }
    }, [isAuthenticated]);

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scroll}>
                {orderItems.length === 0 ? (
                    <View style={styles.noOrdersContainer}>
                        <Image source={logo} style={{width: 200, height: 150}}/>
                        <Text style={styles.noOrdersText}>You have no orders yet.</Text>
                        <Text style={styles.noOrdersText}>Order it fast...</Text>
                    </View>

                ) : (
                    orderItems.map((order, index) => (
                        <View key={index} style={styles.orderBlock}>
                            <View style={styles.orderHeader}>
                                <Text className="text-white text-[20px]" style={styles.orderDate}>
                                    Order Date{'\n'}
                                    <Text style={styles.dateText}>
                                        {moment(order.orderDate).format("Do MMMM YYYY, HH:mm")}
                                    </Text>
                                </Text>
                                <View>
                                    <Text className="text-white" style={styles.totalAmountLabel}>Total Amount</Text>
                                    <Text style={styles.totalAmount}>
                                        ₹ {order.totalAmount?.toFixed(2) || '0.00'}
                                    </Text>
                                </View>
                            </View>

                            {order.cartItems.map((itemStr, idx) => {
                                const item = typeof itemStr === "string" ? parseCartItem(itemStr) : itemStr;
                                if (!item) return null;

                                const price = item?.price ?? 0;
                                const quantity = item?.quantity ?? 0;
                                const itemTotal = price * quantity;

                                return (
                                    <View key={idx} style={styles.itemCard}>
                                        <View style={styles.itemRow}>
                                            <View style={styles.leftSection}>
                                                <Image
                                                    source={{uri: item.image || 'https://via.placeholder.com/60'}}
                                                    style={styles.image}
                                                />
                                                <View style={styles.leftText}>
                                                    <Text style={styles.itemName}>{item.name || 'Unknown Item'}</Text>
                                                    <Text style={styles.sizeText}>{item.size || '-'}</Text>
                                                    <Text style={styles.itemTotal}>Total:
                                                        ₹ {itemTotal.toFixed(2)}</Text>
                                                </View>
                                            </View>

                                            <Text style={styles.price}> ₹ {price.toFixed(2)}</Text>
                                            <Text style={styles.multiply}>x {quantity}</Text>
                                            <Text style={styles.total}>= ₹ {(price * quantity).toFixed(2)}</Text>
                                        </View>
                                    </View>
                                );
                            })}
                            <View style={styles.divider}/>
                        </View>
                    ))
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    scroll: {
        padding: 16,
        paddingBottom: 40,
    },
    header: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    orderBlock: {
        marginBottom: 30,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    orderDate: {
        fontSize: 18,
        color: '#fff',
    },
    dateText: {
        color: '#aaa',
        fontSize: 14,
    },

    // Item card
    itemCard: {
        backgroundColor: '#1A1A1A',
        borderRadius: 16,
        padding: 12,
        marginBottom: 14,
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 10,
    },

    // LEFT SIDE: image + name + size + total
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1.3,
        gap: 10,
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 8,
    },
    leftText: {
        justifyContent: 'space-between',
        gap: 4,
    },
    itemName: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    sizeText: {
        color: '#aaa',
        fontSize: 14,
    },
    itemTotal: {
        color: '#FFA552',
        fontWeight: 'bold',
        fontSize: 18,
    },

    // RIGHT SIDE: price x qty = subtotal
    rightSection: {
        flexDirection: "row",
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        flex: 0.8,
        height: 80,
    },
    price: {
        color: '#FFA552',
        fontSize: 18,
    },
    multiply: {
        color: '#fff',
        fontSize: 18,
    },
    total: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 18,
    },

    // Total order amount
    totalAmount: {
        fontSize: 18,
        color: '#FFA552',
        fontWeight: 'bold',
    },

    // Download button
    downloadBtn: {
        marginTop: 30,
        backgroundColor: '#FFA552',
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
    },
    downloadText: {
        fontWeight: '600',
        color: '#000',
        fontSize: 16,
    },
    divider: {
        height: 1,
        backgroundColor: '#ffffff22',
        marginVertical: 6,
        marginHorizontal: 8,
    },

    noOrdersContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
        paddingVertical: 230,
    },

    noOrdersText: {
        color: '#aaa', fontSize: 24, textAlign: 'center'
    },

});
