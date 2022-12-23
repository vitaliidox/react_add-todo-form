import { useState } from 'react';
import './App.scss';

import usersFromServer from './api/users';
import todosFromServer from './api/todos';

import { User } from './types/User';
import { Todo } from './types/Todo';

import { TodoList } from './components/TodoList';
import { UserSelect } from './components/UserSelect/UserSelect';

function getUser(userId: number): User | null {
  const foundUser = usersFromServer.find(user => user.id === userId);

  return foundUser || null;
}

export const App = () => {
  const [currentTodos, setTodos] = useState(todosFromServer);
  const [userSelect, setUserSelect] = useState(0);
  const [titleInput, setTitleInput] = useState('');

  const todos: Todo[] = currentTodos.map(todo => ({
    ...todo,
    user: getUser(todo.userId),
  }));

  function addTodo() {
    if (titleInput && userSelect > 0) {
      setTodos((todoList) => [...todoList, {
        id: todoList.length + 1,
        title: titleInput,
        completed: false,
        userId: userSelect,
      }]);
      setUserSelect(0);
      setTitleInput('');
    }

    if (userSelect === 0) {
      setUserSelect(-1);
    }

    if (titleInput === '') {
      setTitleInput('-');
    }
  }

  return (
    <div className="App">
      <h1>Add todo form</h1>

      <form
        action="/api/users"
        method="POST"
        onSubmit={(ev) => {
          ev.preventDefault();
          addTodo();
          (ev.target as HTMLFormElement).reset();
        }}
      >
        <div className="field">
          <label htmlFor="titleInput">Title: </label>

          <input
            name="titleInput"
            id="titleInput"
            type="text"
            data-cy="titleInput"
            placeholder="Enter a title"
            onChange={(event) => {
              setTitleInput(
                event.target.value.replace(/[^A-Za-zА-Яа-я0-9\s]/g, ''),
              );
            }}
          />
          {titleInput === '-'
          && <span className="error">Please enter a title</span>}
        </div>

        <div className="field">
          <label htmlFor="userSelect">User: </label>
          <select
            name="userSelect"
            id="userSelect"
            data-cy="userSelect"
            defaultValue={`${userSelect}`}
            onChange={(event) => {
              setUserSelect(+event.target.value);
            }}
          >
            <UserSelect users={usersFromServer} />
          </select>
          {userSelect < 0
          && <span className="error">Please choose a user</span>}
        </div>

        <button type="submit" data-cy="submitButton">
          Add
        </button>
      </form>

      <TodoList todos={todos} />
    </div>
  );
};
