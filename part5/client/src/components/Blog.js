import { useState } from "react"

const blogStyle = {
  padding: "0.4em 0.4em",
  border: "solid",
  borderRadius: "4px",
  borderWidth: 1,
  marginBottom: 5,
}

const Blog = ({ blog, updateBlog, deleteBlog, currentUser }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const toggleExpanded = () => {
    setIsExpanded((is) => !is)
  }

  const { title, author, url, likes, user } = blog

  if (!isExpanded) {
    return (
      <div data-testid="blog__container">
        <p>
          {title} - {author}{" "}
        </p>
        <button
          data-testid="blog__toggle-expanded-btn"
          onClick={toggleExpanded}
        >
          show
        </button>
      </div>
    )
  } else {
    return (
      <div data-testid="blog__container" style={blogStyle}>
        <p>
          {`${title} - ${author} `}
          <button
            data-testid="blog__toggle-expanded-btn"
            onClick={toggleExpanded}
          >
            hide
          </button>
        </p>

        <p>{url}</p>
        <p data-testid="blog__likes-display">
          likes {likes}
          <button
            data-testid="blog__like-btn"
            onClick={() => updateBlog(blog, { likes: likes + 1 })}
          >
            like
          </button>
        </p>
        <p>
          <em>{user.username}</em>
        </p>
        {user.id === currentUser.id && (
          <button
            data-testid="blog__delete-btn"
            onClick={() => deleteBlog(blog)}
          >
            delete
          </button>
        )}
      </div>
    )
  }
}

export default Blog
