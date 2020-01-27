import dateFormat from "dateformat";
import { History } from "history";
import update from "immutability-helper";
import * as React from "react";
import { Button, Divider, Grid, Icon, Input, Loader } from "semantic-ui-react";

const Img = require("react-image");

import { createTodo, deleteTodo, getTodos, patchTodo } from "../api/todos-api";
import Auth from "../auth/Auth";
import { Todo } from "../types/Todo";

interface TodosProps {
  auth: Auth;
  history: History;
}

interface TodosState {
  todos: Todo[];
  newTodoName: string;
  loadingTodos: boolean;
}

export class Todos extends React.PureComponent<TodosProps, TodosState> {
  state: TodosState = {
    todos: [],
    newTodoName: "",
    loadingTodos: true
  };

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newTodoName: event.target.value });
  };

  onEditButtonClick = (todoId: string) => {
    this.props.history.push(`/todos/${todoId}/edit`);
  };

  /**
   * Events on todo create
   * @param event
   */
  onTodoCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const dueDate = this.calculateDueDate();
      const newTodo = await createTodo(this.props.auth.getIdToken(), {
        name: this.state.newTodoName,
        dueDate
      });
      this.setState({
        todos: [...this.state.todos, newTodo],
        newTodoName: ""
      });
    } catch {
      alert("Log creation failed");
    }
  };

  onTodoDelete = async (todoId: string) => {
    try {
      await deleteTodo(this.props.auth.getIdToken(), todoId);
      this.setState({
        todos: this.state.todos.filter(todo => todo.todoId != todoId)
      });
    } catch {
      alert("Log deletion failed");
    }
  };

  onTodoCheck = async (pos: number) => {
    try {
      const todo = this.state.todos[pos];
      await patchTodo(this.props.auth.getIdToken(), todo.todoId, {
        name: todo.name,
        dueDate: todo.dueDate,
        done: !todo.done
      });
      this.setState({
        todos: update(this.state.todos, {
          [pos]: { done: { $set: !todo.done } }
        })
      });
    } catch {
      alert("Log checkbox set failed");
    }
  };

  async componentDidMount() {
    try {
      const todos = await getTodos(this.props.auth.getIdToken());
      this.setState({
        todos,
        loadingTodos: false
      });
    } catch (e) {
      alert(`Failed to fetch todos: ${e.message}`);
    }
  }

  render() {
    return (
      <div>
        {this.renderCreateTodoInput()}

        {this.renderTodos()}
      </div>
    );
  }

  renderCreateTodoInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: "green",
              icon: "add",
              onClick: this.onTodoCreate
            }}
            fluid
            actionPosition="left"
            placeholder="12K service, New battery, Rear rack ..."
            onChange={this.handleNameChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    );
  }

  /**
   * Renders todos
   * @returns
   */
  renderTodos() {
    if (this.state.loadingTodos) {
      return this.renderLoading();
    }

    return this.renderTodosList();
  }

  /**
   * Renders loading
   * @returns
   */
  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading motorcycle log ...
        </Loader>
      </Grid.Row>
    );
  }

  /**
   * Renders todos list
   * @returns
   */
  renderTodosList() {
    return (
      <Grid stackable columns={6}>
        {this.state.todos.map((todo, pos) => {
          return (
            <Grid.Row key={todo.todoId}>
              <Grid.Column width={10} verticalAlign="middle">
                <a href={todo.attachmentUrl}>{todo.name}</a>
              </Grid.Column>
              <Grid.Column width={3} verticalAlign="middle" floated="right">
                {todo.dueDate}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(todo.todoId)}
                >
                  <Icon name="cloud upload" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onTodoDelete(todo.todoId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          );
        })}
      </Grid>
    );
  }

  isNoImageUrl(imageUrl: string): boolean {
    var test = false;
    if (imageUrl.length > 0) {
      test = true;
    }
    return test;
  }

  calculateDueDate(): string {
    const date = new Date();
    date.setDate(date.getDate());

    return dateFormat(date, "yyyy-mm-dd") as string;
  }
}
