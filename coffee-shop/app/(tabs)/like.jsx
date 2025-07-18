import React, {useEffect} from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {Ionicons} from '@expo/vector-icons';
import {router} from 'expo-router';
import {getFavourites, removeFromFav} from '../../features/like/index';

const {width} = Dimensions.get("window");

export default function LikeScreen() {
    const {isAuthenticated, user} = useSelector((state) => state.auth);
    const {favourites} = useSelector((state) => state.like);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!isAuthenticated) {
            router.replace("/(auth)");
        } else {
            dispatch(getFavourites(user.id));
        }
    }, [isAuthenticated]);

    const handleRemoveFav = (productId) => {
        dispatch(removeFromFav({userId: user.id, productId}));
    };

    const renderItem = ({item}) => (
        <View style={styles.card}>
            <Image source={{uri: item.image}} style={styles.image}/>

            <TouchableOpacity
                style={styles.heartIcon}
                onPress={() => handleRemoveFav(item.productId)}
            >
                <Ionicons name="heart" size={22} color="red"/>
            </TouchableOpacity>

            <View style={styles.content}>
                <Text style={styles.name}>{item.name}</Text>
                <View style={styles.tagRow}>
                    <View style={styles.tag}>
                        <Ionicons name="cafe" size={14} color="#D17842"/>
                        <Text style={styles.tagText}>{item.type}</Text>
                    </View>
                    {item.description?.toLowerCase().includes("milk") && (
                        <View style={styles.tag}>
                            <Ionicons name="water" size={14} color="#D17842"/>
                            <Text style={styles.tagText}>Milk</Text>
                        </View>
                    )}
                </View>

                <View style={styles.bottomRow}>
                    <Text style={styles.rating}>
                        <Ionicons name="star" size={14} color="#D17842"/> {item.average_rating} ({item.ratings_count})
                    </Text>
                    <View style={styles.roastTag}>
                        <Text style={styles.roastText}>{item.roasted}</Text>
                    </View>
                </View>

                <Text style={styles.description} numberOfLines={2}>
                    {item.description}
                </Text>
            </View>
        </View>
    );

    return (
        <View style={{ flex: 1, backgroundColor: '#000' }}>
            {favourites.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="heart-dislike" size={60} color="#555" />
                    <Text style={styles.emptyText}>No favorites yet</Text>
                </View>
            ) : (
                <FlatList
                    data={favourites}
                    keyExtractor={(item) => item.productId}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingBottom: 100 }}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );

}

const styles = StyleSheet.create({
    header: {
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#000',
    },
    headerText: {
        color: '#fff',
        fontSize: 26,
        fontWeight: 'bold',
    },
    card: {
        backgroundColor: '#1e1e1e',
        marginHorizontal: 20,
        borderRadius: 20,
        marginBottom: 20,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: width * 0.6,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    heartIcon: {
        position: 'absolute',
        top: 16,
        right: 16,
        backgroundColor: '#00000099',
        padding: 8,
        borderRadius: 20,
    },
    content: {
        padding: 16,
    },
    name: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    tagRow: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    tag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#252A32',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 8,
        marginRight: 8,
    },
    tagText: {
        color: '#fff',
        marginLeft: 4,
        fontSize: 12,
    },
    bottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    rating: {
        color: '#fff',
        fontSize: 13,
    },
    roastTag: {
        backgroundColor: '#252A32',
        borderRadius: 8,
        paddingVertical: 4,
        paddingHorizontal: 8,
    },
    roastText: {
        color: '#fff',
        fontSize: 12,
    },
    description: {
        color: '#ccc',
        fontSize: 13,
        lineHeight: 18,
        marginTop: 6,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
    },
    emptyText: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold',
        marginTop: 20,
    },
    emptySubText: {
        color: '#888',
        fontSize: 14,
        marginTop: 10,
        textAlign: 'center',
    },

});
