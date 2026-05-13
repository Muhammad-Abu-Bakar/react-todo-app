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

  // === NEW: Error state for the quote fetch ===
  const [quoteError, setQuoteError] = useState<string | null>(null)

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  useEffect(() => {
    async function fetchQuote() {
      // === CHANGED: Wrap fetch logic in try/catch/finally ===
      try {
        setIsLoadingQuote(true)
        setQuoteError(null) // Clear any previous error before retrying

        const response = await fetch('https://dummyjson.com/quotes/random')

        // fetch does NOT throw on 404/500 - we must check manually
        if (!response.ok) {
          throw new Error(`Server responded with status ${response.status}`)
        }

        const data = await response.json()
        setQuote(data)
      } catch (err) {
        // err is typed as `unknown` - narrow it with instanceof
        const message = err instanceof Error ? err.message : 'Something went wrong'
        setQuoteError(message)
      } finally {
        // Always runs - whether success or error
        setIsLoadingQuote(false)
      }
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

      {/* Loading state */}
      {isLoadingQuote && (
        <div className="quote">
          <p className="quote-loading">Loading quote...</p>
        </div>
      )}

      {/* === NEW: Error state === */}
      {!isLoadingQuote && quoteError && (
        <div className="quote quote-error">
          <p>Could not load quote: {quoteError}</p>
        </div>
      )}

      {/* === CHANGED: Success state - now also checks no error === */}
      {!isLoadingQuote && !quoteError && quote && (
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