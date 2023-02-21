In traditional web pages, routes usually correspond to files in specific directories on the server. A server may be configured to route certain URLs to different locations or use URL parameters to determine what content to serve. With React, we can use React Router (a third party library) to handle URL's, routing and rendering. The router 'intercepts' the URL and uses it to determine what to render using conditional rendering. With this, a React SPA can still serve a single web page and JS file, while emulating the idea of having multiple pages that can be navigated to.

## V5

```js
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <header>
        <nav>
          <Link to="/">Home</Link>
          <Link to="contact">Contact</Link>
        </nav>
      </header>
      <main>
        <Routes>
          {/* Equivalent to path="/" */}
          <Route index element={<Home />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
```
