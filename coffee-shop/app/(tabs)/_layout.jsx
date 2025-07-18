import { Tabs, router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "react-native";
import { useSelector } from "react-redux";
import { useEffect } from "react";

const icons = {
    index: require("../../assets/icons/home.png"),
    cart: require("../../assets/icons/bag.png"),
    like: require("../../assets/icons/like.png"),
    history: require("../../assets/icons/user.png"),
};

export default function TabLayout() {
    const insets = useSafeAreaInsets();

    return (
        <Tabs
            screenOptions={({ route }) => ({
                headerShown: true,
                headerStyle: {
                    backgroundColor: "#000000",
                    elevation: 0,
                    shadowOpacity: 0,
                },
                headerTitleAlign: "center",
                headerTintColor: "#fff",
                headerTitleStyle: {
                    fontWeight: "bold",
                    fontSize: 20,
                    color: "#fff",
                },
                tabBarShowLabel: false,
                tabBarStyle: {
                    backgroundColor: "#0C0F14",
                    borderTopWidth: 0,
                    height: 60 + insets.bottom,
                    paddingBottom: insets.bottom,
                    paddingTop: 10,
                },
                tabBarIcon: ({ focused }) => (
                    <Image
                        source={icons[route.name]}
                        style={{
                            width: 20,
                            height: 20,
                            resizeMode: "contain",
                            tintColor: focused ? "#D17842" : "#888",
                        }}
                    />
                ),
            })}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    headerShown: false,
                }}
            />
            <Tabs.Screen name="cart" options={{ title: "Cart" }} />
            <Tabs.Screen name="like" options={{ title: "Favorites" }} />
            <Tabs.Screen name="history" options={{ title: "Order History" }} />
        </Tabs>
    );
}
