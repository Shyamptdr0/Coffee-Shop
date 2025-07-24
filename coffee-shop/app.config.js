import 'dotenv/config';

export default {
    expo: {
        name: "Coffee Shop",
        slug: "coffee-shop",
        version: "1.0.0",
        runtimeVersion: "1.0.0",
        orientation: "portrait",
        icon: "./assets/logo/logo/1.png",
        scheme: "coffeeshop",
        userInterfaceStyle: "automatic",
        newArchEnabled: true,
        ios: {
            supportsTablet: true
        },
        android: {
            package: "com.shyamptdr.coffeeshop",
            versionCode: 1,
            adaptiveIcon: {
                foregroundImage: "./assets/logo/logo/1.png",
                backgroundColor: "#000000"
            },
            edgeToEdgeEnabled: true
        },
        web: {
            bundler: "metro",
            output: "static",
            favicon: "./assets/logo/logo/1.png"
        },
        plugins: [
            "expo-router",
            [
                "expo-splash-screen",
                {
                    image: "./assets/logo/logo/1.png",
                    imageWidth: 200,
                    resizeMode: "contain",
                    backgroundColor: "#000000"
                }
            ]
        ],
        experiments: {
            typedRoutes: true
        },
        updates: {
            url: "https://u.expo.dev/7745cedd-02b2-4559-95f3-37cc001f1370",
            fallbackToCacheTimeout: 0,
            channel: "preview" // Important!
        },
        extra: {
            BASE_URL: process.env.BASE_URL,
            eas: {
                projectId: "7745cedd-02b2-4559-95f3-37cc001f1370"
            }
        }
    }
};
