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
//Type definitions (Schema)
    const typeDefs = `
    type Query {
        users(query: String): [User!]!
        me: User!
        post: Post!
        posts(query: String): [Post!]!
        }
        
        type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        }
        type Post {
        id : ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
       
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
            }
        },
        Post:{
            author(parent, args, ctx, info) {
                return users.find((user) => {
                    return user.id === parent.author
                })
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