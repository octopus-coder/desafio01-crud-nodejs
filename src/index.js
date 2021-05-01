const express = require("express");
const cors = require("cors");

const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const { username } = request.headers;
  const user = users.find((user) => user.username === username);
  if (!user) {
    return response.status(400).json({ error: "Username not found" });
  }
  request.user = user;
  return next();
}

function checksExistsTodo(request, response, next) {
  const { id } = request.params;
  const { user } = request;

  const todoExists = user.todos.some((todo) => todo.id === id);
  if (!todoExists) {
    return response.status(404).json({ error: "Non existing todo" });
  }

  return next();
}

app.post("/users", (request, response) => {
  // Complete aqui
  const { name, username } = request.body;

  const userAlreadyExists = users.some((user) => user.username === username);

  if (userAlreadyExists) {
    return response.status(400).json({ error: "User already defined" });
  }

  const user = {
    id: uuidv4(),
    name,
    username,
    todos: [],
  };

  users.push(user);
  return response.status(201).json(user);
});

app.get("/todos", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  return response.status(200).send(user.todos);
});

app.post("/todos", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { title, deadline } = request.body;

  const todo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date(),
  };

  user.todos.push(todo);
  return response.status(201).json(todo);
});

app.put(
  "/todos/:id",
  checksExistsUserAccount,
  checksExistsTodo,
  (request, response) => {
    // Complete aqui
    const { user } = request;
    const { title, deadline } = request.body;
    const { id } = request.params;
    let updatedTodo;
    user.todos = user.todos.map((todo) => {
      if (todo.id === id) {
        return (updatedTodo = {
          ...todo,
          title,
          deadline,
        });
      }
    });
    return response.status(200).json(updatedTodo);
  }
);

app.patch(
  "/todos/:id/done",
  checksExistsUserAccount,
  checksExistsTodo,
  (request, response) => {
    // Complete aqui
    const { user } = request;
    const { id } = request.params;
    let updatedTodo;

    user.todos = user.todos.map((todo) => {
      if (todo.id === id) {
        return (updatedTodo = {
          ...todo,
          done: true,
        });
      }
    });
    return response.status(200).json(updatedTodo);
  }
);

app.delete(
  "/todos/:id",
  checksExistsUserAccount,
  checksExistsTodo,
  (request, response) => {
    // Complete aqui
    const { user } = request;
    const { id } = request.params;
    user.todos = user.todos.filter((todo) => todo.id !== id);
    return response.status(204).send();
  }
);

module.exports = app;
