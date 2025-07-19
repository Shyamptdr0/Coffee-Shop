import React, {useState, useRef} from 'react';
import {View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {Image} from 'expo-image';
import {Ionicons} from '@expo/vector-icons';
import {useRouter} from 'expo-router';
import logo from '../../assets/logo/huge/logo-1.png';
import {useDispatch, useSelector} from 'react-redux';
import {registerUser} from '../../features/auth/authSlice';
import {useToast} from 'react-native-toast-notifications';

export default function SignUp() {
    const toast = useToast();
    const router = useRouter();
    const dispatch = useDispatch();

    const emailRef = useRef(null);
    const passwordRef = useRef(null);

    const [gender, setGender] = useState(null);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);


    const handleSignUp = () => {
        if (!username || !email || !password || !gender) {
            return toast.show('All fields are required', { type: 'danger' });
        }

        setIsSubmitting(true);

        const formData = {
            userName: username,
            email,
            password,
            gender,
        };


        dispatch(registerUser(formData))
            .then((res) => {
                if (res.meta.requestStatus === 'fulfilled') {
                    toast.show('Registration successful!', { type: 'success' });
                    setTimeout(() => router.replace('/(auth)'), 1500);
                } else {
                    const errorMsg = res?.payload?.message || 'Something went wrong';

                    if (errorMsg.includes('Email already exists')) {
                        toast.show('This email is already registered.', { type: 'danger' });
                    } else if (errorMsg.includes('Username already exists')) {
                        toast.show('This username is already taken.', { type: 'danger' });
                    } else {
                        toast.show(errorMsg, { type: 'danger' });
                    }
                }
                setIsSubmitting(false);
            })
            .catch(() => {
                toast.show('Registration failed', { type: 'danger' });
                setIsSubmitting(false);
            });

    };




    return (
        <View className="flex-1 bg-black px-6">
            {/* Logo */}
            <View className="w-full items-center mt-16">
                <Image source={logo} style={{width: 150, height: 120}}/>
            </View>

            {/* Main Container */}
            <LinearGradient
                className="mt-6"
                colors={['#1A1D23', '#2A2E36']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
                style={{
                    padding: 20,
                    paddingTop: 20,
                    shadowRadius: 8,
                    borderRadius: 40,
                    shadowColor: '#000',
                    shadowOffset: {width: 0, height: 5},
                    shadowOpacity: 0.3,
                    elevation: 10,
                }}
            >
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                    {/* Title */}
                    <Text className="text-white text-4xl font-bold mb-5 text-center">Sign Up</Text>

                    <View>
                        {/* Username */}
                        <TextInput
                            placeholder="Username"
                            value={username}
                            onChangeText={setUsername}
                            placeholderTextColor="#AEAEAE"
                            returnKeyType="next"
                            onSubmitEditing={() => emailRef.current?.focus()}
                            className="bg-black/20 border border-gray-400 text-white px-4 py-3 rounded-lg mb-5"
                        />

                        {/* Email */}
                        <TextInput
                            ref={emailRef}
                            placeholder="Email"
                            value={email}
                            onChangeText={setEmail}
                            placeholderTextColor="#AEAEAE"
                            keyboardType="email-address"
                            returnKeyType="next"
                            onSubmitEditing={() => passwordRef.current?.focus()}
                            className="bg-black/20 border border-gray-400 text-white px-4 py-3 rounded-lg mb-5"
                        />

                        {/* Password */}
                        <View className="relative mb-5">
                            <TextInput
                                ref={passwordRef}
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

                        {/* Gender */}
                        <Text className="text-white text-base mb-2">Select Gender</Text>
                        <View className="flex-row mb-6">
                            {['male', 'female'].map((option) => (
                                <TouchableOpacity
                                    key={option}
                                    onPress={() => setGender(option)}
                                    className="flex-row items-center mr-6"
                                >
                                    <View
                                        className={`w-5 h-5 mr-2 rounded-full border ${
                                            gender === option
                                                ? 'bg-[#D17842] border-[#D17842]'
                                                : 'border-gray-400'
                                        }`}
                                    />
                                    <Text className="text-white capitalize">{option}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Submit Button */}
                        <TouchableOpacity
                            onPress={handleSignUp}
                            className="bg-[#D17842] py-4 rounded-lg"
                        >
                            <Text className="text-white text-center text-lg font-semibold">
                                {isSubmitting ? 'Signing up...' : 'Sign Up'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Already have account */}
                    <TouchableOpacity onPress={() => router.push('/(auth)')} className="mt-6">
                        <Text className="text-gray-200 text-center">
                            Already have an account? <Text className="text-white underline">Login</Text>
                        </Text>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            </LinearGradient>
        </View>
    );
}
