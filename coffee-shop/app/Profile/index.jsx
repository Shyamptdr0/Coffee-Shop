import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../features/auth/authSlice";
import { router } from "expo-router";
import { useToast } from "react-native-toast-notifications";
import logo from "../../assets/logo/huge/logo-1.png";
import { LinearGradient } from "expo-linear-gradient";

export default function Profile() {
    const toast = useToast();
    const dispatch = useDispatch();
    const { user, isAuthenticated } = useSelector((state) => state.auth);

    const handleLogout = async () => {
        await dispatch(logoutUser());
        router.replace("/(auth)");
        toast.show("Logged out successfully", { type: "success" });
    };

    return (
        <LinearGradient
            colors={["#1C1C1E", "#000"]}
            style={styles.container}
        >
            <Image
                source={logo}
                style={styles.profileImage}
            />

            <Text style={styles.userName}>
                {isAuthenticated ? user?.userName : "Guest"}
            </Text>
            <Text style={styles.email}>{user?.email}</Text>

            <View style={styles.divider} />

            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 3,
        borderColor: "#D17842",
        marginBottom: 20,
    },
    userName: {
        color: "#fff",
        fontSize: 24,
        fontWeight: "700",
        marginBottom: 6,
    },
    email: {
        color: "#aaa",
        fontSize: 16,
        marginBottom: 30,
    },
    divider: {
        width: "80%",
        height: 1,
        backgroundColor: "#333",
        marginVertical: 20,
    },
    logoutButton: {
        backgroundColor: "#D17842",
        paddingHorizontal: 40,
        paddingVertical: 14,
        borderRadius: 30,
        shadowColor: "#D17842",
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 6,
        elevation: 5,
    },
    logoutText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
        letterSpacing: 1,
    },
});
