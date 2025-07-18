import { StyleSheet, View, Dimensions } from 'react-native';
import React from 'react';
import LottieView from 'lottie-react-native';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');

const PaymentAnimation = ({ source }) => {
    return (
        <View style={styles.container}>
            <BlurView intensity={70} tint="dark" style={StyleSheet.absoluteFill} />
            <LottieView
                source={source}
                autoPlay
                loop={false}
                style={styles.fullscreenAnimation}
                resizeMode="cover"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
        backgroundColor: 'transparent',
    },
    fullscreenAnimation: {
        width: width,
        height: height,
        position: 'absolute',
        top: 0,
        left: 0,
    },
});

export default PaymentAnimation;
