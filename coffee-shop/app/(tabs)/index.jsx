import React, {useState, useEffect} from "react";
import {
    View,
    Text,
    TextInput,
    ScrollView,
    TouchableOpacity,
    Image,
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {Ionicons} from "@expo/vector-icons";
import {useDispatch, useSelector} from "react-redux";
import {fetchCoffeeData} from "../../features/coffee/coffeeSlice";
import {fetchBeansData} from "../../features/beans/beansSlice";
import HomeCart from "../../components/Home-Cart/Cart";
import HomeCoffeeBeans from "../../components/Home-Coffee-Beans/Cart";
import {router} from "expo-router";
import {addToCart} from "../../features/cart";
import PopUpAnimation from "../../components/Animation/PopUpAnimation";
import successAnimation from "../../assets/animations/Success.json";
import image from "../../assets/logo/huge/logo-2.png"
import logo from "../../assets/logo/huge/logo-1.png"


export default function Index() {
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [showAnimation, setShowAnimation] = useState(false);
    const [animationMessage, setAnimationMessage] = useState("");

    const dispatch = useDispatch();
    const {data: coffeeData, error} = useSelector((state) => state.coffeeData);
    const {data: beansData} = useSelector((state) => state.beansData);
    const {user, isAuthenticated, token} = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(fetchCoffeeData());
        dispatch(fetchBeansData());
    }, [dispatch]);

    const categories = [
        "All",
        "Cappucchino",
        "Espresso",
        "Americano",
        "Latte",
        "Macchiato",
    ];

    const filteredData =
        Array.isArray(coffeeData) && selectedCategory === "All"
            ? coffeeData
            : coffeeData?.filter((item) => item.name === selectedCategory) || [];

    if (error) {
        return (
            <View
                style={{flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "black"}}
            >
                <Text style={{color: "red"}}>Error: {error}</Text>
            </View>
        );
    }

    const handleAddToCart = (item, selectedSize) => {
        if (!user?.id) return;

        dispatch(
            addToCart({
                userId: user.id,
                productId: item.id,
                name: item.name,
                type: item.type,
                image: item.imagelink_square,
                size: selectedSize.size,
                price: parseFloat(selectedSize.price),
                quantity: 1,
            })
        );

        setAnimationMessage(` added to cart`);
        setShowAnimation(true);

        setTimeout(() => {
            setShowAnimation(false);
        }, 1500);
    };

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: "#000"}}>

            {/* Header */}
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingLeft: 10,
                    paddingRight: 10,
                    padding: 10,
                }}
            >
                <View>
                    <Text style={{color: "#aaa", fontSize: 16}}>Welcome 👋</Text>
                    <Text style={{color: "#fff", fontSize: 22, fontWeight: "bold"}}>
                        {isAuthenticated && user?.userName ? user.userName : "Guest"}
                    </Text>

                </View>
                <Image source={image} style={{width: 120, height: 70}}/>
                <View>

                    <TouchableOpacity onPress={() => router.push("/Profile")}>
                        <Image
                            // source={{uri: user?.profile || "https://i.pravatar.cc/100"}}
                            source={logo}
                            style={{
                                width: 45,
                                height: 45,
                                borderRadius: 999,
                                borderWidth: 2,
                                borderColor: "#D17842",
                            }}
                        />
                    </TouchableOpacity>
                </View>
            </View>


            <ScrollView contentContainerStyle={{padding: 16, paddingBottom: 100}}>

                {/* Search */}
                <View
                    style={{
                        backgroundColor: "#252A32",
                        borderRadius: 30,
                        flexDirection: "row",
                        alignItems: "center",
                        paddingHorizontal: 16,
                        paddingVertical: 12,
                        marginBottom: 24,
                    }}
                >
                    <Ionicons name="search" size={20} color="#fff"/>
                    <TextInput
                        placeholder="Search your coffee..."
                        placeholderTextColor="#ccc"
                        style={{
                            marginLeft: 10,
                            color: "#fff",
                            flex: 1,
                            fontSize: 16,
                        }}
                    />
                </View>

                {/* Categories */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom: 24}}>
                    {categories.map((category, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => setSelectedCategory(category)}
                            style={{marginRight: 20}}
                        >
                            <Text
                                style={{
                                    color: selectedCategory === category ? "#D17842" : "#888",
                                    fontSize: 16,
                                    fontWeight: "600",
                                    borderBottomWidth: selectedCategory === category ? 2 : 0,
                                    borderColor: "#D17842",
                                    paddingBottom: 4,
                                }}
                            >
                                {category}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                <Text style={{color: "#fff", fontSize: 22, fontWeight: "bold", marginBottom: 16}}>
                    Coffee
                </Text>

                {/* Coffee Cards */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom: 32}}>
                    <View style={{flexDirection: "row"}}>
                        {filteredData.map((item) => (
                            <HomeCart key={item.id} item={item} onAddToCart={handleAddToCart}/>
                        ))}
                    </View>
                </ScrollView>

                {/* Beans */}
                <Text style={{color: "#fff", fontSize: 22, fontWeight: "bold", marginBottom: 16}}>
                    Beans
                </Text>

                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={{flexDirection: "row"}}>
                        {beansData.map((item) => (
                            <HomeCoffeeBeans key={item.id} item={item} onAddToCart={handleAddToCart}/>
                        ))}
                    </View>
                </ScrollView>

                <Text className="text-white text-xl">☕ Welcome to the shop!</Text>

            </ScrollView>



            {/* Pop-up Animation */}
            {showAnimation && (
                <View
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 1000,
                        backgroundColor: "rgba(0,0,0,0.5)",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <PopUpAnimation style={{width: 150, height: 150}} source={successAnimation}/>
                    <Text style={{color: "#fff", fontSize: 16, fontWeight: "bold", marginTop: 10}}>
                        {animationMessage}
                    </Text>
                </View>
            )}
        </SafeAreaView>
    );
}
