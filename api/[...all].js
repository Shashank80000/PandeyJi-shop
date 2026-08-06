export default async function handler(req, res) {
	try {
		const { default: app } = await import("../Backend/server.js");
		return app(req, res);
	} catch (error) {
		console.error("API bootstrap failed", error);
		return res.status(500).json({
			message: "API bootstrap failed",
			error: error.message,
			stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
		});
	}
}
