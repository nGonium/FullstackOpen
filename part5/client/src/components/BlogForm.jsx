import { useState } from "react"
// import blogService from "../services/blogs"
import FormField from "./FormField"

const BlogForm = ({ createBlog }) => {
  const [formdata, setFormData] = useState({
    title: "",
    author: "",
    url: "",
  })

  const handleFieldInput = (e) => {
    setFormData((fd) => ({
      ...fd,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        createBlog(formdata)
      }}
    >
      <h3>Add Blog</h3>
      {Object.keys(formdata).map((field) => (
        <FormField
          key={field}
          name={field}
          value={formdata.value}
          onFieldInput={handleFieldInput}
        />
      ))}
      <button type="submit">create</button>
    </form>
  )
}

export default BlogForm
