import React from "react"
import "@testing-library/jest-dom/extend-expect"
import { render } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import BlogForm from "./BlogForm"

const typeFields = async (user, form, data) => {
  for (let field in data) {
    await user.type(form.querySelector(`input[name="${field}"]`), data[field])
  }
}

describe("BlogForm - Component Test", () => {
  it("should call createBlog with form data when new blog is created", async () => {
    const testData = {
      author: "Test Author",
      title: "Hello World",
      url: "wwwexom",
    }
    const createBlog = jest.fn()
    const { container } = render(<BlogForm createBlog={createBlog} />)
    const user = userEvent.setup()
    await typeFields(user, container, testData)
    await user.click(container.querySelector('button[type="submit"]'))
    expect(createBlog.mock.calls[0][0]).toEqual(
      expect.objectContaining(testData)
    )
  })
})
