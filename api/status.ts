let activity = {
    app: "Offline",
    title: "",
    artist: "",
    spotify: false,
    updatedAt: 0
};

export default function handler(req: any, res: any) {

    res.setHeader(
        "Access-Control-Allow-Origin",
        "*"
    );

    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS"
    );

    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, X-Tracker-Token"
    );

    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    if (req.method === "GET") {

        const isOffline =
            activity.updatedAt === 0 ||
            Date.now() - activity.updatedAt > 15000;

        if (isOffline) {

            return res.status(200).json({
                app: "Offline",
                title: "",
                artist: "",
                spotify: false,
                updatedAt: activity.updatedAt
            });
        }

        return res.status(200).json(activity);
    }

    if (req.method === "POST") {

        const token =
            req.headers["x-tracker-token"];

        const secret =
            process.env.TRACKER_SECRET;

        if (!secret) {

            return res.status(500).json({
                error: "TRACKER_SECRET is not configured."
            });
        }

        if (token !== secret) {

            return res.status(401).json({
                error: "Unauthorized."
            });
        }

        const {
            app,
            title,
            artist,
            spotify
        } = req.body || {};

        activity = {
            app: app || "Unknown",
            title: title || "",
            artist: artist || "",
            spotify: spotify === true,
            updatedAt: Date.now()
        };

        return res.status(200).json({
            success: true
        });
    }

    return res.status(405).json({
        error: "Method not allowed."
    });
}