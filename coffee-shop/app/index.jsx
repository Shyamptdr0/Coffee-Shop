import { Text, View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import logo from "../assets/logo/huge/logo-1.png";


export default function Index() {
    const router = useRouter();

    return (
        <View className="flex-1 p-8 items-center " style={{ backgroundColor: "#000"}}>
            {/* Centered Image at Top */}
            <View className="w-full items-center mt-6">
                <Image source={logo} style={{ width: 270, height: 270 }} />
            </View>

            {/* Title */}
            <Text className="font-semibold text-[50px] text-white mt-[-30px]">Coffee Shop</Text>

            {/* Signup & Login Buttons */}
            <View className="mt-10">
                <TouchableOpacity
                    onPress={() => router.push("/(auth)/signup")}
                    className="mt-6 bg-[#D17842] px-8 py-3 rounded-full"
                >
                    <Text className="text-white text-lg font-semibold text-center">Signup</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => router.push("/(auth)")}
                    className="mt-4 border border-white px-8 py-3 rounded-full"
                >
                    <Text className="text-white text-lg font-semibold text-center">Login</Text>
                </TouchableOpacity>

                {/* Horizontal Line */}
                <View className="mt-8 items-center">
                    <View className="h-[1px] bg-white w-40 opacity-60" />
                </View>
            </View>

            {/* Quote with Gradient Background */}

               <View className="mt-20 border border-gray-500 p-8 pl-4 rounded-r-full">
                   <Text className="text-white text-[23px]">Some days make the coffee,</Text>
                   <Text className="text-white text-[23px] mt-2">other days the coffee makes you</Text>
               </View>

        </View>
    );
}
