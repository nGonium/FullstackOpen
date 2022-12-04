import React from "react"
import "@testing-library/jest-dom/extend-expect"
import { render } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import BlogForm from "./BlogForm"

describe("BlogForm - Component Test", () => {
  it("should call event handler when new blog is created", async () => {
    const handleCreateBlog = jest.fn()
    const { container } = render(<BlogForm onCreateBlog={handleCreateBlog} />)
    const user = userEvent.setup()
    await user.click(container.querySelector('button[type="submit"]'))
    expect(handleCreateBlog.mock.calls).toHaveLength(1)
    expect(test)
  })
})
