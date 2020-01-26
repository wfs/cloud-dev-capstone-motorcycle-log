import { History } from "history";
import * as React from "react";
//import { Divider, Header, Image, Loader } from "semantic-ui-react";
import { Timeline, TimelineEvent } from "react-event-timeline";

//import { calendar_today } from "react-icons/md";
import { IconContext } from "react-icons";
import { MdPermContactCalendar } from "react-icons/md";
import { MdToday } from "react-icons/md";

const Img = require("react-image");

//import { createTodo, deleteTodo, getTodos, patchTodo } from "../api/todos-api";
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

  render() {
    return (
      <Timeline>
        <IconContext.Provider
          value={{ color: "blue", className: "global-class-name", size: "1em" }}
        >
          <TimelineEvent
            title="John Doe sent a SMS"
            createdAt="2016-09-12 10:06 PM"
            icon={
              <i>
                <MdPermContactCalendar />
              </i>
            }
          >
            I received the payment for $543. Should be shipping the item within
            a couple of hours.
          </TimelineEvent>
          <TimelineEvent
            title="You sent an email to John Doe"
            onClick={() => alert("clicked")}
            createdAt="2016-09-11 09:06 AM"
            icon={
              <i>
                <MdToday />
              </i>
            }
          >
            Like we talked, you said that you would share the shipment details?
            This is an urgent order and so I am losing patience. Can you
            expedite the process and pls do share the details asap. Consider
            this a gentle reminder if you are on track already!
          </TimelineEvent>
        </IconContext.Provider>
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
