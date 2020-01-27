import { History } from "history";
import * as React from "react";
import { Grid, Loader } from "semantic-ui-react";

import { Timeline, TimelineEvent } from "react-event-timeline";

import { IconContext } from "react-icons";
import { MdPermContactCalendar } from "react-icons/md";
import { MdToday } from "react-icons/md";

const Img = require("react-image");
import Image from "./Image";

import { getTodos } from "../api/todos-api";
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

export class TimelinePage extends React.PureComponent<TodosProps, TodosState> {
  state: TodosState = {
    todos: [],
    newTodoName: "",
    loadingTodos: true
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

  /**
   * Returns timeline page if downloading is done.
   * @returns
   */
  renderTimelineEvents() {
    if (this.state.loadingTodos) {
      return this.renderLoading();
    }

    return this.render();
  }

  /**
   * Renders loading
   * @returns
   */
  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading your motorcycle timeline events ...
        </Loader>
      </Grid.Row>
    );
  }

  render() {
    return (
      <Timeline>
        <Grid padded>
          {this.state.todos.map((todo, pos) => {
            return (
              <Grid.Row key={todo.todoId}>
                <TimelineEvent
                  title={todo.name}
                  createdAt={todo.dueDate}
                  icon={
                    <i>
                      <MdPermContactCalendar />
                    </i>
                  }
                >
                  {/* {<Img src={todo.attachmentUrl} crossorigin="anonymous" />} */}
                  <a href={todo.attachmentUrl}>
                    <Image
                      src={todo.attachmentUrl}
                      width={160}
                      height={240}
                      mode="fit"
                    />
                  </a>
                </TimelineEvent>
              </Grid.Row>
            );
          })}
        </Grid>
      </Timeline>
    );
  }

  isNoImageUrl(imageUrl: string): boolean {
    var test = false;
    if (imageUrl.length > 0) {
      test = true;
    }
    return test;
  }
}
