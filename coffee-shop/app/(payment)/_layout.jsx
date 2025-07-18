import React, {useState} from 'react';
import { Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, Alert } from 'react-native';
import AlertBox from "../../components/AlertBox/Alert";

export default function PaymentLayout() {

    const [showAlert, setShowAlert] = useState(false);

    const handleCancel = () => {
        setShowAlert(true);
    };

    return (
        <Stack>
            <Stack.Screen
                name="index"


                options={{
                    headerShown: false,
                    title: "Payment",
                    headerStyle: { backgroundColor: '#000' },
                    headerTintColor: '#fff',
                    headerTitleAlign: 'center',
                    headerLeft: () => (
                        <TouchableOpacity
                            style={{ paddingHorizontal: 16 }}
                            onPress={handleCancel}
                        >
                            <AlertBox
                                visible={showAlert}
                                title="Cancel Payment?"
                                message="Are you sure you want to cancel the payment?"
                                onCancel={() => setShowAlert(false)}
                                onConfirm={() => {
                                    setShowAlert(false);
                                    router.replace('/(tabs)/cart');
                                }}
                            />
                            <Ionicons name="arrow-back" size={24} color="#fff" />
                        </TouchableOpacity>
                    ),
                }}
            />
        </Stack>
    );
}
