import React from "react";
import TodoItem from "./TodoItem";
import { v4 as uuidv4 } from "uuid";
import "./TodoApp.css";

class TodoApp extends React.Component {
  state = {
    title: "",
    description: "",
    todos: [],
    isShowingIncomplete: false,
    searchTerm: "",
    severityFilters: ["low", "medium", "high"],
    activeSeverityFilters: [],
    selectedSeverity: "low",
  };

  componentDidMount() {
    this.loadTodos();
  }

  loadTodos = () => {
    const todos = JSON.parse(localStorage.getItem("todos")) || [];
    this.setState({ todos });
  };

  saveTodos = (todos) => {
    localStorage.setItem("todos", JSON.stringify(todos));
  };

  handleInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSeverityChange = (e) => {
    this.setState({ selectedSeverity: e.target.value });
  };

  addTodo = () => {
    const { title, description, todos, selectedSeverity } = this.state;
    const trimmedTitle = title.trim();

    if (trimmedTitle) {
      const newTodo = {
        id: uuidv4(),
        title: trimmedTitle,
        description: description.trim(),
        checked: false,
        severity: selectedSeverity,
        createdAt: new Date().toISOString(),
      };

      const updatedTodos = [newTodo, ...todos];
      this.setState({
        title: "",
        description: "",
        todos: updatedTodos,
        selectedSeverity: "low",
      });

      this.saveTodos(updatedTodos);
      this.titleInput.focus();
    }
  };

  addMultipleTodos = (count) => {
    const { todos } = this.state;

    const newTodos = Array.from({ length: count }, (_, index) => ({
      id: uuidv4(),
      title: `Задача ${todos.length + index + 1}`,
      description: `Описание задачи ${todos.length + index + 1}`,
      checked: false,
      severity: ["low", "medium", "high"][Math.floor(Math.random() * 3)],
      createdAt: new Date().toISOString(),
    }));

    const updatedTodos = [...newTodos, ...todos];
    this.setState({ todos: updatedTodos });
    this.saveTodos(updatedTodos);
  };

  deleteAllTodos = () => {
    this.setState({ todos: [] });
    localStorage.removeItem("todos");
  };

  handleToggleTodo = (index) => (e) => {
    const updatedTodos = this.state.todos.map((todo, i) =>
      i === index ? { ...todo, checked: e.target.checked } : todo
    );

    this.setState({ todos: updatedTodos });
    this.saveTodos(updatedTodos);
  };

  handleDeleteTodo = (index) => () => {
    const updatedTodos = this.state.todos.filter((_, i) => i !== index);
    this.setState({ todos: updatedTodos });
    this.saveTodos(updatedTodos);
  };

  toggleShowIncomplete = () => {
    this.setState((prevState) => ({
      isShowingIncomplete: !prevState.isShowingIncomplete,
    }));
  };

  handleSearchChange = (e) => {
    this.setState({ searchTerm: e.target.value });
  };

  toggleSeverityFilter = (severity) => {
    this.setState((prevState) => {
      const isActive = prevState.activeSeverityFilters.includes(severity);
      const activeSeverityFilters = isActive
        ? prevState.activeSeverityFilters.filter((s) => s !== severity)
        : [...prevState.activeSeverityFilters, severity];

      return { activeSeverityFilters };
    });
  };

  filterTodos = () => {
    const { todos, isShowingIncomplete, searchTerm, activeSeverityFilters } =
      this.state;

    return todos.filter((todo) => {
      const matchesCompletion = isShowingIncomplete ? !todo.checked : true;
      const matchesSearch =
        todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        todo.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSeverity =
        activeSeverityFilters.length === 0 ||
        activeSeverityFilters.includes(todo.severity);

      return matchesCompletion && matchesSearch && matchesSeverity;
    });
  };

  render() {
    const {
      title,
      description,
      isShowingIncomplete,
      searchTerm,
      selectedSeverity,
      todos,
      severityFilters,
      activeSeverityFilters,
    } = this.state;

    const displayedTodos = this.filterTodos();

    return (
      <div className="container">
        <h1>Список задач</h1>

        <div className="search-container">
          <input
            className="search-input"
            type="text"
            placeholder="Поиск..."
            value={searchTerm}
            onChange={this.handleSearchChange}
          />
        </div>

        <div className="filters">
          <div className="severity-filters">
            {severityFilters.map((severity) => (
              <label className="filter-label" key={severity}>
                <input
                  type="checkbox"
                  checked={activeSeverityFilters.includes(severity)}
                  onChange={() => this.toggleSeverityFilter(severity)}
                />
                {severity.charAt(0).toUpperCase() + severity.slice(1)}
              </label>
            ))}
          </div>
          <div className="incomplete-filter">
            <label>
              <input
                type="checkbox"
                checked={isShowingIncomplete}
                onChange={this.toggleShowIncomplete}
              />
              Показать только невыполненные
            </label>
          </div>
        </div>

        <div className="todo-list">
          <ul>
            {todos.length === 0 ? (
              <li>Задачи отсутствуют</li>
            ) : (
              displayedTodos.map((todo, index) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggleChecked={this.handleToggleTodo(index)}
                  onDelete={this.handleDeleteTodo(index)}
                />
              ))
            )}
          </ul>
        </div>

        <div className="input-container">
          <input
            name="title"
            value={title}
            onChange={this.handleInputChange}
            placeholder="Введите заголовок задачи"
            ref={(input) => (this.titleInput = input)}
          />
          <textarea
            className="description-input"
            name="description"
            value={description}
            onChange={this.handleInputChange}
            placeholder="Введите описание задачи"
          />
          <select value={selectedSeverity} onChange={this.handleSeverityChange}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <button className="long-button" onClick={this.addTodo}>
            Добавить задачу
          </button>
          <div className="button-group">
            <button
              className="full-width-button"
              onClick={() => this.addMultipleTodos(1000)}
            >
              Добавить 1000 задач
            </button>
            <button className="full-width-button" onClick={this.deleteAllTodos}>
              Удалить все задачи
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default TodoApp;
