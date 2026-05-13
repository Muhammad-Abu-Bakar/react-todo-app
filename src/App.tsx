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
  const [isLoadingQuote, setIsLoadingQuote] = useState<boolean>(true)
  const [quoteError, setQuoteError] = useState<string | null>(null)

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  // === CHANGED: Extracted fetchQuote function so it can be called from
  // both useEffect (on mount) and the refresh button (on click) ===
  async function fetchQuote() {
    try {
      setIsLoadingQuote(true)
      setQuoteError(null)

      const response = await fetch('https://dummyjson.com/quotes/random')

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`)
      }

      const data = await response.json()
      setQuote(data)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong'
      setQuoteError(message)
    } finally {
      setIsLoadingQuote(false)
    }
  }

  // === CHANGED: useEffect now just calls the extracted function on mount ===
  useEffect(() => {
    fetchQuote()
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

      {/* Loading state */}
      {isLoadingQuote && (
        <div className="quote">
          <p className="quote-loading">Loading quote...</p>
        </div>
      )}

      {/* Error state */}
      {!isLoadingQuote && quoteError && (
        <div className="quote quote-error">
          <p>Could not load quote: {quoteError}</p>
        </div>
      )}

      {/* Success state */}
      {!isLoadingQuote && !quoteError && quote && (
        <div className="quote">
          <p className="quote-text">"{quote.quote}"</p>
          <p className="quote-author">— {quote.author}</p>
        </div>
      )}

      {/* === NEW: Refresh button to manually fetch a new quote === */}
      <button
        onClick={fetchQuote}
        disabled={isLoadingQuote}
        className="refresh-quote-btn"
      >
        🔄 New Quote
      </button>

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