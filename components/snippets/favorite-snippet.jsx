"use client";
import { useState, useEffect } from "react";
import React from "react";
import { Highlight } from "prism-react-renderer";

import { themes } from "prism-react-renderer";
import { CopyCheck, Copy, Bookmark } from "lucide-react";
import { CheckCircle, Bot } from "lucide-react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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


function SnippetCard({ snippet, onRemove }) {
    const [tags, setTags] = useState([]);
    const [savedSnippets, setSavedSnippets] = useState([]);
    const { data: session } = useSession();

    //   use useffect to get user's saved snippets list 

    useEffect(() => {
        setSavedSnippets(snippet || []);
    }, [snippet]);

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


    const toggleSave = async (snippet_id) => {
        if (!session?.user?.id) {
            console.error('User not authenticated');
            return;
        }

        try {
            const res = await axios.delete(`/api/db/snippets/${snippet_id}/save`, {
                data: { userId: session.user.id }
            });

            if (res.data.success) {
                onRemove(snippet_id); // Notify parent to remove it from UI
            } else {
                console.error('Failed to remove snippet:', res.data.message);
            }
        } catch (error) {
            console.error('Error removing snippet:', error);
        }
    };

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
                            <pre className={`${className} rounded-lg p-4 overflow-x-auto text-sm font-mono bg-[#282a36]`} style={style}>
                                {tokens.map((line, i) => {
                                    const { key: unusedKey, ...lineProps } = getLineProps({ line, key: i });
                                    return (
                                        <div key={i} {...lineProps}>
                                            <span className="select-none opacity-40 pr-4">{i + 1}</span>
                                            {line.map((token, key) => {
                                                const { key: unusedTokenKey, ...tokenProps } = getTokenProps({ token, key });
                                                return <span key={key} {...tokenProps} />;
                                            })}
                                        </div>
                                    );
                                })}
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
                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 gap-4 mb-4">
                    <div className="flex justify-end">
                        <div className="text-xs text-muted-foreground">
                            {new Date(snippet.createdAt).toLocaleDateString()}{" : "}
                            {new Date(snippet.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div>
                            <button
                                className={cn(
                                    "text-muted-foreground flex items-center space-x-1.5 px-1 text-sm hover:text-primary"
                                )}
                                onClick={() => toggleSave(snippet.id || snippet._id)}
                            >
                                <Bookmark className={cn(
                                    "h-4 w-4 fill-black",
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

    const [sortBy, setSortBy] = useState("popular");
    const [loading, setLoading] = useState(true);
    const searchParams = useSearchParams();
    const [snippets, setSnippets] = useState([]);


    useEffect(() => {

        const fetchSnippets = async () => {
            setLoading(true);
            try {

                const res = await axios.get("/api/db/snippets/save");
                if (!res.data || !res.data.savedSnippets) {
                    console.error('No saved snippets found');
                    setLoading(false);
                    return;
                }
                let snippets = res.data.savedSnippets || [];

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

    const handleSnippetRemove = (snippetId) => {
        setSnippets((prev) => prev.filter((snippet) => snippet._id !== snippetId));
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
                                onRemove={handleSnippetRemove}
                            />
                        ))
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}