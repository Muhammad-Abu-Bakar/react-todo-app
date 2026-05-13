import { useState } from 'react'
import './App.css'

type Todo = {
  id: string
  text: string
  completed: boolean
}

function App() {
  const [inputValue, setInputValue] = useState<string>('')
  const [todos, setTodos] = useState<Todo[]>([])

  function handleAddTodo() {
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

      <div className="add-todo">
        <input
          type="text"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          placeholder="What needs to be done?"
        />
        <button onClick={handleAddTodo}>Add</button>
      </div>

      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => handleToggleTodo(todo.id)}
            />
            <span
              style={{
                textDecoration: todo.completed ? 'line-through' : 'none',
                marginLeft: '0.5rem',
                marginRight: '0.5rem',
              }}
            >
              {todo.text}
            </span>
            <button onClick={() => handleDeleteTodo(todo.id)}>X</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App