import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(
    req: VercelRequest,
    res: VercelResponse
) {
    if (req.method !== "GET") {
        return res.status(405).json({
            error: "Method not allowed"
        });
    }

    const workspace = process.env.COUNTER_WORKSPACE;
    const token = process.env.COUNTER_TOKEN;

    if (!workspace || !token) {
        return res.status(500).json({
            error: "CounterAPI environment variables are missing"
        });
    }

    try {
        const response = await fetch(
            `https://api.counterapi.dev/v2/${workspace}/visits`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json(data);
        }

        return res.status(200).json(data);

    } catch (error) {

        return res.status(500).json({
            error: "Cannot connect to CounterAPI"
        });
    }
}