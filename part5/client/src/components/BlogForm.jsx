import { useState } from "react"
// import blogService from "../services/blogs"
import FormField from "./FormField"

const BlogForm = ({ onCreateBlog }) => {
  const [formdata, setFormData] = useState({
    title: "",
    author: "",
    url: "",
  })

  const { title, author, url } = formdata

  const handleFieldInput = (e) => {
    setFormData((fd) => ({
      ...fd,
      [e.target.name]: e.target.value,
    }))
  }

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const res = await blogService.postBlog({ title, author, url });
  //     onBlogC
  //   } catch (err) {
  //     console.error(err.response.data.error);
  //   }
  // };

  return (
    <form onSubmit={(e) => onCreateBlog(e, { title, author, url })}>
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
