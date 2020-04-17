const express = require("express");
const { uuid, isUuid } = require("uuidv4");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

//Validation Id Middleware

function validateRepositoryId(request, response, next) {

  const {
    id
  } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({
      error: 'Invalid project ID.'
    });
  }
  return next();
}

app.use('/projects/:id', validateRepositoryId);

//Method GET - List respositories

app.get("/repositories", (request, response) => {
  const {title} = request.query;
  const results = title ? repositories.filter(repo => repo.title.includes(title)) :
    repositories;

  return response.json(results);
});

//Method POST - Create repository

app.post("/repositories", (request, response) => {

  const {
    title,
    url,
    techs,
    likes = 0
  } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes
  };

  repositories.push(repository);

  return response.json(repository);
});

//Method PUT - edit/update repository

app.put("/repositories/:id", (request, response) => {

  const { id } = request.params;

  const {
    title,
    url,
    techs,
  } = request.body;

  const repositoryIndex = repositories.findIndex(repo => repo.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({error: "Repository not found"});
  }

  const repository = {
    id,
    title,
    url,
    techs,
    likes:repositories[repositoryIndex].likes
  };

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

//Method DELETE - delete repository

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params;

  const repositoryIndex = repositories.findIndex(repo => repo.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({error: "Repository not found"});
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

// Likes - increase number of likes + 1

app.post("/repositories/:id/like", (request, response) => {

  const {id} = request.params;
 
  const repositoryIndex = repositories.findIndex(repo => repo.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({
      error: "Repository not found"
    });
  }

  const repository = repositories[repositoryIndex];

  repository.likes += 1;

  return response.json(repository);
});

module.exports = app;
