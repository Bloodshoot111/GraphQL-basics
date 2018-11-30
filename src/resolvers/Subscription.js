
const Subscription = {

    comment: {
        subscribe(parent, args, {db, pubsub}, info) {
            const post = db.posts.find((post) => post.id === args.postId && post.published === true)
            if(!post) {
                throw new Erro("Post not found")
            }

            return pubsub.asyncIterator(`comment for post ${args.postId}`)
        }
    }

};

export{Subscription as default}