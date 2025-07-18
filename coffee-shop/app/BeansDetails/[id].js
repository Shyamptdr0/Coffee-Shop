import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    ScrollView,
    Image,
    TouchableOpacity,
    StyleSheet,
    Dimensions, Alert,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import {FontAwesome5, Ionicons, MaterialCommunityIcons} from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useDispatch, useSelector } from "react-redux";
import { fetchBeansData } from "../../features/beans/beansSlice";
import coffeeBean from "../../assets/icons/coffee-beans (1).png"
import {addToCart, fetchCartItems} from "../../features/cart";
import PopUpAnimation from '../../components/Animation/PopUpAnimation'; // adjust the path as needed
import successAnimation from '../../assets/animations/Success.json'; // Lottie animation file
import { addToFav, removeFromFav } from "../../features/like/index";



const { width } = Dimensions.get("window");

export default function BeansDetails() {
    const { item } = useLocalSearchParams();
    const [selectedSize, setSelectedSize] = useState("250gm");
    const [currentCoffee, setCurrentCoffee] = useState(null);
    const [adding, setAdding] = useState(false);

    const dispatch = useDispatch();
    const { data: beansList, loading, error } = useSelector((state) => state.beansData);
    const { user } = useSelector((state) => state.auth);

    const [showAnimation, setShowAnimation] = useState(false);
    const [popupText, setPopupText] = useState('');

    const { favourites } = useSelector((state) => state.like);
    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        if (currentCoffee && favourites) {
            const exists = favourites.find((item) => item.productId === currentCoffee.id || currentCoffee._id);
            setIsLiked(!!exists);
        }
    }, [currentCoffee, favourites]);

    const handleToggleLike = async () => {
        if (!user || !user.id || !currentCoffee) {
            Alert.alert("Login Required", "Please login to add favourites");
            return;
        }

        const payload = {
            userId: user.id,
            productId: currentCoffee.id || currentCoffee._id,
            favourite: true,
        };

        if (isLiked) {
            // Remove from favourites
            await dispatch(removeFromFav({ userId: user.id, productId: payload.productId }));
            setIsLiked(false);
        } else {
            // Add to favourites
            await dispatch(addToFav(payload));
            setIsLiked(true);
        }
    };



    useEffect(() => {
        dispatch(fetchBeansData());
    }, [dispatch]);

    useEffect(() => {
        if (!item || !beansList.length) return;

        try {
            const parsedItem = typeof item === "string" ? JSON.parse(item) : item;

            const matchedItem = beansList.find(
                (c) => c.name === parsedItem.name && c.type === parsedItem.type
            );

            setCurrentCoffee(matchedItem || parsedItem);
        } catch (err) {
            console.error("Failed to parse item param:", err);
        }
    }, [item, beansList]);

    const getPriceBySize = (size) => {
        const found = currentCoffee?.prices?.find((p) => p.size === size);
        return found ? found.price : "N/A";
    };

    if (loading || !currentCoffee) {
        return (
            <View style={styles.centered}>
                <Text style={{ color: "#fff" }}>Loading beans details...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centered}>
                <Text style={{ color: "red" }}>Failed to load coffee data</Text>
            </View>
        );
    }
    const handleAddToCart = async () => {
        if (!currentCoffee || adding) return;

        if (!user || !user.id) {
            Alert.alert("Error", "You must be logged in to add items to cart.");
            return;
        }

        const productId = currentCoffee._id || currentCoffee.id;
        const size = selectedSize;
        const quantity = 1;
        const priceEntry = currentCoffee.prices?.find((p) => p.size === size);
        const price = priceEntry?.price || 0;

        const cartItem = {
            userId: user.id,
            productId,
            name: currentCoffee.name,
            type: currentCoffee.type,
            image: currentCoffee.imagelink_square || currentCoffee.imagelink_portrait,
            size,
            price,
            quantity,
        };

        console.log("🧾 Cart item data:", cartItem);

        // Guard clause
        if (!user.id || !productId || !size || !quantity) {
            Alert.alert("Error", "Some required cart data is missing.");
            return;
        }

        setAdding(true);
        try {
            await dispatch(addToCart(cartItem)).unwrap();
            await dispatch(fetchCartItems(user.id));
            setPopupText(`${currentCoffee.name} (${size}) added to cart`);
            setShowAnimation(true);
            setTimeout(() => setShowAnimation(false), 2000); // hides after 2 seconds
        } catch (err) {
            console.error("❌ Error adding to cart:", err);
            Alert.alert("Error", err.message || "Failed to add item to cart");
        } finally {
            setAdding(false);
        }
    };


    return (
        <View style={{ flex: 1, backgroundColor: "#000" }}>
            {/* Image Section */}
            <View style={{ position: "relative" }}>
                <Image
                    source={{ uri: currentCoffee.imagelink_portrait }}
                    style={{
                        width: "100%",
                        height: 450,
                        borderBottomLeftRadius: 30,
                        borderBottomRightRadius: 30,
                    }}
                />

                {/* Top Buttons */}
                <View style={styles.topIcons}>
                    <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={22} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconButton} onPress={handleToggleLike}>
                        <Ionicons
                            name={isLiked ? "heart" : "heart-outline"}
                            size={22}
                            color={isLiked ? "#D17842" : "#fff"}
                        />
                    </TouchableOpacity>
                </View>

                {/* Blur Overlay */}
                <BlurView intensity={50} tint="dark" style={styles.blurOverlay}>
                    <View style={styles.titleRow}>
                        <Text style={styles.coffeeTitle}>{currentCoffee.name}</Text>
                        <View style={styles.inlineTags}>
                            <View style={styles.tag}>
                                <Image
                                    source={coffeeBean}
                                    style={{ width: 18, height: 18, tintColor: "#D17842" }}
                                    resizeMode="contain"
                                />

                                <Text style={styles.tagText}>Beans</Text>
                            </View>
                            <View style={styles.tag}>
                                <MaterialCommunityIcons name="map-marker" size={18} color="#D17842" />
                                <Text style={styles.tagText}>{currentCoffee.ingredients}</Text>
                            </View>
                        </View>
                    </View>

                    <Text style={styles.subText}>{currentCoffee.special_ingredient}</Text>

                    <View style={styles.ratingRow}>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Ionicons name="star" size={16} color="#D17842" />
                            <Text style={styles.ratingText}>
                                {currentCoffee.average_rating} ({currentCoffee.ratings_count})
                            </Text>
                        </View>
                        <View style={styles.roastBadge}>
                            <Text style={styles.roastText}>{currentCoffee.roasted}</Text>
                        </View>
                    </View>
                </BlurView>
            </View>

            {/* Description and Sizes */}
            <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 120 }}>
                <Text style={styles.sectionTitle}>Description</Text>
                <Text style={styles.description}>{currentCoffee.description}</Text>

                <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Size</Text>
                <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Size</Text>
                <View style={{ flexDirection: "row", marginTop: 10 }}>
                    {currentCoffee.prices?.map((priceObj) => (
                        <TouchableOpacity
                            key={priceObj.size}
                            onPress={() => setSelectedSize(priceObj.size)}
                            style={{
                                borderColor: selectedSize === priceObj.size ? "#D17842" : "#252A32",
                                backgroundColor: "#1e1e1e",
                                borderWidth: 1,
                                paddingVertical: 10,
                                paddingHorizontal: 20,
                                borderRadius: 10,
                                marginRight: 10,
                            }}
                        >
                            <Text style={{ color: "#fff", fontSize: 16 }}>{priceObj.size}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

            </ScrollView>

            {/* Bottom Bar */}
            <View style={styles.bottomBar}>
                <Text style={styles.priceText}>
                    <Text  className="text-white" style={{ color: "#D17842",  fontWeight: "bold" }}>
                        {currentCoffee?.prices?.[0]?.currency || "$"}{" "}

                    </Text>
                    {getPriceBySize(selectedSize)}

                </Text>
                <TouchableOpacity
                    style={[
                        styles.addToCartBtn,
                        adding && { backgroundColor: "#aaa" },
                    ]}
                    onPress={handleAddToCart}
                    disabled={adding}
                >
                    <Text style={styles.addToCartText}>
                        {adding ? "Adding..." : "Add to Cart"}
                    </Text>
                </TouchableOpacity>
            </View>

            {showAnimation && (
                <View style={styles.popupWrapper}>
                    <View style={styles.popupContainer}>
                        <PopUpAnimation style={styles.popupAnimation} source={successAnimation} />
                        <Text style={styles.popupText}>{popupText}</Text>
                    </View>
                </View>
            )}

        </View>
    );
}

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#000",
    },
    topIcons: {
        position: "absolute",
        top: 50,
        left: 20,
        right: 20,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    iconButton: {
        backgroundColor: "#00000088",
        borderRadius: 10,
        padding: 8,
    },
    blurOverlay: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    coffeeTitle: {
        color: "#fff",
        fontSize: 22,
        fontWeight: "bold",
    },
    subText: {
        color: "#ccc",
        fontSize: 14,
        marginTop: 0,
    },
    tag: {
        flexDirection: "column",
        backgroundColor: "#252A32",
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 8,
        alignItems: "center",
        marginRight: 10,
    },
    titleRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
    },
    inlineTags: {
        flexDirection: "row",
        gap: 5,
    },
    tagText: {
        color: "#fff",
        marginLeft: 6,
    },
    ratingRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 14,
    },
    ratingText: {
        color: "#fff",
        marginLeft: 6,
        fontSize: 14,
    },
    roastBadge: {
        backgroundColor: "#252A32",
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 8,
    },
    roastText: {
        color: "#fff",
        fontSize: 12,
    },
    sectionTitle: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
    description: {
        color: "#ccc",
        marginTop: 10,
        lineHeight: 22,
    },
    bottomBar: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#000",
        padding: 20,
        borderTopWidth: 1,
        borderColor: "#252A32",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    priceText: {
        color: "#fff",
        fontSize: 20,
    },
    addToCartBtn: {
        backgroundColor: "#D17842",
        paddingVertical: 12,
        paddingHorizontal: 40,
        borderRadius: 14,
    },
    addToCartText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    popupWrapper: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
    },

    popupContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: 24,
        borderRadius: 20,
        width: 250,
    },


    popupAnimation: {
        width: 150,
        height: 150,
        marginTop: 0,
    },

    popupText: {
        color: '#fff',
        fontSize: 16,
        marginTop: 10,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
