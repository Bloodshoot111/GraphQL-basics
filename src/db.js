const users = [{
    id: '1',
    name: 'Rupert',
    email: 'rupert@example.tk',
    age: 56
}, {
    id: '2',
    name: 'Theobalt',
    email: 'theobalt@google.de',
    age: 33
}, {
    id: '3',
    name: 'Roland',
    email: 'Roland.rolf@otto'
}];


const posts = [{
    id: '1',
    title: 'A Short Story',
    body: 'This is a Short Story',
    published: true,
    author: '1'
}, {
    id: '2',
    title: 'Halleluja',
    body: 'HAAALLEEEx',
    published: false,
    author: '1'
}, {
    id: '3',
    title: 'The Titlex',
    body: 'xyz',
    published: true,
    author: '2'
}, {
    id: '4',
    title: 'This is it!',
    body: 'Yes, it is',
    published: false,
    author: '3'
}];

const comments = [{
    id: '1',
    text: 'Sounds good',
    author: '1',
    post: '1'
},{
    id: '2',
    text: "Sounds perfect",
    author: '2',
    post: '2'
}, {
    id: '3',
    text: 'Thats weird',
    author: '2',
    post: '3'
}, {
    id: '4',
    text: 'Alright',
    author: '3',
    post: '4'
}, {
    id: '5',
    text: 'When you say that',
    author: '1',
    post: '1'
}, {
    id: '6',
    text: 'Seems like a Plan',
    author: '2',
    post: '4'
}];

const db = {
    users,
    posts,
    comments
};

export{db as default}