import { useState, useEffect } from 'react'
import './App.css'

type Todo = {
  id: string
  text: string
  completed: boolean
}

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

  const [quote, setQuote] = useState<Quote | null>(null)

  // === NEW: Track whether the quote is currently being fetched ===
  const [isLoadingQuote, setIsLoadingQuote] = useState<boolean>(true)

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  useEffect(() => {
    async function fetchQuote() {
      // === CHANGED: Set loading true before fetch, false after ===
      setIsLoadingQuote(true)
      const response = await fetch('https://dummyjson.com/quotes/random')
      const data = await response.json()
      setQuote(data)
      setIsLoadingQuote(false)
      // === END CHANGED ===
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

      {/* === CHANGED: Show loading message while fetching === */}
      {isLoadingQuote && (
        <div className="quote">
          <p className="quote-loading">Loading quote...</p>
        </div>
      )}

      {/* === CHANGED: Show quote only when not loading AND quote exists === */}
      {!isLoadingQuote && quote && (
        <div className="quote">
          <p className="quote-text">"{quote.quote}"</p>
          <p className="quote-author">— {quote.author}</p>
        </div>
      )}
      {/* === END CHANGED === */}

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