// components/UpdateChecker.js

import React, { useEffect, useState } from "react";
import * as Updates from "expo-updates";
import AlertBox from "../AlertBox/UpdateAlert";

const UpdateChecker = ({ children }) => {
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [updateFetched, setUpdateFetched] = useState(false);
    const [dismissedOnce, setDismissedOnce] = useState(false);

    useEffect(() => {
        const checkForUpdates = async () => {
            try {
                const update = await Updates.checkForUpdateAsync();
                if (update.isAvailable) {
                    await Updates.fetchUpdateAsync(); // Download but do not apply
                    setUpdateFetched(true);
                    if (!dismissedOnce) {
                        setShowUpdateModal(true);
                    }
                }
            } catch (e) {
                console.log("Error checking for updates:", e);
            }
        };

        checkForUpdates();
    }, [dismissedOnce]);

    const handleConfirm = () => {
        setShowUpdateModal(false);
        Updates.reloadAsync(); // Apply update now
    };

    const handleCancel = () => {
        setDismissedOnce(true); // Mark as dismissed for this session
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
