import { useState } from "react"
// import blogService from '../services/blogs';

const blogStyle = {
  padding: "0.4em 0.4em",
  border: "solid",
  borderRadius: "4px",
  borderWidth: 1,
  marginBottom: 5,
}

const Blog = ({ blog, handleUpdateBlog, deleteBlog, currentUser }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const toggleExpanded = () => {
    setIsExpanded((is) => !is)
  }

  const { title, author, url, likes, user } = blog

  if (!isExpanded) {
    return (
      <div>
        {title} - {author} <button onClick={toggleExpanded}>show</button>
      </div>
    )
  } else {
    return (
      <div style={blogStyle}>
        <p>
          {`${title} - ${author} `}
          <button onClick={toggleExpanded}>hide</button>
        </p>

        <p>{url}</p>
        <p>
          likes {likes}
          <button
            onClick={(e) => handleUpdateBlog(e, blog, { likes: likes + 1 })}
          >
            like
          </button>
        </p>
        <p>
          <em>{user.username}</em>
        </p>
        {user.id === currentUser.id && (
          <button onClick={() => deleteBlog(blog)}>delete</button>
        )}
      </div>
    )
  }
}

export default Blog
