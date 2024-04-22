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

const BASE_URL = 'http://143.198.196.60';

export const App = () => {

  const [error, setError] = useState();

  const [text, setText] = useState('');

  const [todos, setTodos] = useState<Todo[]>([]);
  useEffect(() => {
    const fetchTodo = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/tasks/`);
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

  const handleTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
    const newValue = e.target.value;

    const updateText = async (id: number, newText: string) => {
      try {
        await fetch(`${BASE_URL}/api/tasks/${id}/`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ value: newText })
        });
      } catch (e: any) {
          setError(e);
      }
    }
    updateText(id, newValue)

    const updateTodo = async () => {
      try {
        setTodos((todos) =>
          todos.map((todo) => {
            if (todo.id === id) {
              return { ...todo, value: newValue };
            } else {
              return todo;
            }
          })
        );
      } catch (e: any) {
        setError(e);
      }
    }
    updateTodo();
  }

  const handleSubmit = async () => {
    if (!text) return;

    const newTodo: Todo = {
      value: text,
      id: new Date().getTime(),
      checked: false,
      removed: false,
    };

    try {
      const response = await fetch(`${BASE_URL}/api/tasks/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTodo)
      });

      if(!response.ok) {
        throw new Error('Failed to add todo');
      }

      const createdTodo = await response.json();
      setTodos((todos) => [createdTodo, ...todos]);
      setText('');
    } catch (e: any) {
      setError(e);
    }
  };

  const handleCheck = (id: number, checked: boolean) => {
    setTodos((todos) => {
      const newTodos = todos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, checked };
        }
        return todo;
      });

      return newTodos;
    });
  };

  const handleRemove = (id: number, removed: boolean) => {
    setTodos((todos) => {
      const newTodos = todos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, removed };
        }
        return todo;
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
            <input type="text" value={text} onChange={(e) => handleTitle(e)} />
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
                onChange={() => handleCheck(todo.id, !todo.checked)}
              />
              <input
                type="text"
                disabled={todo.checked || todo.removed}
                value={todo.value}
                onChange={(e) => handleChange(e, todo.id)}
              />
              <button onClick={() => handleRemove(todo.id, !todo.removed)}>
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