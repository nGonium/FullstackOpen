/// <reference types="Cypress" />

describe("Blog app", function () {
  let user, blog, otherUserBlog
  beforeEach(function () {
    user = { username: "Tester", password: "MyPassword" }
    blog = {
      title: "Tester's New Blog",
      author: "John Doe",
      url: "www.example.com",
    }
    const tempUser = { username: "OtherUser", password: "password" }
    otherUserBlog = {
      title: "Can't Touch This",
      author: "Me Myself",
      url: "www.example.com",
      likes: 10,
    }
    cy.request("POST", "http://localhost:3003/api/testing/reset")
    cy.createUser(user)
    cy.login(user)
    cy.createBlog(blog)
    cy.logout()
    cy.createUser(tempUser)
    cy.login(tempUser)
    cy.createBlog(otherUserBlog)
    cy.createBlog({
      title: "Most Liked",
      author: "Me Myself",
      url: "www.example.com",
      likes: 20,
    })
    cy.logout()
    cy.visit("http://localhost:3000")
  })

  it("Login form is shown", function () {
    cy.get('[data-testid="form-login"]')
  })

  describe("Login", function () {
    it("Succeeds with correct credentials", function () {
      cy.get('input[name="username"]').click().type(user.username)
      cy.get('input[name="password"').click().type(user.password)
      cy.tid("form-login").get('[type="submit"]').click()
      cy.contains("logout")
    })

    it("Fails with incorrect credentials", function () {
      cy.get('input[name="username"]').click().type(user.username)
      cy.get('input[name="password"').click().type("notthepassword")
      cy.tid("form-login").get('[type="submit"]').click()
      cy.tid("request-notification").should(
        "have.css",
        "border-color",
        "rgb(255, 0, 0)"
      )
    })
  })

  describe("When logged in", function () {
    beforeEach(function () {
      cy.login(user)
    })

    it("A blog can be created", function () {
      const blog = {
        title: "A blog title",
        author: "John Doe",
        url: "abc.x.com",
      }
      cy.tid("toggle-blogform-btn").click()
      cy.get('input[name="title"]').click().type(blog.title)
      cy.get('input[name="author"]').click().type(blog.author)
      cy.get('input[name="url"]').click().type(blog.url)
      cy.get('[type="submit"]').click()
      cy.tid("bloglist").contains(blog.title)
    })

    it("A blog can be expanded and liked", function () {
      cy.contains('[data-testid="blog__container"]', blog.title).as("blog")
      cy.get("@blog").find('[data-testid="blog__toggle-expanded-btn"]').click()
      cy.get("@blog").find('[data-testid="blog__like-btn"]').click()
      cy.get("@blog").find('[data-testid="blog__likes-display"]').contains("1")
    })

    it("Can delete own blog", function () {
      cy.contains('[data-testid="blog__container"]', blog.title).as("blog")
      cy.get("@blog").find('[data-testid="blog__toggle-expanded-btn"]').click()
      cy.get("@blog").find('[data-testid="blog__delete-btn"]').click()
      cy.tid("bloglist").should("not.include.text", blog.title)
    })

    it("Cannot delete non-owned blog", function () {
      cy.contains('[data-testid="blog__container"]', otherUserBlog.title).as(
        "blog"
      )
      cy.get("@blog").find('[data-testid="blog__toggle-expanded-btn"]').click()
      cy.get("@blog")
        .find('[data-testid="blog__delete-btn"]')
        .should("not.exist")
    })

    it("Sorts blogs by number of likes", function () {
      cy.tid("blog__container").eq(0).should("contain", "Most Liked")
      cy.tid("blog__container").eq(1).should("contain", otherUserBlog.title)
      cy.tid("blog__container").eq(2).should("contain", blog.title)
    })
  })
})
