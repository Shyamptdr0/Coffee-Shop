// components/UpdateChecker.js

import React, { useEffect, useState } from "react";
import * as Updates from "expo-updates";
import AlertBox from "../AlertBox/UpdateAlert";

const UpdateChecker = ({ children }) => {
    const [showUpdateModal, setShowUpdateModal] = useState(false);

    useEffect(() => {
        const checkForUpdates = async () => {
            try {
                const update = await Updates.checkForUpdateAsync();
                if (update.isAvailable) {
                    await Updates.fetchUpdateAsync();
                    setShowUpdateModal(true); // Show custom alert box
                }
            } catch (e) {
                console.log("Error checking for updates:", e);
            }
        };

        checkForUpdates();
    }, []);

    const handleConfirm = () => {
        setShowUpdateModal(false);
        Updates.reloadAsync(); // Apply update
    };

    const handleCancel = () => {
        setShowUpdateModal(false);
    };

    return (
        <>
            {children}
            <AlertBox
                visible={showUpdateModal}
                title="Update Available"
                message="A new version is ready. Restart to apply it now?"
                onCancel={handleCancel}
                onConfirm={handleConfirm}
            />
        </>
    );
};

export default UpdateChecker;
