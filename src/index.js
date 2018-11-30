import{
    GraphQLServer
} from "graphql-yoga";

import uuidv4 from 'uuid/v4'

// String, Boolean, Int, Float, ID
//Demo user data
let users = [{
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


let posts = [{
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

let comments = [{
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
        
        type Mutation {
           createUser(data: CreateUserInput): User!
           deleteUser(id: ID!): User!
           createPost(data: CreatePostInput): Post!
           deletePost(id: ID!): Post!
           createComment(data: CreateCommentInput): Comment!
           deleteComment(id: ID!): Comment!
        }
        
        input CreateUserInput {
            name: String!,
            email: String!,
            age: Int
        }
        
        input CreatePostInput {
            title: String!
            body: String!,
            published: Boolean!,
            author: ID!
        }
        
        input CreateCommentInput {
            text: String!,
            author: ID!,
            post: ID!
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
        Mutation: {
            createUser(parent, args, ctx, info) {
                const emailTaken = users.some((user) => {
                    return user.email === args.data.email
                });
                if(emailTaken) {
                    throw new Error('Email taken.')
                }
                const user = {
                    id: uuidv4(),
                    ...args.data
                };

                users.push(user);
                return user
            },
            deleteUser(parent, args, ctx, info) {
                const userIndex = users.findIndex((user) => {
                    return user.id === args.id
                });
                if(userIndex === -1) {
                    throw new Error('User does not exist')
                }

                const deleted = users.splice(userIndex, 1);

                posts = posts.filter((post) => {
                        const match = post.author === args.id;

                        if(match) {
                            comments = comments.filter((comment) => {
                                return comment.post !== post.id
                            });
                        }

                        return !match
                });
                comments = comments.filter((comment) => {
                    return comment.author !== args.id;
                });

                return deleted[0]
            },
            createPost(parent, args, ctx, info) {
                const authorExists = users.some((user) => {
                    return user.id === args.data.author
                });

                if(!authorExists) {
                    throw new Error('author does not exist.')
                }
                const post = {
                    id: uuidv4(),
                    ...args.data
                };

                posts.push(post);
                return post
            },
            deletePost(parent, args, ctx, info) {
              const postIndex = posts.findIndex((post) => {
                  return post.id === args.id
              });

              if(postIndex === -1) {
                  throw new Error('Post does not exist')
              }

              const deleted = posts.splice(postIndex, 1);

                comments = comments.filter((comment) => {
                    return comment.post !== args.id;
                });

              return deleted[0]
            },
            createComment(parent, args, ctx, info) {
                const authorExists = users.some((user) => {
                    return user.id === args.data.author
                });

                const postExists = posts.some((post) => {
                    return post.id === args.data.post && post.published === true
                });

                if(!authorExists || !postExists) {
                    throw new Error('author or post does not exist, or is not published yet')
                }


                const comment = {
                    id: uuidv4(),
                    ...args.data
                };

                comments.push(comment);
                return comment
            },
            deleteComment(parent, args, ctx, info) {
                const commentIndex =  comments.findIndex((comment) => {
                    return comment.id === args.id
                });

                if(commentIndex === -1) {
                    throw new Error("Comment does not exist")
                }

                const deleted = comments.splice(commentIndex, 1);

                return deleted[0]

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