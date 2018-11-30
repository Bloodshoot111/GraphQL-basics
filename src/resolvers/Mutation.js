import uuidv4 from "uuid/v4";

const Mutation = {
    createUser(parent, args, {db}, info) {
        const emailTaken = db.users.some((user) => {
            return user.email === args.data.email
        });
        if(emailTaken) {
            throw new Error('Email taken.')
        }
        const user = {
            id: uuidv4(),
            ...args.data
        };

        db.users.push(user);
        return user
    },
    deleteUser(parent, args, {db}, info) {
        const userIndex = db.users.findIndex((user) => {
            return user.id === args.id
        });
        if(userIndex === -1) {
            throw new Error('User does not exist')
        }

        const deleted = db.users.splice(userIndex, 1);

        db.posts = db.posts.filter((post) => {
            const match = post.author === args.id;

            if(match) {
                db.comments = db.comments.filter((comment) => {
                    return comment.post !== post.id
                });
            }

            return !match
        });
        db.comments = db.comments.filter((comment) => {
            return comment.author !== args.id;
        });

        return deleted[0]
    },
    createPost(parent, args, {db}, info) {
        const authorExists = db.users.some((user) => {
            return user.id === args.data.author
        });

        if(!authorExists) {
            throw new Error('author does not exist.')
        }
        const post = {
            id: uuidv4(),
            ...args.data
        };

        db.posts.push(post);
        return post
    },
    deletePost(parent, args, {db}, info) {
        const postIndex = db.posts.findIndex((post) => {
            return post.id === args.id
        });

        if(postIndex === -1) {
            throw new Error('Post does not exist')
        }

        const deleted = db.posts.splice(postIndex, 1);

        db.comments = db.comments.filter((comment) => {
            return comment.post !== args.id;
        });

        return deleted[0]
    },
    createComment(parent, args, {db}, info) {
        const authorExists = db.users.some((user) => {
            return user.id === args.data.author
        });

        const postExists = db.posts.some((post) => {
            return post.id === args.data.post && post.published === true
        });

        if(!authorExists || !postExists) {
            throw new Error('author or post does not exist, or is not published yet')
        }


        const comment = {
            id: uuidv4(),
            ...args.data
        };

        db.comments.push(comment);
        return comment
    },
    deleteComment(parent, args, {db}, info) {
        const commentIndex =  db.comments.findIndex((comment) => {
            return comment.id === args.id
        });

        if(commentIndex === -1) {
            throw new Error("Comment does not exist")
        }

        const deleted = db.comments.splice(commentIndex, 1);

        return deleted[0]

    }
};

export{Mutation as default}