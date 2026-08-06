import { useEffect, useState } from "react";
import api from "../api/axios";

export default function OrderList() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await api.get("/orders/all");
                setOrders(res.data.orders || []);
            } catch (error) {
                console.error("Error fetching orders:", error);
                setOrders([]);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) {
        return (
            <div className="p-8 text-center text-slate-500">
                Loading orders...
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-7xl p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900">
                    Customer Orders
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                    {orders.length} orders found
                </p>
            </div>

            {orders.length === 0 ? (
                <div className="rounded-xl border p-10 text-center text-slate-500">
                    No orders found.
                </div>
            ) : (
                <div className="space-y-5">
                    {orders.map((order) => (
                        <div
                            key={order._id}
                            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
                        >
                            {/* Order header */}
                            <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
                                <div>
                                    <p className="text-xs text-slate-500">
                                        ORDER
                                    </p>

                                    <p className="font-semibold">
                                        #{order._id.slice(-8).toUpperCase()}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-slate-500">
                                        DATE
                                    </p>

                                    <p className="text-sm">
                                        {new Date(
                                            order.createdAt
                                        ).toLocaleDateString()}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-slate-500">
                                        TOTAL
                                    </p>

                                    <p className="text-lg font-bold">
                                        ₹{Number(
                                            order.totalAmount || 0
                                        ).toFixed(2)}
                                    </p>
                                </div>

                                <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                                    {order.status}
                                </span>
                            </div>

                            {/* Customer */}
                            <div className="grid gap-6 py-5 md:grid-cols-2">
                                <div>
                                    <h2 className="mb-2 font-semibold">
                                        Customer
                                    </h2>

                                    <p>
                                        {order.address?.fullName ||
                                            order.userId?.name}
                                    </p>

                                    <p className="text-sm text-slate-500">
                                        {order.userId?.email}
                                    </p>

                                    <p className="text-sm text-slate-500">
                                        {order.address?.phone}
                                    </p>
                                </div>

                                <div>
                                    <h2 className="mb-2 font-semibold">
                                        Delivery Address
                                    </h2>

                                    <p className="text-sm text-slate-600">
                                        {order.address?.addressLine}
                                    </p>

                                    <p className="text-sm text-slate-600">
                                        {order.address?.city},{" "}
                                        {order.address?.state}
                                    </p>

                                    <p className="text-sm text-slate-600">
                                        PIN: {order.address?.pincode}
                                    </p>
                                </div>
                            </div>

                            {/* Products */}
                            <div className="border-t pt-5">
                                <h2 className="mb-3 font-semibold">
                                    Products
                                </h2>

                                <div className="space-y-3">
                                    {order.items?.map((item, index) => (
                                        <div
                                            key={item._id || index}
                                            className="flex items-center gap-4 rounded-lg bg-slate-50 p-3"
                                        >
                                            <img
                                                src={
                                                    item.productId
                                                        ?.images?.[0] ||
                                                    item.productId
                                                        ?.image ||
                                                    ""
                                                }
                                                alt={
                                                    item.productId
                                                        ?.title ||
                                                    item.productId
                                                        ?.name ||
                                                    "Product"
                                                }
                                                className="h-16 w-16 rounded-lg object-contain"
                                            />

                                            <div className="flex-1">
                                                <p className="font-medium">
                                                    {item.productId
                                                        ?.title ||
                                                        item.productId
                                                            ?.name ||
                                                        "Product"}
                                                </p>

                                                <p className="text-sm text-slate-500">
                                                    Qty: {item.quantity}
                                                </p>
                                            </div>

                                            <p className="font-semibold">
                                                ₹{Number(
                                                    item.price || 0
                                                ).toFixed(2)}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-5 flex justify-between border-t pt-4">
                                <span className="text-sm text-slate-500">
                                    Payment
                                </span>

                                <span className="font-semibold">
                                    {order.paymentMethod}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}