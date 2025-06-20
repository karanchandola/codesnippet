
import { Snippet } from "@/models/snippets";
import connection from "@/lib/dbconnect";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { user } from "@/models/user";

export async function GET(){
    try {
        await connection();

        const session = await getServerSession(authOptions);

         if (!session || !session.user || !session.user.id) {
             return NextResponse.json({ error: "Unauthorized", status: 401 });
         }
 
         const userId = session.user.id; // Get the user ID from the session
        // Fetch saved snippets for the user
        const savedSnippets = await user.findById(userId)
            .populate({
                path: 'favorites',
                model: 'Snippet'
            });

        console.log('Saved Snippets:', savedSnippets.favorites);

        if(!savedSnippets) {
            return NextResponse.json({ error: 'No saved snippets found', status: 404 });
        }

            return NextResponse.json({ savedSnippets: savedSnippets.favorites, status: 200 });


        
    } catch (error) {
        console.error('Error in GET /api/db/snippets/save:', error);
        return NextResponse.json({ error: 'Error fetching saved snippets', details: error.message, status: 500 });
        
    }
}