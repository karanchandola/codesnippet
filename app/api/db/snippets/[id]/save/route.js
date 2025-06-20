import connection from "@/lib/dbconnect";
import { user } from "@/models/user";
import { NextResponse } from "next/server";

export async function POST(req, context) {
    try {
        await connection();
        const { id: snippetId } = await context.params;
        const { userId } = await req.json();

        console.log('Received snippetId:', snippetId);
        console.log('Received userId:', userId);
        if (!snippetId || !userId) {
            return NextResponse.json({ error: 'Snippet ID and User ID are required', status: 400 });
        }

        // Find the user by ID
        const User = await user.findByIdAndUpdate(
            userId,
            { $addToSet: { favorites: snippetId } }, // Use $addToSet to avoid duplicates
            { new: true } // Return the updated user document
        );
        
        if (!User) {
            return NextResponse.json({ error: 'User not found', status: 404 });
        }

        console.log('User updated successfully:', User);  
        return NextResponse.json({
            message: 'Snippet saved successfully',
            success: true,
            user: User,
            status: 200
        })

    } catch (error) {
        console.log('Error in POST /api/db/[id]/save:', error);
        return NextResponse.json({ error: 'Error saving snippet', details: error.message, status: 500 });
    }
}

export async function DELETE(req, context) {
    try {
        await connection();
        const { id: snippetId } = await context.params;
        const { userId } = await req.json();

        console.log('Received snippetId:', snippetId);
        console.log('Received userId:', userId);
        if (!snippetId || !userId) {
            return NextResponse.json({ error: 'Snippet ID and User ID are required', status: 400 });
        }

        // Find the user by ID
       const User = await user.findByIdAndUpdate(
            userId,
            { $pull: { favorites: snippetId } }, // Use $pull to remove the snippet from favorites
            { new: true } // Return the updated user document
        );
        
        if (!User) {
            return NextResponse.json({ error: 'User not found', status: 404 });
        }

        return NextResponse.json({
            message: 'Snippet removed successfully',
            success: true,
            user: User,
            status: 200
        })

    } catch (error) {
        console.log('Error in POST /api/db/[id]/save:', error);
        return NextResponse.json({ error: 'Error removing snippet', details: error.message, status: 500 });
    }
}