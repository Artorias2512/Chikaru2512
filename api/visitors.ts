
import { Redis } from "@upstash/redis";
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(
    req: VercelRequest,
    res: VercelResponse
) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const redis = Redis.fromEnv();

        const forwardedFor = req.headers["x-forwarded-for"];

        const ip = typeof forwardedFor === "string"
            ? forwardedFor.split(",")[0].trim()
            : req.socket.remoteAddress || "Unknown";

        const time = new Date().toISOString();

        const count = await redis.incr("chikaru:page_visits");

        const visitor = JSON.stringify({
            ip: ip,
            time: time
        });

        await redis.lpush("chikaru:visitor_ips", visitor);
        await redis.ltrim("chikaru:visitor_ips", 0, 99);
        await redis.expire("chikaru:visitor_ips", 2592000);

        return res.status(200).json({ count });

    } catch (error) {
        console.error("Visitor counter error:", error);

        return res.status(500).json({
            error: "Unable to update visitor count"
        });
    }
}
