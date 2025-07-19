import React, {useEffect} from "react";
import {Slot, useRouter, useSegments} from "expo-router";
import {SafeAreaProvider} from "react-native-safe-area-context";
import {StatusBar} from "expo-status-bar";
import "../global.css";
import {Provider, useDispatch, useSelector} from "react-redux";
import store from "../app/store";
import {checkAuth} from "../features/auth/authSlice";
import {ToastProvider} from "react-native-toast-notifications";
import Ionicons from '@expo/vector-icons/Ionicons';


function AuthWrapper({children}) {
    const router = useRouter();
    const dispatch = useDispatch();
    const segments = useSegments();
    const {isAuthenticated, isLoading} = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(checkAuth());
    }, [dispatch]);


    useEffect(() => {
        if (isLoading || segments.length === 0) return;

        const inAuthGroup = segments[0] === "(auth)";

        if (!isAuthenticated && !inAuthGroup) {
            router.replace("/(auth)");
        } else if (isAuthenticated && inAuthGroup) {
            router.replace("/(tabs)");
        }
    }, [isAuthenticated, segments, isLoading]);

    return children;
}

export default function RootLayout() {
    return (
        <Provider store={store}>
            <SafeAreaProvider>
                <ToastProvider
                    placement="top"
                    duration={3000}
                    animationType="slide-in"
                    offset={50}
                    successColor="#28a745"
                    dangerColor="#dc3545"
                    warningColor="#ffc107"
                    successIcon={<Ionicons name="checkmark-circle-outline" size={22} color="#fff"/>}
                    dangerIcon={<Ionicons name="close-circle-outline" size={22} color="#fff"/>}
                    warningIcon={<Ionicons name="alert-circle-outline" size={22} color="#fff"/>}
                >

                    <StatusBar style="light"/>
                    <AuthWrapper>
                        <Slot/>
                    </AuthWrapper>
                </ToastProvider>
            </SafeAreaProvider>
        </Provider>
    );
}