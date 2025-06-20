import { Tag } from "@/models/tag";
import connection from "@/lib/dbconnect";
import { NextResponse } from 'next/server';


export async function GET(req, context) {
    await connection();
    try {
        const { id: snippetId } = await context.params;
        

        console.log('Search Params:',snippetId);

        if (!snippetId) {
            return NextResponse.json({
                error: 'snippedId parameter is required',
                status: 400
            });
        }

        const tags = await Tag.find({  });
        if (!tags || tags.length === 0) {
            return NextResponse.json({
                message: 'No tags found for this snippet',
                status: 404
            });
        }

        console.log('Tags found:', tags);
        return NextResponse.json({
            tags: tags,
            message: 'Tags fetched successfully',
            status: 200
        });
    } catch (error) {
        return NextResponse.json({
            error: 'Error fetching snippets by tag',
            details: error.message,
            status: 500
        });
    }
}