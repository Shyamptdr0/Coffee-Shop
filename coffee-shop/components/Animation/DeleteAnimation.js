// components/DeleteAnimation.js
import {StyleSheet, View} from 'react-native';
import React from 'react';
import LottieView from 'lottie-react-native';
import {BlurView} from 'expo-blur';

const DeleteAnimation = ({style, source}) => {
    return (
        <View style={styles.innerContainer}>
            <BlurView intensity={60} tint="dark" style={styles.blurBackground} />
            <LottieView style={style} source={source} autoPlay loop={false}/>
        </View>
    );
};

const styles = StyleSheet.create({
    innerContainer: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        overflow: 'hidden',
        paddingLeft:10,
    },
    blurBackground: {
        ...StyleSheet.absoluteFillObject,
    },
});

export default DeleteAnimation;
