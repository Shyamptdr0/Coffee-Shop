import React, {useState} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image,
    Alert, ActivityIndicator,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useSelector, useDispatch} from 'react-redux';
import {useRouter, useLocalSearchParams} from 'expo-router';
import {createOrder} from '../../features/order/index';
import {fetchCartItems} from '../../features/cart/index';
import AlertBox from "../../components/AlertBox/Alert";
import gpay from "../../assets/payment/gpay.png";
import amazon from "../../assets/payment/amazonpay.png";
import apple from "../../assets/payment/applepay.png";
import PaymentAnimation from "../../components/Animation/PaymentSuccess";
import paymentSuccessAnimation from '../../assets/animations/payment success.json';

export default function PaymentScreen() {
    const router = useRouter();
    const dispatch = useDispatch();
    const {user} = useSelector((state) => state.auth);
    const {cartItems} = useSelector((state) => state.cartData);
    const [isPaid, setIsPaid] = useState(false);
    const [selectedMethod, setSelectedMethod] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showAnimation, setShowAnimation] = useState(true);



    const methods = [
        {name: 'Google Pay', icon: gpay},
        {name: 'Apple Pay', icon: apple},
        {name: 'Amazon Pay', icon: amazon},
    ];

    const totalAmount = cartItems.reduce((sum, item) => {
        const price = typeof item.price === 'number' ? item.price : 0;
        return sum + price * item.quantity;
    }, 0).toFixed(2);

    const [showAlert, setShowAlert] = useState(false);

    const handleCancel = () => {
        setShowAlert(true);
    };


    const handlePayment = async () => {
        try {
            if (!selectedMethod) {
                Alert.alert('Select Payment Method', 'Please choose a payment method.');
                return;
            }

            setLoading(true);

            const orderPayload = {
                userId: user.id,
                items: cartItems.map((item) => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    price: item.price,
                    size: item.size,
                    image: item.image,
                    name: item.name,
                    type: item.type,
                })),
                totalAmount: Number(totalAmount),
                paymentMethod: selectedMethod,
                status: 'Paid',
            };

            await dispatch(createOrder(orderPayload)).unwrap();

            // Refresh cart so user sees updated items (if you want)
            await dispatch(fetchCartItems(user.id));

            setIsPaid(true);
        } catch (error) {
            console.error("Payment failed:", error);
            Alert.alert("Error", "Failed to process payment.");
        } finally {
            setLoading(false);
        }
    };

    if (isPaid) {
        return (
            <View style={styles.successContainer}>
                {showAnimation && (
                    <PaymentAnimation
                        source={paymentSuccessAnimation}
                        onFinish={() => setShowAnimation(false)}
                    />
                )}
                <View style={{ alignItems: 'center' }}>
                    <Text style={styles.icon}>✅</Text>
                    <Text style={styles.successText}>Payment Successful!</Text>
                    <Text style={styles.subText}>Your favorite coffee is on its way ☕</Text>


                </View>

                <TouchableOpacity
                    style={styles.historyBtn}
                    onPress={() => router.push('/(tabs)/history')}
                >
                    <Text style={styles.historyBtnText}>See Order History</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>

            <View style={styles.header}>
                {/*<TouchableOpacity onPress={handleCancel}>*/}
                {/*    <Ionicons name="arrow-back" size={28} color="#fff"/>*/}
                {/*</TouchableOpacity>*/}
                <Text style={styles.headerTitle}>Payment</Text>
            </View>


            {/* Credit Card */}
            <Text style={styles.header}>Payment Options</Text>

            <View style={styles.methodContainer}>
                {methods.map(({name, icon}) => (
                    <TouchableOpacity
                        key={name}
                        style={[
                            styles.methodBtn,
                            selectedMethod === name && styles.selectedMethod,
                        ]}
                        onPress={() => setSelectedMethod(name)}
                    >
                        <View style={styles.methodContent}>
                            <Image source={icon} style={styles.methodIcon}/>
                            <Text style={styles.methodText}>{name}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <View style={styles.totalPriceText}>
                    <Text style={styles.priceLabel}>Price</Text>
                    <Text style={styles.priceValue}>₹ {totalAmount}</Text>
                </View>

                <TouchableOpacity
                    style={[styles.payBtn, (!selectedMethod || loading) && styles.disabledBtn]}
                    onPress={handlePayment}
                    disabled={!selectedMethod || loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff"/>
                    ) : (
                        <Text style={styles.payText}>
                            {selectedMethod ? `Pay with ${selectedMethod}` : 'Select Payment Method'}
                        </Text>
                    )}
                    <Ionicons name="arrow-forward-circle" size={24} color="#fff" style={{marginLeft: 6}}/>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.cancelBtn}
                    onPress={handleCancel}
                >
                    <AlertBox
                        visible={showAlert}
                        title="Cancel Payment?"
                        message="Are you sure you want to cancel the payment?"
                        onCancel={() => setShowAlert(false)}
                        onConfirm={() => {
                            setShowAlert(false);
                            router.replace('/(tabs)/cart');
                        }}
                    />

                    <Text style={styles.cancelText}>Cancel Payment</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {flex: 1, backgroundColor: '#0D0D0D'},
    content: {padding: 20},
    header: {flexDirection: 'row', alignItems: 'center', marginTop: 40,},
    headerTitle: {
        position: 'absolute',
        left: 0,
        right: 0,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },

    cardContainer: {
        backgroundColor: '#1E1E1E', borderColor: '#D17842',
        borderWidth: 1, borderRadius: 20, padding: 20, marginBottom: 25,
    },
    cardHeader: {flexDirection: 'row', justifyContent: 'space-between'},
    cardTitle: {color: '#fff', fontSize: 14, fontWeight: 'bold'},
    visaLogo: {width: 50, height: 20, resizeMode: 'contain'},
    cardNumber: {color: '#fff', fontSize: 20, letterSpacing: 2, marginVertical: 10},
    cardFooter: {flexDirection: 'row', justifyContent: 'space-between'},
    cardName: {color: '#fff', fontSize: 14},
    cardExpiry: {color: '#fff', fontSize: 14},
    paymentMethod: {
        flexDirection: 'row', justifyContent: 'space-between',
        backgroundColor: '#1E1E1E', padding: 16, borderRadius: 14, marginBottom: 10,
    },
    methodLabel: {color: '#fff', fontSize: 16},
    methodValue: {color: '#fff', fontSize: 16, fontWeight: 'bold'},
    methodBtn: {
        backgroundColor: '#1E1E1E', padding: 16,
        borderRadius: 14, marginBottom: 10,
    },
    methodText: {color: '#fff', fontSize: 16},
    footer: {marginTop: 20},
    priceLabel: {color: '#aaa', fontSize: 16, marginBottom: 4},
    priceValue: {color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 16},

    payText: {color: '#fff', fontSize: 16, fontWeight: 'bold'},
    cancelBtn: {
        backgroundColor: '#333', paddingVertical: 14,
        borderRadius: 14, alignItems: 'center', marginTop: 12,
    },
    cancelText: {color: '#fff', fontSize: 16, fontWeight: 'bold'},
    // successContainer: {
    //     flex: 1, backgroundColor: '#000',
    //     justifyContent: 'center', alignItems: 'center',
    // },
    // icon: {fontSize: 70, marginBottom: 20},
    // successText: {color: '#fff', fontSize: 26, fontWeight: 'bold'},
    // subText: {color: '#aaa', fontSize: 16, marginTop: 10},
    // historyBtn: {
    //     marginTop: 30, backgroundColor: '#FFA552',
    //     paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12,
    // },
    // historyBtnText: {fontWeight: '600', color: '#000', fontSize: 16},

    methodContainer: {
        flexDirection: 'column',
        gap: 15,
        marginBottom: 30,
    },

    selectedMethod: {
        borderColor: '#D17842',
        backgroundColor: '#2A2A2A',
        borderWidth: 1,
    },
    payBtn: {
        backgroundColor: '#D17842',
        paddingVertical: 14,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    disabledBtn: {
        backgroundColor: '#555',
    },

    totalPriceText: {
        padding: 5,
        fontWeight: "600"
    },
    methodContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    methodIcon: {
        width: 28,
        height: 28,
        resizeMode: 'contain',
    },

    successContainer: {
        flex: 1,
        backgroundColor: '#121212',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    icon: {
        fontSize: 32,
        marginTop: 20,
        color: 'white',
        alignItems: "center",
        justifyContent: "center",
    },
    successText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 10,
        color: 'white',
    },
    subText: {
        fontSize: 16,
        marginTop: 5,
        color: '#ccc',
        textAlign: 'center',
        fontStyle: 'italic',
    },

    historyBtn: {
        backgroundColor: '#D17842',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginTop: 30,
    },
    historyBtnText: {
        color: '#fff',
        fontWeight: 'bold',
    },

});
