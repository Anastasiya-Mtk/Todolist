import React from "react";
import PropTypes from "prop-types";

class TodoItem extends React.PureComponent {
  static propTypes = {
    todo: PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      done: PropTypes.bool.isRequired,
      createdAt: PropTypes.string.isRequired,
      importance: PropTypes.string.isRequired,
    }).isRequired,
    handleTodoChecked: PropTypes.func.isRequired,
    handleTodoDelete: PropTypes.func.isRequired,
    showIncomplete: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      isHovered: false,
    };
  }

  handleMouseEnter = () => {
    this.setState({ isHovered: true });
  };

  handleMouseLeave = () => {
    this.setState({ isHovered: false });
  };

  render() {
    const { todo, handleTodoChecked, handleTodoDelete, showIncomplete } =
      this.props;
    const { isHovered } = this.state;

    if (showIncomplete && todo.done) {
      return null;
    }

    return (
      <li
        className={`todo-item ${todo.done ? "completed" : ""}`}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        <input
          type="checkbox"
          checked={todo.done}
          onChange={handleTodoChecked}
        />
        <div style={{ flex: 1, marginLeft: "10px" }}>
          <strong className="todo-title">{todo.title}</strong> (
          {todo.importance}):
          <div className="todo-description">{todo.description}</div>
          <div style={{ fontSize: "0.8em", color: "#666" }}>
            Создано: {todo.createdAt}
          </div>
        </div>
        {isHovered && (
          <button className="delete" onClick={handleTodoDelete}>
            Удалить
          </button>
        )}
      </li>
    );
  }
}

export default TodoItem;
