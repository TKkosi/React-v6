import { useEffect, useOptimistic, useState, useTransition } from "react";

export default function App() {
  const [thoughts, setThoughts] = useState([]);
  const [thought, setThought] = useState("");
  const [isPending, startTransition] = useTransition();
  const [optimisticThoughts, addOptimisticThought] = useOptimistic(
    thoughts,
    (oldThoughts, newThought) => [newThought, ...oldThoughts]
  );

  async function postDeepThought() {
    startTransition(async () => {
      addOptimisticThought(`${thought} (Loading…)`);
      setThought("");
      const response = await fetch("/thoughts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ thought }),
      });
      if (!response.ok) {
        alert("This thought was not deep enough. Please try again.");
        return;
      }
      const { thoughts: newThoughts } = await response.json();
      setThoughts(newThoughts);
    });
  }

  useEffect(() => {
    fetch("/thoughts")
      .then((res) => res.json())
      .then((data) => {
        setThoughts(data);
      });
  }, []);

  return (
    <div className="app">
      <h1>Deep Thoughts</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          postDeepThought();
        }}
      >
        <label htmlFor="thought">What's on your mind?</label>
        <textarea
          id="thought"
          name="thought"
          rows="5"
          cols="33"
          value={thought}
          onChange={(e) => setThought(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
      <ul>
        {optimisticThoughts.map((thought, index) => (
          <li key={thought}>{thought}</li>
        ))}
      </ul>
    </div>
  );
}