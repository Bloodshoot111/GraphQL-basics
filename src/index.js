import{
    GraphQLServer
} from "graphql-yoga";

// String, Boolean, Int, Float, ID
//Demo user data
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
//Type definitions (Schema)
    const typeDefs = `
    type Query {
        users(query: String): [User!]!
        me: User!
        post: Post!
        posts(query: String): [Post!]!
        comments: [Comment!]!
        }
        
        type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]!
        comments: [Comment!]!
        }
        type Post {
        id : ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
        comments: [Comment!]!
        }
        type Comment {
        id: ID!
        text: String!
        author: User!
        post: Post!
        }
    `;

//Resolvers

    const resolvers = {
        Query: {
            me() {
                return {
                    id: '123098',
                    name: 'Wolfgang',
                    email: 'test@test.test',

                }
            },
            post() {
                return {
                    id: '1234123AV',
                    title: 'Answer',
                    body: 'This is an Post',
                    published: true
                }
            },
            users(parent, args, ctx, info) {
                if(!args.query) {
                    return users;
                }

                return users.filter((user) => {
                    return user.name.toLowerCase().includes(args.query.toLowerCase());
                });
            },
            posts(parent, args, ctx, info) {
                if(!args.query) {
                    return posts;
                }

                return posts.filter((post) => {
                    return post.title.toLowerCase().includes(args.query.toLowerCase()) || post.body.toLowerCase().includes(args.query.toLowerCase())
                });
            },
            comments(parent, args, ctx, info) {
                return comments
            }
        },
        Post:{
            author(parent, args, ctx, info) {
                return users.find((user) => {
                    return user.id === parent.author
                });
            },
            comments(parent, args, cty, info) {
                return comments.filter((comment) => {
                    return comment.post === parent.id
                });
            }
        },
        User:{
            posts(parent, args, ctx, info) {
                return posts.filter((post) => {
                    return post.author === parent.id
                });
            },
            comments(parent,args, ctx, info) {
                return comments.filter((comment) => {
                    return comment.author === parent.id
                });
            }
        },
        Comment:{
            author(parent, args, ctx, info) {
                return users.find((user) => {
                    return user.id === parent.author
                });
            },
            post(parent, args, ctx, info) {
                return posts.find((post) => {
                    return post.id === parent.post
                });
            }
        }
    };

    const server = new GraphQLServer({
       typeDefs,
       resolvers
    });

    server.start(() => {
        console.log('The Server is started')
    }) ;