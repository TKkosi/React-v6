import { createElement as h } from 'react';

function App() {
    return h(
        "div",
        null,
        h("h1", null , "Hello Frontend Masters "),
        h("p", null, "This is a simple React app."),
   )
}

export default App;