"use client";
import { useState, useEffect } from "react";
import React from "react";
import { Highlight } from "prism-react-renderer";
// import { defaultProps } from "prism-react-renderer";

import { themes } from "prism-react-renderer";
import { CopyCheck, Copy, Bookmark } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { ThumbsUp, ThumbsDown, MessageSquare, CheckCircle, Bot, AlertTriangle, Trash2 } from "lucide-react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


// Tag badge component with different styles based on type
function TagBadge({ type, label }) {
  const variants = {
    language: "bg-blue-100 hover:bg-blue-200 text-blue-800",
    framework: "bg-green-100 hover:bg-green-200 text-green-800",
    topic: "bg-purple-100 hover:bg-purple-200 text-purple-800"
  };

  return (
    <Badge variant="outline" className={cn("cursor-pointer transition-colors", variants[type])}>
      {label}
    </Badge>
  );
}

function StatusBadge({ status }) {
  const variants = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    flagged: "bg-red-100 text-red-800",
    deleted: "bg-gray-100 text-gray-800"
  };

  return (
    <Badge variant="outline" className={cn(variants[status])}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}



function CommentSection({ comments, onAddComment, onDeleteComment, session }) {
  const [newComment, setNewComment] = useState('');

        console.log("comment : ",comments);
  const handleSubmit = () => {
    if (newComment.trim()) {
      onAddComment(newComment);
      setNewComment('');
    }
  };

  const handleDelete = (commentId) => {
    if (window.confirm("Delete this comment?")) {
      onDeleteComment(commentId);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2 relative">
        {comments.map((comment, index) => (

          <div key={comment._id || index} className="p-3 bg-muted rounded-lg flex justify-between items-start">
            <div className="flex-1/12">
              <p className="text-sm">{comment.comment}</p>
              <div className="text-xs text-muted-foreground mt-1 w-full flex justify-between">
                <div>
                  {comment.userId?.username || comment.username} | Rep: {comment.reputation ?? 0}
                </div>
                <div>{new Date(comment.createdAt).toLocaleDateString()}{" : "}
                  {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
              </div>
            </div>
            {session?.user?.id && comment.userId === session.user.id && (
              <button
                onClick={() => handleDelete(comment._id)}
                className="ml-2 text-red-500 hover:text-red-700 absolute top-2 right-2"
                title="Delete comment"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>
      <div className="space-y-2">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="min-h-[80px]"
        />
        <Button onClick={handleSubmit} size="sm">
          Add Comment
        </Button>
      </div>
    </div>
  );
}

function SnippetCard({ snippet, onVote, onComment, onDeleteComment }) {
  const [showComments, setShowComments] = useState(false);
  const [tags, setTags] = useState([]);
  const [savedSnippets, setSavedSnippets] = useState([]);
  const { data: session } = useSession();

  // use useffect to get user's saved snippets list 
  useEffect(() => {
    const fetchSavedSnippets = async () => {
      if (!session || !session.user || !session.user.id) return;
      try {
        const res = await axios.get(`/api/db/snippets/save`, {
          userId: session.user.id
        });
        console.log('snippet', res.data)
        setSavedSnippets(res.data.savedSnippets || []);
      } catch (error) {
        console.error('Error fetching saved snippets:', error);
      }
    };
    fetchSavedSnippets();
  }, [session]);
  useEffect(() => {
    const fetchSnippetTags = async () => {
      if (!snippet.tags || snippet.tags.length === 0) {
        setTags([]);
        return;
      }
      try {
        // If tags are IDs, join them for the query param
        // Example: /api/db/tags?ids=tagid1,tagid2,tagid3
        const tagIds = snippet.tags.join(",");
        const res = await axios.get(`/api/db/tags`, {
          params: { ids: tagIds }
        });

        setTags(res.data.tags || []);
      } catch (error) {
        console.error('Error fetching snippet tags:', error);
        setTags([]);
      }
    };
    fetchSnippetTags();
  }, [snippet.tags]);

  const handleVote = (type) => {
    onVote(snippet._id, type);
  };

  const handleAddComment = (text) => {
    onComment(snippet._id, text);
  };
  const handleDeleteComment = (commentId) => {
    onDeleteComment(commentId, snippet._id);
  }

  const toggleSave = async (snippet_id) => {
    if (!session || !session.user || !session.user.id) {
      console.error('User not authenticated');
      return;
    }
    if (!savedSnippets.includes(snippet_id)) {

      try {
        console.log('Saving snippet:', snippet_id, 'for user:', session.user.id);
        const res = await axios.post(`/api/db/snippets/${snippet_id}/save`, {
          userId: session.user.id
        });

        console.log('Save response:', res.data);

        if (res.data.success) {
          setSavedSnippets((prev) =>
            prev.includes(snippet_id)
              ? prev.filter((id) => id !== snippet_id)
              : [...prev, snippet_id]
          );
        } else {
          console.error('Failed to save snippet:', res.data.message);
        }
      } catch (error) {
        console.error('Error saving snippet:', error);
      }
    } else {
      // call to remove snippet from user list
      try {
        console.log('Removing snippet:', snippet_id, 'for user:', session.user.id);
        const res = await axios.delete(`/api/db/snippets/${snippet_id}/save`, {
          data: { userId: session.user.id }
        });

        console.log('Remove response:', res.data);

        if (res.data.success) {
          setSavedSnippets((prev) =>
            prev.filter((id) => id !== snippet_id)
          );
        } else {
          console.error('Failed to remove snippet:', res.data.message);
        }
      } catch (error) {
        console.error('Error removing snippet:', error);
      }
    }
  }
    // Copy to clipboard handler
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
      navigator.clipboard.writeText(snippet.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    };

    // Detect language for Prism
    const language =
      snippet.tags?.find((t) => t.type === "language")?.tag || "javascript";


    return (
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="text-xl">{snippet.title}</CardTitle>
              {snippet.verified && (
                <CheckCircle className="h-5 w-5 text-green-500" />
              )}
              {snippet.aiGenerated && (
                <Bot className="h-5 w-5 text-purple-500" />
              )}
              {snippet.status !== 'approved' && (
                <StatusBadge status={snippet.status} />
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="font-medium">{snippet.authorId?.username || 'Unknown'}</span>
              <Badge variant="secondary">Rep: {snippet.authorId?.reputation || 0}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-wrap gap-2">
            {tags?.map((tag) => (
              <TagBadge key={tag._id} type={tag.type} label={tag.tag} />
            ))}
          </div>
          <div className="relative group mb-4">
            <Highlight

              code={snippet.code}
              language={language}
              theme={themes.dracula}
            >
              {({ className, style, tokens, getLineProps, getTokenProps }) => (
                <pre
                  className={`${className} rounded-lg p-4 overflow-x-auto text-sm font-mono bg-[#282a36]`}
                  style={style}
                >
                  {tokens.map((line, i) => (
                    <div key={i} {...getLineProps({ line, key: i })}>
                      <span className="select-none opacity-40 pr-4">{i + 1}</span>
                      {line.map((token, key) => (
                        <span key={key} {...getTokenProps({ token, key })} />
                      ))}
                    </div>
                  ))}
                </pre>
              )}
            </Highlight>
            <button
              onClick={handleCopy}
              className="absolute top-2 right-2 bg-gray-800 text-white rounded px-2 py-1 opacity-80 hover:opacity-100 transition"
              title="Copy code"
            >
              {copied ? <CopyCheck className="inline w-4 h-4" /> : <Copy className="inline w-4 h-4" />}
            </button>
          </div>
          <p className="mb-4 text-muted-foreground">{snippet.description}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-green-600"
                onClick={() => handleVote('up')}
              >
                <ThumbsUp className="mr-1 h-4 w-4" />
                {snippet.votes?.up || 0}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-600"
                onClick={() => handleVote('down')}
              >
                <ThumbsDown className="mr-1 h-4 w-4" />
                {snippet.votes?.down || 0}
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MessageSquare className="mr-1 h-4 w-4" />
                    {snippet.comments?.length || 0} Comments
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Comments</DialogTitle>
                  </DialogHeader>
                  <CommentSection
                    comments={snippet.comments || []}
                    onAddComment={handleAddComment}
                    onDeleteComment={handleDeleteComment}
                    session={useSession().data}
                  />
                </DialogContent>
              </Dialog>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-xs text-muted-foreground">
                {new Date(snippet.createdAt).toLocaleDateString()}{" : "}
                {new Date(snippet.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div>
                <button
                  className={cn(
                    "text-muted-foreground flex items-center space-x-1 text-sm",
                    savedSnippets.includes(snippet.id || snippet._id) ? "text-primary" : "hover:text-primary"
                  )}
                  onClick={() => toggleSave(snippet.id || snippet._id)}
                >
                  <Bookmark className={cn(
                    "h-4 w-4",
                    savedSnippets.includes(snippet.id || snippet._id) ? "fill-current" : ""
                  )} />
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

export default function SnippetsList() {
  const { data: session } = useSession();
  const [sortBy, setSortBy] = useState("popular");
  const [savedSnippets, setSavedSnippets] = useState([]);
  const [filteredSnippets, setFilteredSnippets] = useState([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const [snippets, setSnippets] = useState([]);
  const [isDelete, setIsDelete] = useState(false);

  useEffect(() => {

    const fetchSnippets = async () => {
      setLoading(true);
      try {
        // Build query params for API
        const params = {};
        const tags = searchParams.get("tags");
        if (tags && tags.trim() !== "") {
          params.tags = tags; // tag IDs, comma-separated
        }
        // Optionally add search, verified, etc.
        const q = searchParams.get("q");
        if (q) params.q = q;
        const verified = searchParams.get("verified");
        if (verified) params.verified = verified;

        const res = await axios.get("/api/db/snippets", { params });
        let snippets = res.data.snippets || [];

        // Sort results
        snippets.sort((a, b) => {
          if (sortBy === "popular") {
            return ((b.votes?.up || 0) - (a.votes?.up || 0));
          } else if (sortBy === "recent") {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          } else if (sortBy === "discussed") {
            return ((b.comments?.length || 0) - (a.comments?.length || 0));
          }
          return 0;
        });

        setSnippets(snippets);
      } catch (err) {
        setFilteredSnippets([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSnippets();
  }, [searchParams, sortBy]);

  const toggleSave = async (id) => {
    setSavedSnippets(prev =>
      prev.includes(id)
        ? prev.filter(snippetId => snippetId !== id)
        : [...prev, id]
    );
  };


  // Voting handler
  const handleVote = async (snippetId, voteType) => {
    if (!session || !session.user || !session.user.id) {
      console.error('User not authenticated');
      return;
    }

    // Find the snippet and user's current vote
    const snippet = snippets.find(s => s._id === snippetId);
    const currentUserVote = snippet?.userVote || null;

    // If user clicks the same vote again, remove their vote (DELETE)
    if (currentUserVote === voteType) {
      try {
        const res = await axios.delete(`/api/db/snippets/${snippetId}/vote`, {
          data: { userId: session.user.id }
        });
        setIsDelete(true);
        const updatedVotes = res.data?.votes;
        const updatedReputation = res.data?.reputation;
        const updatedUserId = res.data?.userId;

        setSnippets(currentSnippets =>
          currentSnippets.map(snippet =>
            snippet._id === snippetId
              ? {
                ...snippet,
                votes: updatedVotes || snippet.votes,
                userVote: res.data?.userVote ?? (isDelete ? null : voteType),
                authorId: snippet.authorId
                  ? {
                    ...snippet.authorId,
                    reputation: updatedReputation ?? snippet.authorId.reputation
                  }
                  : snippet.authorId,
                comments: (snippet.comments || []).map(comment =>
                  comment.userId && comment.userId._id === updatedUserId
                    ? {
                      ...comment,
                      userId: {
                        ...comment.userId,
                        reputation: updatedReputation
                      }
                    }
                    : comment
                )
              }
              : snippet
          )
        );


      } catch (error) {
        console.error('Error removing vote:', error);
      }
      return;
    }

    // Otherwise, cast or change the vote (POST)
    try {
      const res = await axios.post(`/api/db/snippets/${snippetId}/vote`, {
        userId: session.user.id,
        voteType: voteType
      });
      setIsDelete(false);
      const updatedVotes = res.data?.votes;
      const updatedReputation = res.data?.reputation;
      const updatedUserId = res.data?.userId;


      setSnippets(currentSnippets =>
        currentSnippets.map(snippet =>
          snippet._id === snippetId
            ? {
              ...snippet,
              votes: updatedVotes || snippet.votes,
              userVote: res.data?.userVote ?? (isDelete ? null : voteType),
              authorId: snippet.authorId
                ? {
                  ...snippet.authorId,
                  reputation: updatedReputation ?? snippet.authorId.reputation
                }
                : snippet.authorId,
              comments: (snippet.comments || []).map(comment =>
                comment.userId && comment.userId._id === updatedUserId
                  ? {
                    ...comment,
                    userId: {
                      ...comment.userId,
                      reputation: updatedReputation
                    }
                  }
                  : comment
              )
            }
            : snippet
        )
      );


    } catch (error) {
      console.error('Error updating vote:', error);
    }
  };

  const handleComment = async (snippetId, newComment) => {
    if (!session || !session.user || !session.user.id) {
      console.error('User not authenticated');
      return;
    }
    try {

      const res = await axios.post(`/api/db/snippets/${snippetId}/comment`,
        {
          userId: session?.user?.id,
          comment: newComment

        });


      // Use the comment object returned from the backend

      console.log('Added comment:', res.data);
      
      const addedComment = res.data?.comment;
      if (!addedComment) return;


      setSnippets(currentSnippets =>
        currentSnippets.map(snippet => {
          if (snippet._id === snippetId) {
            return {
              ...snippet,
              comments: [...(snippet.comments || []), addedComment]
            };
          }
          return snippet;
        })
      );
    } catch (error) {
      console.error('Error updating comment:', error);
      // Optionally, you can handle the error by showing a notification or alert

    }
  };

  const handleDeleteComment = async (commentId, snippetId) => {
    if (!session || !session.user || !session.user.id) {
      console.error('User not authenticated');
      return;
    }
    try {
      // Call your API to delete the comment
      await axios.delete(`/api/db/snippets/${snippetId}/comment`, {
        data: {
          userId: session.user.id,
          commentId: commentId,
        }
      });

      // Remove the comment from local state
      setSnippets(currentSnippets =>
        currentSnippets.map(snippet =>
          snippet._id === snippetId
            ? {
              ...snippet,
              comments: (snippet.comments || []).filter(c => c._id !== commentId)
            }
            : snippet
        )
      );
    } catch (error) {
      console.error('Error deleting comment:', error);
      // Optionally show a notification or alert
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="space-y-4">
              <div className="h-4 w-1/4 bg-muted rounded" />
              <div className="h-6 w-3/4 bg-muted rounded" />
              <div className="h-4 w-2/3 bg-muted rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-4 w-full bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Showing <span className="font-medium">{snippets.length}</span> snippets
        </div>
        <div className="flex items-center space-x-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="discussed">Most Discussed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Tabs defaultValue="all" className="mb-8">
        <TabsContent value="all" className="space-y-4">
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading snippets...
            </div>
          ) : snippets.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No snippets found matching your criteria.
            </div>
          ) : (
            snippets.map((snippet) => (
              <SnippetCard
                key={snippet._id}
                snippet={snippet}
                onVote={handleVote}
                onComment={handleComment}
                onDeleteComment={handleDeleteComment}
                onSaveSnipped={toggleSave}
              />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
