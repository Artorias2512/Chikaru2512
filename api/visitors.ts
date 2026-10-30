
import { Redis } from "@upstash/redis";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const redis = Redis.fromEnv();

export default async function handler(
    req: VercelRequest,
    res: VercelResponse
) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const count = await redis.incr("chikaru:page_visits");

        return res.status(200).json({ count });
    } catch (error) {
        console.error("Visitor counter error:", error);
        return res.status(500).json({ error: "Unable to update visitor count" });
    }
}
