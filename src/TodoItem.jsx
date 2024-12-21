import React from "react";

const TodoItem = ({ todo, onToggleChecked, onDelete }) => {
  return (
    <li>
      <div className="todo-header">
        <input
          type="checkbox"
          checked={todo.checked}
          onChange={onToggleChecked}
          className="todo-checkbox"
        />
        <span className={`todo-title ${todo.checked ? "checked" : ""}`}>
          {todo.title}
        </span>
        <span className={`severity ${todo.severity}`}>
          {todo.severity.charAt(0).toUpperCase() + todo.severity.slice(1)}
        </span>
        <button className="delete-button" onClick={onDelete}>
          Удалить
        </button>
      </div>
      <p className={`description ${todo.checked ? "checked" : ""}`}>
        {todo.description}
      </p>
      <p className="timestamp">{new Date(todo.createdAt).toLocaleString()}</p>
    </li>
  );
};

export default TodoItem;
