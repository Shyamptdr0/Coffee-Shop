import { View, Text, Modal, TouchableOpacity } from "react-native";
import React from "react";
import { BlurView } from "expo-blur";

const AlertBox = ({ visible, title, message, onConfirm, onCancel }) => {
    return (
        <Modal animationType="fade" transparent={true} visible={visible}>
            <BlurView intensity={80} tint="dark" className="flex-1 justify-center items-center">
                <View className="bg-[#1e1e1e] p-6 rounded-2xl w-[80%] shadow-lg shadow-black">
                    <Text className="text-white text-lg font-semibold mb-2">{title}</Text>
                    <Text className="text-gray-300 mb-4">{message}</Text>
                    <View className="flex-row justify-end space-x-3">
                        <TouchableOpacity onPress={onCancel} className="px-4 py-2 rounded-lg bg-gray-600">
                            <Text className="text-white">No</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={onConfirm} className="px-4 py-2 rounded-lg bg-[#D17842]">
                            <Text className="text-white">Yes</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </BlurView>
        </Modal>
    );
};

export default AlertBox;
