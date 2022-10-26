const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((prev, current) => prev + current.likes, 0) 
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null
  return blogs.reduce((prev, curr) => prev.likes < curr.likes ? curr : prev)
}

const mostBlogs = (blogs) => {
  
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
}