import React from "react"
import "@testing-library/jest-dom/extend-expect"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import Blog from "./Blog"

// mocks
const blog = {
  title: "this blog",
  author: "XYZ",
  url: "ex.com",
  likes: 3,
  user: { username: "testuser", id: "testuser_id" },
}

describe("Blog - Component Test", () => {
  it("should show title and author by default", () => {
    render(
      <Blog
        blog={blog}
        currentUser={jest.fn()}
        handleUpdateBlog={jest.fn()}
        deleteBlog={jest.fn()}
      />
    )
    screen.getByText(blog.title, { exact: false })
    screen.getByText(blog.author, { exact: false })
  })
  it("should not show url and likes by default", () => {
    render(
      <Blog
        blog={blog}
        currentUser={jest.fn()}
        handleUpdateBlog={jest.fn()}
        deleteBlog={jest.fn()}
      />
    )
    expect(screen.queryByText(blog.url, { exact: false })).toBeNull()
    expect(screen.queryByText(blog.likes, { exact: false })).toBeNull()
  })
  it("should show url and likes when toggle expanded button is clicked once", async () => {
    render(
      <Blog
        blog={blog}
        currentUser={{ token: "abc", username: "user" }}
        handleUpdateBlog={jest.fn()}
        deleteBlog={jest.fn()}
      />
    )
    const button = screen.getByTestId("btn-toggleExpanded")
    const user = userEvent.setup()
    await user.click(button)
    screen.findByText(blog.url, { exact: false })
    screen.findByText(blog.likes, { exact: false })
  })
  it("should should call handler twice if like button is pressed twice", async () => {
    const handleUpdateBlog = jest.fn()
    render(
      <Blog
        blog={blog}
        currentUser={{}}
        handleUpdateBlog={handleUpdateBlog}
        deleteBlog={jest.fn()}
      />
    )
    const button = screen.getByTestId("btn-toggleExpanded")
    const user = userEvent.setup()
    await user.click(button)
    const likeBtn = screen.getByTestId("btn-like")
    await user.click(likeBtn)
    await user.click(likeBtn)
    expect(handleUpdateBlog.mock.calls).toHaveLength(2)
  })
})
