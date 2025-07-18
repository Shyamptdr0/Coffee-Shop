import Favourite from '../../models/Like.js';
import Coffee from '../../data/coffeeData/coffeeData.js';
import Bean from '../../data/beansData/beansData.js';

export const addToFav = async (req, res) => {
    try {
        const { userId, productId, favourite } = req.body;

        if (!userId || !productId) {
            return res.status(400).json({ message: 'userId and productId are required' });
        }

        // Check if already favourited
        const existing = await Favourite.findOne({ userId, productId });
        if (existing) {
            return res.status(400).json({ message: 'Already in favourites' });
        }

        // Try to find product in Coffee array
        let product = Coffee.find((item) => item.id === productId);
        let type = 'Coffee';

        // If not found, try Bean array
        if (!product) {
            product = Bean.find((item) => item.id === productId);
            type = 'Bean';
        }

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Construct favourite data with full product details
        // const firstPrice = product.prices[0] || {};

        const favData = {
            userId,
            productId,
            favourite: favourite === true,
            name: product.name,
            type,
            image: product.imagelink_square,
            // size: firstPrice.size || '',
            // price: firstPrice.price || '',
            description: product.description,
            roasted: product.roasted || '',
            average_rating: product.average_rating || '',
            ratings_count: product.ratings_count || '',
        };


        const fav = await Favourite.create(favData);
        return res.status(201).json(fav);

    } catch (err) {
        res.status(500).json({ message: 'Error adding favourite', error: err.message });
    }
};


// Remove from favourites
export  const removeFav = async (req, res) => {
    const { userId, productId } = req.body;
    try {
        await Favourite.findOneAndDelete({ userId, productId });
        res.status(200).json({ message: 'Removed from favourites' });
    } catch (err) {
        res.status(500).json({ message: 'Error removing favourite', error: err.message });
    }
};

// Get user favourites
export const getFav = async (req, res) => {
    try {
        const favs = await Favourite.find({ userId: req.params.userId });
        res.status(200).json(favs);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching favourites', error: err.message });
    }
};

