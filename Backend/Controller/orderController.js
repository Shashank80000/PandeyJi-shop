import Order from '../model/Order.js';
import Cart from '../model/cart.js';
import Product from '../model/product.js';

export const placeOrder = async (req, res) => {
    try {
        const { userId, address } = req.body;
        if (!userId || !address) {
            return res.status(400).json({ message: "userId and address are required" });
        }

        //Get Cart
        const cart = await Cart.findOne({ userId }).populate('items.productId');
        if (!cart || !Array.isArray(cart.items) || cart.items.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        //Prepare Order Items
        const validItems = cart.items.filter(
            item => item?.productId && item?.productId?._id
        );
        if (validItems.length === 0) {
            return res.status(400).json({ message: "No valid products found in cart" });
        }

        const orderItems = validItems.map(item => ({
            productId: item.productId._id,
            quantity: Number(item.quantity || 0),
            price: Number(item.productId.price || 0),
        }));

        //Calculate Total Amount
        const totalAmount = orderItems.reduce((total, item) => total + (item.price * item.quantity), 0);

        //Deduct stock from Products
        for (const item of validItems){
            await Product.findByIdAndUpdate(item.productId._id, { $inc: { stock: -item.quantity } });
        }

        const normalizedAddress = {
            fullName: address.fullName,
            phone: address.phone,
            addressLine: address.addressLine || address.adressLine || "",
            city: address.city,
            state: address.state,
            pincode: address.pincode,
        };

        //Create Order
        const order = await Order.create({
            userId,
            items: orderItems,
            address: normalizedAddress,
            totalAmount,
            paymentMethod: "COD",
        });

        //Clear Cart
        await Cart.findOneAndUpdate({ userId }, { items: [] });

        return res.status(201).json({ message: "Order placed successfully", orderId: order._id });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("userId", "name email")
            .populate("items.productId", "title name images image price")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: orders.length,
            orders,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch orders",
            error: error.message,
        });
    }
};