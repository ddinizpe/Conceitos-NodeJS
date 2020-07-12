const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  //should be able to list the repositories
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body;

  //should be able to create a new repository
  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes:0,
  }

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const {url, title, techs} = request.body;
  const repositoryUpdate = {id, url, title, techs, likes:0};

  //Finding index of the requested repository.
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  //should not be able to update a repository that does not exist
  if(repositoryIndex < 0 ){
    return response.status(400).json({erro: 'Repository not found.'});
  }
  
  //should not be able to update repository likes manually
  let repository = repositories[repositoryIndex];
  //Keeping the number of likes
  repositoryUpdate.likes = repository.likes;

  repository = repositoryUpdate;
  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  //Finding index of the requested repository.
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  //should not be able to delete a repository that does not exist
  if(repositoryIndex < 0 ){
    return response.status(400).json({erro: 'Repository not found.'});
  }

  //should be able to delete the repository
  repositories.splice(repositoryIndex,1);  
  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  //Finding index of the requested repository.
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  //should not be able to like a repository that does not exist
  if(repositoryIndex < 0){
    return response.status(400).json({erro: 'Repository not found.'});
  }

  //should be able to give a like to the repository
  const repository = repositories[repositoryIndex];
  repository.likes += 1;
  return response.json(repository);
});

module.exports = app;
