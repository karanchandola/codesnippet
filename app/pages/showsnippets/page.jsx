// 'use client';
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// // Badge component for tags
// function TagBadge({ type, label }) {
//     const colors = {
//         language: 'bg-blue-100 text-blue-800',
//         framework: 'bg-green-100 text-green-800',
//         topic: 'bg-gray-100 text-gray-800',
//     };
//     return (
//         <span className={`px-2 py-1 rounded text-xs font-semibold mr-2 ${colors[type] || colors.topic}`}>
//             {label}
//         </span>
//     );
// }

// function SnippetCard({ snippet }) {
//     return (
//         <div className="border rounded-lg p-4 mb-4 shadow-sm ">
//             <div className="flex items-center mb-2">
//                 <h2 className="text-lg font-bold mr-2">{snippet.title}</h2>
//                 {snippet.verified && (
//                     <span title="Verified" className="ml-1 text-green-600">✔️</span>
//                 )}
//                 {snippet.aiGenerated && (
//                     <span title="AI Generated" className="ml-1 text-purple-500">🤖</span>
//                 )}
//                 {snippet.status !== 'approved' && (
//                     <span className="ml-2 px-2 py-0.5 rounded bg-yellow-100 text-yellow-800 text-xs">
//                         {snippet.status}
//                     </span>
//                 )}
//             </div>
//             <div className="mb-2 flex flex-wrap items-center gap-2">
//                 {snippet.tags && snippet.tags.map(tag =>
//                     <TagBadge key={tag._id} type={tag.type} label={tag.tag} />
//                 )}
//             </div>
//             <pre className="border-2 border-white rounded p-2 text-sm overflow-x-auto mb-2">{snippet.code}</pre>
//             <div className="mb-2 text-gray-700">{snippet.description}</div>
//             <div className="flex items-center justify-between text-sm">
//                 <div className="flex items-center gap-2">
//                     <button className="text-green-600 hover:underline" disabled>▲ {snippet.votes?.up || 0}</button>
//                     <button className="text-red-600 hover:underline" disabled>▼ {snippet.votes?.down || 0}</button>
//                     <span className="ml-4">💬 {snippet.comments?.length || 0} comments</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                     <span className="font-semibold">{snippet.authorId?.username || 'Unknown'}</span>
//                     <span className="text-xs text-gray-500">Rep: {snippet.authorId?.reputation || 0}</span>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default function ShowSnippetsPage() {
//     const [snippets, setSnippets] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [language, setLanguage] = useState(''); // Default language
//     const [framework, setFramework] = useState('');
//     const [verified, setVerified] = useState(false);
//     useEffect(() => {
//         async function fetchSnippets() {
//             setLoading(true);

//             let url = '/api/db/snippets';
//             const params = [];
//             if (language) params.push(`language=${encodeURIComponent(language)}`);
//             if (framework) params.push(`framework=${encodeURIComponent(framework)}`);
//             if (verified) params.push(`verified=true`);
//             if (params.length) url += '?' + params.join('&');

//             const res = await axios.get(url);
//             console.log('Fetched snippets:', res);
//             setSnippets(res.data.snippets || []);
//             setLoading(false);
//         }
//         fetchSnippets();
//     }, []);


//     const handleLanguageChange = (e) => {
//         setLanguage(e.target.value);
//         // Optionally, you can also reset the framework when the language changes
//         setFramework('');
//     };

//     const handleFrameworkChange = (e) => {
//         setFramework(e.target.value);
//     };

//     if (loading) {
//         return <div className="text-center py-10">Loading snippets...</div>;
//     }

//     if (!snippets.length) {
//         return <div className="text-center py-10">No snippets found.</div>;
//     }

//     return (
//         <div className="max-w-3xl mx-auto py-8">
//             <h1 className="text-2xl font-bold mb-6">Browse Snippets</h1>
//         // Example filter UI (simplified)
//             <div>
//                 <select onChange={handleLanguageChange} value={language}>
//                     <option value="">All Languages</option>
//                     <option value="javascript">JavaScript</option>
//                     <option value="python">Python</option>
//                     <option value="java">Java</option>
//                     <option value="c">C</option>
//                     <option value="c++">C++</option>
//                     {/* Add more languages as needed */}
//                 </select>

//                 <select onChange={handleFrameworkChange} value={framework}>
//                     <option value="">All Frameworks</option>
//                     <option value="react">React</option>
//                     <option value="angular">Angular</option>
//                     <option value="vue">Vue</option>
//                     <option value="django">Django</option>
//                     {/* Add more frameworks as needed */}
//                 </select>

//                 {/* You can add a button to apply filters or handle filtering logic here */}
//             </div>
//             <p className="mb-4 text-gray-600">Explore code snippets shared by the community. Click on a snippet to view details.</p>

//             {snippets.map(snippet => (
//                 <SnippetCard key={snippet._id} snippet={snippet} />
//             ))}
//         </div>
//     );
// }