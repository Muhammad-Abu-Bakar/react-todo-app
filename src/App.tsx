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
            {todo.text}
            <button onClick={() => handleDeleteTodo(todo.id)}>X</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App