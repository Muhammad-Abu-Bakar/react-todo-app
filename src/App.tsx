import { useState } from 'react'
import './App.css'

function App() {
  // The text currently typed in the input box
  const [inputValue, setInputValue] = useState<string>('')

  // The list of todos we have added so far
  const [todos, setTodos] = useState<string[]>([])

  function handleAddTodo() {
    const trimmed = inputValue.trim()
    if (trimmed === '') return // ignore empty input
    setTodos([...todos, trimmed])
    setInputValue('') // clear the input box
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
        {todos.map((todo, index) => (
          <li key={index}>{todo}</li>
        ))}
      </ul>
    </div>
  )
}

export default App