import { NextResponse } from 'next/server';
import { Vote } from '@/models/voting';
import connection from '@/lib/dbconnect';
import { Snippet } from '@/models/snippets';
import { user as UserModel } from '@/models/user';

export async function POST(req, context) {
  try {
    await connection();
    const { id: snippetId } = await context.params;
    const { userId, voteType } = await req.json();

    // Check if user already voted
    const existing = await Vote.findOne({ snippetId, userId });

    let reputationChange = 0;
    let snippet = null;

    if (!existing) {
      // New vote
      await Vote.create({ snippetId, userId, voteType });
      if (voteType === 'up') reputationChange = 2;
      if (voteType === 'down') reputationChange = -2;
    } else if (existing.voteType !== voteType) {
      // Changing vote type
      if (existing.voteType === 'up' && voteType === 'down') reputationChange = -2;
      if (existing.voteType === 'down' && voteType === 'up') reputationChange = 2;
      existing.voteType = voteType;
      await existing.save();
    }
    // else: already voted same type, do nothing

    // Update reputation if needed
    snippet = await Snippet.findById(snippetId);
    if (snippet && snippet.authorId && reputationChange !== 0) {
      await UserModel.findByIdAndUpdate(
        snippet.authorId,
        { $inc: { reputation: reputationChange } }
      );
    }

    const upCount = await Vote.countDocuments({ snippetId, voteType: 'up' });
    const downCount = await Vote.countDocuments({ snippetId, voteType: 'down' });

    await Snippet.findByIdAndUpdate(
      snippetId,
      { votes: { up: upCount, down: downCount } }
    );

    // Get the updated author reputation
    let author = null;
    if (snippet && snippet.authorId) {
      author = await UserModel.findById(snippet.authorId);
    }

    // Find the user's current vote after the operation
    const userVoteDoc = await Vote.findOne({ snippetId, userId });
    const userVote = userVoteDoc ? userVoteDoc.voteType : null;

    return NextResponse.json({
      message: 'Vote recorded successfully',
      votes: { up: upCount, down: downCount },
      reputation: author ? author.reputation : undefined,
      userId: author ? author._id : null,
      userVote // <-- add this line
    }, { status: 200 });
  } catch (error) {
    console.error('Error in POST /api/db/[id]/vote:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req, context) {
  try {
    await connection();
    const { id: snippetId } = await context.params;
    const { userId } = await req.json();

    // Find the existing vote before deleting
    const existing = await Vote.findOne({ snippetId, userId });

    // Remove user's vote
    await Vote.deleteOne({ snippetId, userId });

    // Adjust reputation based on vote type
    let reputationChange = 0;
    if (existing && existing.voteType === 'up') reputationChange = -2;
    if (existing && existing.voteType === 'down') reputationChange = 2;

    const snippet = await Snippet.findById(snippetId);
    if (snippet && snippet.authorId && reputationChange !== 0) {
      await UserModel.findByIdAndUpdate(
        snippet.authorId,
        { $inc: { reputation: reputationChange } }
      );
    }

    // After deleting the vote, update counts
    const upCount = await Vote.countDocuments({ snippetId, voteType: 'up' });
    const downCount = await Vote.countDocuments({ snippetId, voteType: 'down' });

    await Snippet.findByIdAndUpdate(
      snippetId,
      { votes: { up: upCount, down: downCount } }
    );

    // Get the updated author reputation
    let author = null;
    if (snippet && snippet.authorId) {
      author = await UserModel.findById(snippet.authorId);
    }

    // After delete, userVote is always null
    return NextResponse.json({
      message: 'Vote removed successfully',
      votes: { up: upCount, down: downCount },
      reputation: author ? author.reputation : undefined,
      userVote: null // <-- add this line
    }, { status: 200 });
  } catch (error) {
    console.error('Error in DELETE /api/db/[id]/vote:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}