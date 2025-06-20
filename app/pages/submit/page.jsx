// 'use client';
// import axios from 'axios';
// import { useSession } from 'next-auth/react';
// import React, { useState, useEffect } from 'react';

// const initialState = {
//   title: '',
//   language: '',
//   framework: '',
//   code: '',
//   description: '',
//   tags: '',
//   authorId: '', // Should be set from user context/session in real app
//   // aiGenerated removed
// };

// function SnippetForm() {
//   const { data: session, status } = useSession();
//   const [form, setForm] = useState(initialState);
//   const [message, setMessage] = useState('');

//   // Set authorId when session is available
//   useEffect(() => {
//     if (session && session.user && session.user.id) {
//       setForm((prev) => ({
//         ...prev,
//         authorId: session.user.id,
//       }));
//     }
//   }, [session]);

//   if(!session){
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <h1 className="text-2xl font-bold">Please sign in to submit snippets</h1>
//       </div>
//     );
//   }
//   if (status === 'loading'){
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <h1 className="text-2xl font-bold">Loading...</h1>
//       </div>
//     );
//   }

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm({
//       ...form,
//       [name]: value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     // Convert tags to array
//     const payload = {
//       ...form,
//       tags: form.tags.split(',').map(tag => tag.trim()).filter(Boolean),
//     };
//     try {
//       console.log('Submitting snippet:', payload);
//       const res = await axios.post('/api/db/snippets', 
//         payload
//       , {
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       }
//       );
//       // console.log(res);  
//       if (res.data.status === 201) {
        
//         setMessage('Snippet saved!');
//         setForm(initialState);
//       } else {
//         setMessage('Error saving snippet.');
//       }
//     } catch (err) {
//       setMessage('Network error.');
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className='flex flex-col gap-4 p-4  rounded shadow-md w-full max-w-2xl mx-auto border-2 border-gray-200'>
//       <input name="title" value={form.title} onChange={handleChange} placeholder="Title" required />
//       <input name="language" value={form.language} onChange={handleChange} placeholder="Language" required />
//       <input name="framework" value={form.framework} onChange={handleChange} placeholder="Framework (e.g. React)" />
//       <textarea name="code" value={form.code} onChange={handleChange} 
//         placeholder="Paste your code snippet here..." required />
//       <textarea name="description" value={form.description} onChange={handleChange} placeholder="Describe what the code does..." required />
//       <input name="tags" value={form.tags} onChange={handleChange} placeholder="Add tags (e.g. Firebase, React, Authentication)" />
//       {/* AI Generated checkbox removed */}
//       <button type="submit">Save Snippet</button>
//       {message && <div>{message}</div>}
//     </form>
//   );
// }

// export default SnippetForm;




import { SnippetForm } from '@/components/snippet-form/snippet-form'
import React from 'react'

const submit = () => {
  return (
    <div>
      <SnippetForm />
    </div>
  )
}

export default submit
