import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../features/auth/authSlice";
import { router } from "expo-router";
import {useToast} from "react-native-toast-notifications";

export default function Profile() {
    const toast = useToast();
    const dispatch = useDispatch();
    const { user, isAuthenticated } = useSelector((state) => state.auth);

    const handleLogout = async () => {
        await dispatch(logoutUser());
        router.replace("/(auth)");
        toast.show( "Logout Successfully" , {type:"success"})
    };

    return (
        <View style={{ flex: 1, backgroundColor: "#000", alignItems: "center", justifyContent: "center", padding: 20 }}>
            <Image
                source={{ uri: user?.profile || "https://i.pravatar.cc/100" }}
                style={{
                    width: 100,
                    height: 100,
                    borderRadius: 999,
                    borderWidth: 2,
                    borderColor: "#D17842",
                    marginBottom: 20,
                }}
            />

            <Text style={{ color: "#fff", fontSize: 22, fontWeight: "bold", marginBottom: 10 }}>
                {isAuthenticated ? user?.userName : "Guest"}
            </Text>
            <Text style={{ color: "#ccc", fontSize: 16, marginBottom: 30 }}>
                {user?.email}
            </Text>

            <TouchableOpacity
                onPress={handleLogout}
                style={{
                    backgroundColor: "#D17842",
                    paddingHorizontal: 30,
                    paddingVertical: 12,
                    borderRadius: 25,
                }}
            >
                <Text style={{ color: "#fff", fontSize: 16 }}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
}
