import connection from "@/lib/dbconnect";
import { Tag } from "@/models/tag"; // Make sure you have a Tag model
import { NextResponse } from "next/server";

export async function GET(req) {
    await connection();

    // Parse query params
    const { searchParams } = new URL(req.url);

    const idsParam = searchParams.get("ids");

    // If no IDs are provided, return an empty array
    if (!idsParam) {
        const tags = await Tag.find({});
        return NextResponse.json({
            message: "No IDs provided, returning all tags",
            tags: tags,
            status: 200
        });
    }

    // Split IDs and trim
    const ids = idsParam.split(",").map(id => id.trim()).filter(Boolean);

    let tags = [];
    try {
        // If your tags are stored by _id (ObjectId) and unique only:
        tags = await Tag.find({ _id: { $in: ids } });

        // If your tags are stored by name, use:
        // tags = await Tag.find({ name: { $in: ids } });

        if (!tags || tags.length === 0) {
            return NextResponse.json({
                message: "No tags found for the provided IDs",
                tags: [],
                status: 404
            });
        }

        return NextResponse.json({
            message: "Tags fetched successfully",
            tags: tags,
            status: 200
        });
    } catch (error) {
        return NextResponse.json({
            error: "Error fetching tags",
            details: error.message,
            status: 500
        });
    }
}