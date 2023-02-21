import { useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import { useParams } from 'react-router-dom'
import BlogsService from '../services/blogs'

const BlogView = ({ onLikeBlog, query }) => {
    const [comment, setComment] = useState('')
    const handleCommentChange = (e) => {
        setComment(e.target.value)
    }
    const { id } = useParams()
    const queryClient = useQueryClient()
    const addCommentMutation = useMutation(
        ({ id, comment }) => BlogsService.addComment(id, comment),
        {
            onSuccess: () => queryClient.invalidateQueries(),
        }
    )

    if (query.isLoading) return <div>Loading blog...</div>
    const blog = query.data.find((blog) => blog.id === id)
    const {
        title,
        url,
        likes,
        user: { username },
        comments,
    } = blog

    const handleAddComment = () => {
        addCommentMutation.mutate({ id, comment })
    }

    return (
        <>
            <h1>{title}</h1>
            <a href={url}>{url}</a>
            <p>
                {likes} likes
                <button onClick={() => onLikeBlog(id)}>like</button>
            </p>
            <p>added by {username}</p>
            <h2>comments</h2>
            <ul>
                {comments.map((c, idx) => (
                    <li key={`${idx}${c}`}>{c}</li>
                ))}
            </ul>
            <div>
                <input onChange={handleCommentChange} value={comment}></input>
                <button onClick={handleAddComment}>add comment</button>
            </div>
        </>
    )
}

export default BlogView
