import React from "react";
import { v4 as uuidv4 } from "uuid";
import TodoItem from "./TodoItem";
import "./app.css";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      todos: [],
      title: "",
      description: "",
      showIncomplete: false,
      titleError: false,
      searchTerm: "",
      selectedImportance: [],
      importance: "Средне",
    };
  }

  handleTitleChange = (e) => {
    this.setState({
      title: e.target.value,
      titleError: false,
    });
  };

  handleDescriptionChange = (e) => {
    this.setState({
      description: e.target.value,
    });
  };

  handleSearchChange = (e) => {
    this.setState({
      searchTerm: e.target.value.toLowerCase(),
    });
  };

  handleImportanceChange = (e) => {
    const value = e.target.value;
    this.setState((prevState) => {
      const selectedImportance = prevState.selectedImportance.includes(value)
        ? prevState.selectedImportance.filter((imp) => imp !== value)
        : [...prevState.selectedImportance, value];

      return { selectedImportance };
    });
  };

  handleTodoAdd = () => {
    const { title, description, importance } = this.state;

    if (title.trim() === "") {
      this.setState({ titleError: true });
      return;
    }

    const newTodo = {
      id: uuidv4(),
      title: title,
      description: description,
      done: false,
      createdAt: new Date().toLocaleString(),
      importance: importance,
    };

    this.setState((prevState) => ({
      title: "",
      description: "",
      importance: "Средне",
      todos: [newTodo, ...prevState.todos],
      titleError: false,
    }));
  };

  handleTodoChecked = (id) => (e) => {
    const newTodo = {
      ...this.state.todos.find((todo) => todo.id === id),
      done: e.target.checked,
    };
    this.setState({
      todos: this.state.todos.map((todo) => (todo.id === id ? newTodo : todo)),
    });
  };

  handleTodoDelete = (id) => () => {
    this.setState({
      todos: this.state.todos.filter((todo) => todo.id !== id),
    });
  };

  handleDeleteAll = () => {
    this.setState({ todos: [] });
  };

  toggleFilter = (e) => {
    this.setState({
      showIncomplete: e.target.checked,
    });
  };

  generateRandomTodos = (count) => {
    const randomTodos = Array.from({ length: count }, (_, index) => ({
      id: uuidv4(),
      title: `Задача ${index + 1}`,
      description: `Описание задачи ${index + 1} с некоторым текстом.`,
      done: false,
      createdAt: new Date().toLocaleString(),
      importance: ["Срочно", "Средне", "Не срочно"][
        Math.floor(Math.random() * 3)
      ],
    }));

    this.setState((prevState) => ({
      todos: [...randomTodos, ...prevState.todos],
    }));
  };

  handleKeyPress = (e) => {
    if (e.key === "Enter") {
      this.handleTodoAdd();
    }
  };

  render() {
    const {
      todos,
      title,
      description,
      showIncomplete,
      titleError,
      searchTerm,
      selectedImportance,
      importance,
    } = this.state;

    const importanceOptions = ["Срочно", "Средне", "Не срочно"];

    const filteredTodos = todos.filter((todo) => {
      const matchesSearchTerm = todo.title.toLowerCase().startsWith(searchTerm);
      const matchesDoneStatus = showIncomplete ? !todo.done : true;
      const matchesImportance =
        selectedImportance.length === 0 ||
        selectedImportance.includes(todo.importance);

      return matchesSearchTerm && matchesDoneStatus && matchesImportance;
    });

    const sortedTodos = filteredTodos.sort((a, b) => {
      return a.done === b.done ? 0 : a.done ? 1 : -1;
    });

    return (
      <div>
        <h1>TODO LIST</h1>
        <div className="input-container">
          <div className="input-wrapper">
            <input
              className="input-title"
              placeholder="Введите название задачи"
              value={title}
              onChange={this.handleTitleChange}
              onKeyPress={this.handleKeyPress}
              style={{ borderColor: titleError ? "red" : "rgb(161, 161, 161)" }}
            />
            <button className="Add" onClick={this.handleTodoAdd}>
              Добавить
            </button>
          </div>
          <input
            className="input-description"
            placeholder="Введите описание задачи"
            value={description}
            onChange={this.handleDescriptionChange}
            onKeyPress={this.handleKeyPress}
          />
          <select
            value={importance}
            onChange={(e) => this.setState({ importance: e.target.value })}
          >
            {importanceOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className="search-container">
          <input
            type="text"
            placeholder="Поиск"
            value={searchTerm}
            onChange={this.handleSearchChange}
          />
        </div>
        <div className="filter-container">
          <label>
            Только невыполненные
            <input
              type="checkbox"
              checked={showIncomplete}
              onChange={this.toggleFilter}
            />
          </label>
        </div>
        <div className="importance-filter">
          {importanceOptions.map((option) => (
            <label key={option}>
              <input
                type="checkbox"
                value={option}
                checked={selectedImportance.includes(option)}
                onChange={this.handleImportanceChange}
              />
              {option}
            </label>
          ))}
        </div>
        <div className="button-container">
          <button id="Generate" onClick={() => this.generateRandomTodos(1000)}>
            Сгенерировать 1000 задач
          </button>
          <button id="DeleteAll" onClick={this.handleDeleteAll}>
            Удалить всё
          </button>
        </div>
        <ul>
          {sortedTodos.length === 0 && searchTerm ? (
            <li>По вашим критериям ничего не найдено</li>
          ) : (
            sortedTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                handleTodoChecked={this.handleTodoChecked(todo.id)}
                handleTodoDelete={this.handleTodoDelete(todo.id)}
                showIncomplete={showIncomplete}
              />
            ))
          )}
        </ul>
      </div>
    );
  }
}

export default App;
