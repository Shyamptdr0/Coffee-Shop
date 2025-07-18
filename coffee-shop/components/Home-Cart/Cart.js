import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function HomeCart({ item, onAddToCart }) {
    const correctedImageUrl =
        item.imagelink_square?.replace("localhost", "192.168.149.168") ||
        "https://via.placeholder.com/150";

    const [selectedSize, setSelectedSize] = useState(item.prices?.[0]);

    const handleAddToCart = () => {
        if (selectedSize) {
            onAddToCart(item, selectedSize);
        }
    };

    return (
        <View
            style={{
                backgroundColor: "#252A32",
                borderRadius: 20,
                width: 200,
                padding: 10,
                marginRight: 16,
                marginBottom: 10,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 5,
                height: 290,
                justifyContent: "space-between",
            }}
        >
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() =>
                    router.push({
                        pathname: "/CoffeeDetails/" + item.id,
                        params: { item: JSON.stringify(item) },
                    })
                }
            >
                {/* Image + Rating */}
                <View style={{ position: "relative" }}>
                    <Image
                        source={{ uri: correctedImageUrl }}
                        style={{
                            width: "100%",
                            aspectRatio: 1.5,
                            borderRadius: 15,
                            resizeMode: "cover",
                        }}
                    />
                    <View
                        style={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            backgroundColor: "#D17842",
                            borderRadius: 6,
                            paddingHorizontal: 6,
                            paddingVertical: 3,
                            flexDirection: "row",
                            alignItems: "center",
                        }}
                    >
                        <Ionicons name="star" size={12} color="#fff" />
                        <Text style={{ color: "#fff", marginLeft: 4, fontSize: 12 }}>
                            {item.average_rating || "0.0"}
                        </Text>
                    </View>
                </View>

                {/* Title + Subtitle */}
                <View
                    style={{
                        marginTop: 10,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <View>
                        <Text
                            style={{
                                color: "#fff",
                                fontSize: 16,
                                fontWeight: "700",
                                marginBottom: 4,
                            }}
                        >
                            {item.name}
                        </Text>
                        <Text style={{ color: "#B0B0B0", fontSize: 13, marginBottom: 8 }}>
                            {item.special_ingredient}
                        </Text>
                    </View>
                </View>

                {/* Size Selection */}
                <View style={{ flexDirection: "row", marginTop: 6, flexWrap: "wrap" }}>
                    {item.prices?.map((priceObj, idx) => (
                        <TouchableOpacity
                            key={idx}
                            onPress={() => setSelectedSize(priceObj)}
                            style={{
                                paddingHorizontal: 8,
                                paddingVertical: 4,
                                borderRadius: 6,
                                marginRight: 6,
                                marginTop: 4,
                                backgroundColor:
                                    selectedSize?.size === priceObj.size ? "#D17842" : "#2C2C2C",
                            }}
                        >
                            <Text style={{ color: "#fff", fontSize: 12 }}>
                                {priceObj.size}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </TouchableOpacity>

            {/* Price + Add Button */}
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginTop: 12,
                }}
            >
                <Text style={{ color: "#fff", fontSize: 18 }}>
                    <Text style={{ color: "#D17842", fontWeight: "600" }}>
                        {selectedSize?.currency || "$"}
                    </Text>{" "}
                    {selectedSize?.price || "0.00"}
                </Text>

                <TouchableOpacity
                    onPress={handleAddToCart}
                    style={{
                        backgroundColor: "#D17842",
                        borderRadius: 10,
                        padding: 6,
                    }}
                >
                    <Ionicons name="add" size={20} color="#fff" />
                </TouchableOpacity>
            </View>
        </View>
    );
}
