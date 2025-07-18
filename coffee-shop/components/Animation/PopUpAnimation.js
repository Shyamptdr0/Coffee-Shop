// components/PopUpAnimation.js
import {StyleSheet, View} from 'react-native';
import React from 'react';
import LottieView from 'lottie-react-native';
import {BlurView} from "expo-blur";

const PopUpAnimation = ({style, source}) => {
    return (
        <View>
            <BlurView
                intensity={70}
                tint="dark"
                style={styles.blurBackground}
            />
            <LottieView style={[styles.animation, style]} source={source} autoPlay loop={false}/>
        </View>
    );
};

const styles = StyleSheet.create({
    animation: {
        width: 150,
        height: 150,
    },
    blurBackground: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        color: '#000000',
    },
});

export default PopUpAnimation;
