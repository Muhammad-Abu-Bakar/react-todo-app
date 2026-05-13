import { useState, useEffect } from 'react'
import './App.css'

type Todo = {
  id: string
  text: string
  completed: boolean
}

// === NEW: Shape of the quote data we get from the API ===
type Quote = {
  quote: string
  author: string
}

function App() {
  const [inputValue, setInputValue] = useState<string>('')

  const [todos, setTodos] = useState<Todo[]>(() => {
    const stored = localStorage.getItem('todos')
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch {
        return []
      }
    }
    return []
  })

  // === NEW: Quote state starts as null until fetch completes ===
  const [quote, setQuote] = useState<Quote | null>(null)

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  // === NEW: Fetch a random quote on first mount ===
  useEffect(() => {
    async function fetchQuote() {
      const response = await fetch('https://dummyjson.com/quotes/random')
      const data = await response.json()
      setQuote(data)
    }
    fetchQuote()
  }, [])

  function handleAddTodo(event: React.FormEvent) {
    event.preventDefault()

    const trimmed = inputValue.trim()
    if (trimmed === '') return

    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text: trimmed,
      completed: false,
    }

    setTodos([...todos, newTodo])
    setInputValue('')
  }

  function handleDeleteTodo(idToDelete: string) {
    setTodos(todos.filter((todo) => todo.id !== idToDelete))
  }

  function handleToggleTodo(idToToggle: string) {
    setTodos(
      todos.map((todo) =>
        todo.id === idToToggle
          ? { ...todo, completed: !todo.completed }
          : todo
      )
    )
  }

  return (
    <div className="app">
      <h1>My Todo List</h1>

      {/* === NEW: Quote section, only renders when quote is loaded === */}
      {quote && (
        <div className="quote">
          <p className="quote-text">"{quote.quote}"</p>
          <p className="quote-author">— {quote.author}</p>
        </div>
      )}

      <form className="add-todo" onSubmit={handleAddTodo}>
        <input
          type="text"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          placeholder="What needs to be done?"
        />
        <button type="submit">Add</button>
      </form>

      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => handleToggleTodo(todo.id)}
            />
            <span className={`todo-text ${todo.completed ? 'completed' : ''}`}>
              {todo.text}
            </span>
            <button
              className="delete-btn"
              onClick={() => handleDeleteTodo(todo.id)}
            >
              X
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App