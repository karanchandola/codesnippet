import { NextResponse } from 'next/server';
import { Comment } from '@/models/comment';
import connection from '@/lib/dbconnect';
import { Snippet } from '@/models/snippets';
import { user as UserModel } from '@/models/user';

export async function POST(req, context) {
  await connection();
  try {
    const { id: snippetId } = await context.params;
    const { userId, comment } = await req.json();

    // Validate input
    if (!snippetId || !userId || !comment) {
      return NextResponse.json({ error: 'Missing required fields', status: 400 });
    }

    // Get username for denormalization
    const userDoc = await UserModel.findById(userId);
    if (!userDoc) {
      return NextResponse.json({ error: 'User not found', status: 404 });
    }
    console.log('detail : ', snippetId, userId, comment, userDoc);
    // Create comment
    const newComment = await Comment.create({
      snippetId,
      userId,
      username: userDoc.username,
      authorRep : userDoc.reputation,
      comment,
    });

    console.log('New comment created:', newComment);
    // Add comment reference to snippet
    await Snippet.findByIdAndUpdate(
      snippetId,
      { $push: { comments: newComment._id } }
    );

    return NextResponse.json({ message: 'Comment added', comment: newComment, status: 201 });
  } catch (error) {
    console.log('Error in POST /api/db/[id]/comment:', error);
    return NextResponse.json({ error: 'Error adding comment', details: error.message, status: 500 });
  }
}

export async function DELETE(req, context) {
  await connection();
  try {
    const { id: snippetId } = await context.params;
    const { userId, commentId } = await req.json();

    // Remove comment document
    const result = await Comment.deleteOne({ _id: commentId, userId });
    // Remove comment reference from snippet
    await Snippet.findByIdAndUpdate(
      snippetId,
      { $pull: { comments: commentId } }
    );
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Comment not found or not authorized', status: 404 });
    }
    return NextResponse.json({ success: true, status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting comment', details: error.message, status: 500 });
  }
}
