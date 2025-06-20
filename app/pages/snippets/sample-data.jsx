export const sampleSnippets = [
  {
    _id: '1',
    title: 'React useEffect Hook Example',
    code: `useEffect(() => {
  // Effect code here
  return () => {
    // Cleanup code here
  };
}, [dependencies]);`,
    description: 'A simple example of using the useEffect hook in React with cleanup function.',
    tags: [
      { _id: '1', type: 'language', tag: 'javascript' },
      { _id: '2', type: 'framework', tag: 'react' },
      { _id: '3', type: 'topic', tag: 'hooks' }
    ],
    verified: true,
    aiGenerated: false,
    status: 'approved',
    votes: { up: 42, down: 3 },
    comments: Array(5).fill(null),
    authorId: { username: 'reactdev', reputation: 1250 }
  },
  {
    _id: '2',
    title: 'Python List Comprehension',
    code: `numbers = [1, 2, 3, 4, 5]
squares = [x**2 for x in numbers if x % 2 == 0]`,
    description: 'Example of list comprehension in Python to get squares of even numbers.',
    tags: [
      { _id: '4', type: 'language', tag: 'python' },
      { _id: '5', type: 'topic', tag: 'basics' }
    ],
    verified: true,
    aiGenerated: false,
    status: 'approved',
    votes: { up: 28, down: 2 },
    comments: Array(3).fill(null),
    authorId: { username: 'pythonista', reputation: 890 }
  },
  {
    _id: '3',
    title: 'Vue.js Component Template',
    code: `<template>
  <div>
    <h1>{{ title }}</h1>
    <slot></slot>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: 'Hello Vue!'
    }
  }
}
</script>`,
    description: 'Basic Vue.js component structure with slots.',
    tags: [
      { _id: '6', type: 'language', tag: 'javascript' },
      { _id: '7', type: 'framework', tag: 'vue' },
      { _id: '8', type: 'topic', tag: 'components' }
    ],
    verified: false,
    aiGenerated: true,
    status: 'pending',
    votes: { up: 15, down: 1 },
    comments: Array(2).fill(null),
    authorId: { username: 'vuecoder', reputation: 456 }
  }
];
