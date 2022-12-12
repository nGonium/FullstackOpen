Cypress.Commands.add("login", (user) => {
  cy.request("POST", "http://localhost:3000/api/login", user).then((res) => {
    localStorage.setItem("user", JSON.stringify(res.body))
    cy.visit("http://localhost:3000")
  })
})

Cypress.Commands.add("createUser", (user) => {
  cy.request("POST", "http://localhost:3000/api/users", user)
})

Cypress.Commands.add("createBlog", (blog) => {
  const token = JSON.parse(localStorage.getItem("user")).token
  cy.request({
    method: "POST",
    url: "http://localhost:3000/api/blogs",
    headers: {
      Authorization: `bearer ${token}`,
    },
    body: blog,
  })
})

Cypress.Commands.add("logout", () => {
  localStorage.removeItem("user")
  cy.visit("http://localhost:3000")
})

Cypress.Commands.add("tid", (testid) => {
  cy.get(`[data-testid="${testid}"]`)
})

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
