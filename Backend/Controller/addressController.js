import Address from "../model/address.js";
import mongoose from "mongoose";

//Save Address
export const saveAddress = async (req, res) => {
    try{
        const { userId, fullName, phone, city, state, pincode } = req.body;
        const addressLine = req.body.addressLine || req.body.adressLine;

        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "A valid userId is required" });
        }
        if (!fullName || !phone || !addressLine || !city || !state || !pincode) {
            return res.status(400).json({ message: "All address fields are required" });
        }

        const address = await Address.create({ userId, fullName, phone, addressLine, city, state, pincode });
        res.status(201).json({ message: "Address saved successfully", address });
    } catch (error) {
        res.status(500).json({ message: "Error saving address" });
    }
};

//Get Addresses by User ID
export const getAddresses = async (req, res) => {
    try{
        if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
            return res.status(400).json({ message: "Invalid user id" });
        }

        const addresses = await Address.find({
            userId: req.params.userId
        })
        res.json(addresses);
    } catch (error) {
        res.status(500).json({ message: "Error fetching addresses" });
    }
};