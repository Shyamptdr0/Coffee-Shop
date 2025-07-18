import mongoose from "mongoose";

const favouriteSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        productId: {
            type: String,
            required: true
        },
        name: String,
        type: String, // 'Bean' or 'Coffee'
        image: String,
        size: String,
        price: Number,
        description: String,
        roasted: String,
        average_rating: String,
        ratings_count: String,
        favourite: Boolean,
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Favourite", favouriteSchema);
