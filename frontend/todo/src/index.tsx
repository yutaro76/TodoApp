import React from 'react';
import { useState, StrictMode, useEffect } from "react";
import { createRoot } from 'react-dom/client';
import "./index.css";

type Todo = {
  value: string;
  readonly id: number;
  checked: boolean;
  removed: boolean;
};

type Filter = 'all' | 'checked' | 'unchecked' | 'removed';

const BASE_URL = 'http://127.0.0.1:8000';

export const App = () => {

  const [error, setError] = useState();
  const [text, setText] = useState(() => {
    const storedText = localStorage.getItem('text');
    return storedText ? JSON.parse(storedText) : '';
  });
  
  useEffect(() => {
    localStorage.setItem('text', JSON.stringify(text));
  }, [text]);

  const [todos, setTodos] = useState<Todo[]>([]);
  useEffect(() => {
    const fetchTodo = async () => {
      try{
        const response = await fetch(`${BASE_URL}/api/tasks`);
        const fetchedTodo = (await response.json()) as Todo[];
        setTodos(fetchedTodo);
      } catch (e: any) {
        setError(e);
      }
    }
    fetchTodo();
  },[]);

  const [filter, setFilter] = useState<Filter>(() => {
    const storedFilter = localStorage.getItem('filter');
    return storedFilter ? (JSON.parse(storedFilter) as Filter) : 'all';
  });

  useEffect(() => {
    localStorage.setItem('filter', JSON.stringify(filter));
  }, [filter]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handleSubmit = () => {
    if (!text) return;

    const newTodo: Todo = {
      value: text,
      id: new Date().getTime(),
      checked: false,
      removed: false,
    };

    setTodos((todos) => [newTodo, ...todos]);
    setText('');
  };
  
  const handleTodo = <K extends keyof Todo, V extends Todo[K]>(
    id: number,
    key: K,
    value: V
  ) => {
    setTodos((todos) => {
      const newTodos = todos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, [key]: value };
        } else {
          return todo;
        }
      });

      return newTodos;
    });
  };

  const handleSort = (filter: Filter) => {
    setFilter(filter);
  };

  const handleEmpty = () => {
    setTodos((todos) => todos.filter((todo) => !todo.removed));
  };

  const filteredTodos = todos.filter((todo) => {
    switch (filter) {
      case 'all':
        return !todo.removed;
      case 'checked':
        return todo.checked && !todo.removed;
      case 'unchecked':
        return !todo.checked && !todo.removed;
      case 'removed':
        return todo.removed;
      default:
        return todo;
    }
  });

  if (error) {
    return <div>Something went wrong. Please try again.</div>
  }
  return (
    <div>
      <select
        value={filter}
        onChange={(e) => handleSort(e.target.value as Filter)}
      >
        <option value="all">すべてのタスク</option>
        <option value="checked">完了したタスク</option>
        <option value="unchecked">現在のタスク</option>
        <option value="removed">ごみ箱</option>
      </select>
      {filter === 'removed' ? (
        <button
          onClick={handleEmpty}
          disabled={todos.filter((todo) => todo.removed).length === 0}
        >
          ごみ箱を空にする
        </button>
      ) : (
        filter !== 'checked' && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <input type="text" value={text} onChange={(e) => handleChange(e)} />
            <input type="submit" value="追加" onSubmit={handleSubmit} />
          </form>
        )
      )}
      <ul>
        {filteredTodos.map((todo) => {
          return (
            <li key={todo.id}>
              <input
                type="checkbox"
                disabled={todo.removed}
                checked={todo.checked}
                onChange={() => handleTodo(todo.id, 'checked', !todo.checked)}
              />
              <input
                type="text"
                disabled={todo.checked || todo.removed}
                value={todo.value}
                onChange={(e) => handleTodo(todo.id, 'value', e.target.value)}
              />
              <button onClick={() => handleTodo(todo.id, 'removed', !todo.removed)}>
                {todo.removed ? '復元' : '削除'}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

const root = createRoot(document.getElementById('root') as Element);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);