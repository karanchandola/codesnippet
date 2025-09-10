import connection from "@/lib/dbconnect";
import { Snippet } from '@/models/snippets';
import { Tag } from '@/models/tag';
import { User } from '@/models/user';
import { Comment } from '@/models/comment';
import { NextResponse } from 'next/server';

export async function POST(req) {
  await connection(); 
  try {
    const body = await req.json();

    console.log(body);
    const { tags: tagNames, ...snippetData } = body;
    // Process each tag
    const tagIds = await Promise.all(
      tagNames.map(async (tagName) => {
        const tagLower = tagName.trim().toLowerCase();
        let type = 'topic';
        if (knownLanguages.includes(tagLower)) type = 'language';
        else if (knownFrameworks.includes(tagLower)) type = 'framework';

        let tagDoc = await Tag.findOne({ tag: tagLower });
        if (!tagDoc) {
          tagDoc = await Tag.create({ tag: tagLower, type });
        }
        return tagDoc._id;
      })
    );

    if (snippetData.framework === 'None' || snippetData.framework === 'null' || snippetData.framework === 'undefined') {
      snippetData.framework = '';
    }
    // Save snippet with tag ObjectIds
    const snippet = await Snippet.create({
      ...snippetData,
      tags: tagIds,
    });

    if(snippet){
       return NextResponse.json({
      message: 'Snippet created successfully',
      snippet: snippet,
      status: 201
    });
    }
    else{
      throw new Error("Snippet Creation failed");
    }
  } catch (error) {
    return NextResponse.json({
      error: 'Error creating snippet',
      details: error.message,
      status: 500
    });
  }
}



export async function GET(req) {
  await connection();
  try {
    const { searchParams } = new URL(req.url);

    // Build filter object
    const filter = {};

    // Filter by tags (multiple tag IDs)
    if (searchParams.get('tags')) {
      // Split comma-separated tag IDs and filter snippets that have ANY of these tags
      const tagIds = searchParams.get('tags').split(',').map(id => id.trim()).filter(Boolean);
      filter.tags = { $in: tagIds };
    }

    // Optionally filter by verified
    if (searchParams.get('verified')) {
      filter.verified = searchParams.get('verified') === 'true';
    }

    // Optionally filter by search query (q)
    if (searchParams.get('q')) {
      const query = searchParams.get('q').trim();
      if (query) {
        // Use regex for case-insensitive search in title, description, and code
        filter.$or = [
          { language: { $regex: query, $options: 'i' } },
          { framework: { $regex: query, $options: 'i' } },
          { title: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
          { code: { $regex: query, $options: 'i' } }
        ];
      }
    }

    

    // Fetch snippets with filters, and populate tags and author
    const snippets = await Snippet.find(filter)
      .populate('tags')
      .populate('authorId')
      .populate({
        path: 'comments',
        populate: {
          path: 'userId',
          select: 'username reputation'
        }
      })
      .sort({ createdAt: -1 });
      
    return NextResponse.json({ snippets: snippets, status: 200 });
  } catch (error) {
    return NextResponse.json({
      error: 'Error fetching snippets',
      details: error.message,
      status: 500
    });
  }
}
