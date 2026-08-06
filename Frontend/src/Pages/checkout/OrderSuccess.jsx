import { useParams } from "react-router";

export default function OrderSuccess() {
    const { id } = useParams();

    const goHome = () => {
        window.location.href = "/";
    };

    return (
        <div className="bg-slate-50 py-16">
            <div className="mx-auto w-full max-w-[760px] px-6">
                <div className="rounded-3xl border border-emerald-200 bg-white p-10 text-center shadow-sm">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl text-emerald-700">
                        ✓
                    </div>
                    <h1 className="mt-6 text-4xl font-black text-emerald-700">Order placed successfully</h1>

                    <p className="mt-4 text-slate-600">
                        {id ? (
                            <>Your Order ID: <span className="font-bold text-slate-900">{id}</span></>
                        ) : (
                            <>Your order has been placed successfully.</>
                        )}
                    </p>

                    <button
                        onClick={goHome}
                        className="mt-8 inline-flex items-center justify-center rounded-xl bg-teal-700 px-8 py-3 text-sm font-bold text-white hover:bg-teal-800"
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        </div>
    );
}