import React, {useRef, useState} from 'react';
import {View, Text, TextInput, TouchableOpacity, Alert, Platform, KeyboardAvoidingView} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {Image} from "expo-image";
import logo from "../../assets/logo/huge/logo-1.png";
import {useRouter} from "expo-router";
import {useDispatch, useSelector} from "react-redux";
import {loginUser} from "../../features/auth/authSlice";
import {Ionicons} from "@expo/vector-icons";
import {useToast} from "react-native-toast-notifications";

export default function Login() {
    const toast = useToast();

    const router = useRouter();
    const dispatch = useDispatch();

    const passwordRef = useRef(null);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const {isAuthenticated} = useSelector((state) => state.auth);
    const [isSubmitting, setIsSubmitting] = useState(false);


    const handleLogin = async () => {
        if (!email || !password) {
            toast.show("Please enter both email and password", {type: "danger"});
            return;
        }

        setIsSubmitting(true); // start loading

        const action = await dispatch(loginUser({email, password}));

        const isSuccess =
            loginUser.fulfilled.match(action) &&
            action.payload?.success === true &&
            action.payload?.token;

        if (isSuccess) {
            toast.show("Login Successful", {type: "success"});
            router.replace("/(tabs)");
        } else {
            toast.show(action.payload?.message || 'Invalid credentials', {type: "danger"});
        }

        setIsSubmitting(false); // end loading
    };



    if (isAuthenticated) return null;
    return (
        <View className="flex-1 bg-black px-6">

            {/* Logo */}
            <View className="w-full items-center mt-20">
                <Image source={logo} style={{width: 200, height: 150}}/>
            </View>

            {/* Gradient Background */}
            <LinearGradient
                className="mt-12"
                colors={['#1A1D23', '#2A2E36']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
                style={{
                    padding: 20,
                    paddingTop: 20,
                    borderRadius: 40,
                    shadowColor: '#000',
                    shadowOffset: {width: 0, height: 5},
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 10,
                }}
            >
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                    <Text className="text-white text-4xl font-bold mb-10 text-center">Login</Text>

                    <View>
                        <TextInput
                            placeholder="Email"
                            value={email}
                            onChangeText={setEmail}
                            placeholderTextColor="#AEAEAE"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            returnKeyType="next"
                            onSubmitEditing={() => passwordRef.current?.focus()}
                            className="bg-black/20 border border-gray-400 text-white px-4 py-3 rounded-lg mb-5"
                        />

                        <View className="relative mb-5">
                            <TextInput
                                placeholder="Password"
                                value={password}
                                onChangeText={setPassword}
                                placeholderTextColor="#AEAEAE"
                                secureTextEntry={!showPassword}
                                returnKeyType="done"
                                className="bg-black/20 border border-gray-400 text-white px-4 py-3 rounded-lg pr-10"
                            />
                            <TouchableOpacity
                                onPress={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-3"
                            >
                                <Ionicons
                                    name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                                    size={22}
                                    color="#AEAEAE"
                                />
                            </TouchableOpacity>
                        </View>


                        <TouchableOpacity
                            onPress={handleLogin}
                            className="bg-[#D17842] py-4 rounded-lg"
                        >
                            <Text className="text-white text-center text-lg font-semibold">
                                {isSubmitting ? 'Logging...' : 'Login'}
                            </Text>


                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity onPress={() => router.push("/(auth)/signup")} className="mt-6">
                        <Text className="text-gray-200 text-center">
                            Don't have an account? <Text className="text-white underline">Sign up</Text>
                        </Text>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            </LinearGradient>
        </View>
    );
}
