import { apiEndpoint } from "../config";
import { Todo } from "../types/Todo";
import { CreateTodoRequest } from "../types/CreateTodoRequest";
import Axios from "axios";
import { UpdateTodoRequest } from "../types/UpdateTodoRequest";

/**
 * Gets todos
 * @param idToken
 * @returns todos
 */
export async function getTodos(idToken: string): Promise<Todo[]> {
  console.log("Fetching todos ...");

  const response = await Axios.get(`${apiEndpoint}/todos`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`
    }
  });
  console.log("Todos: ", response.data);
  return response.data.items;
}

/**
 * Creates todo
 * @param idToken
 * @param newTodo
 * @returns todo
 */
export async function createTodo(
  idToken: string,
  newTodo: CreateTodoRequest
): Promise<Todo> {
  const response = await Axios.post(
    `${apiEndpoint}/todos`,
    JSON.stringify(newTodo),
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`
      }
    }
  );
  return response.data.item;
}

/**
 * Patchs todo
 * @param idToken
 * @param todoId
 * @param updatedTodo
 * @returns todo
 */
export async function patchTodo(
  idToken: string,
  todoId: string,
  updatedTodo: UpdateTodoRequest
): Promise<void> {
  await Axios.patch(
    `${apiEndpoint}/todos/${todoId}`,
    JSON.stringify(updatedTodo),
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`
      }
    }
  );
}

/**
 * Deletes todo
 * @param idToken
 * @param todoId
 * @returns todo
 */
export async function deleteTodo(
  idToken: string,
  todoId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/todos/${todoId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`
    }
  });
}

/**
 * Gets upload url
 * @param idToken
 * @param todoId
 * @returns upload url
 */
export async function getUploadUrl(
  idToken: string,
  todoId: string
): Promise<string> {
  const response = await Axios.post(
    `${apiEndpoint}/todos/${todoId}/attachment`,
    "",
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`
      }
    }
  );
  return response.data.uploadUrl;
}

/**
 * Uploads file
 * @param uploadUrl
 * @param file
 * @returns file
 */
export async function uploadFile(
  uploadUrl: string,
  file: Buffer
): Promise<void> {
  await Axios.put(uploadUrl, file);
}
