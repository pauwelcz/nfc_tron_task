# Email Sender

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#init-database">Init database</a></li>
        <li><a href="#run-project">Run project</a></li>
        <li><a href="#run-tests">Run tests</a></li>
      </ul>
    </li>
    <li>
      <a href="#project-routes">Project routes</a>
      <ul>
        <li><a href="#get-customers">GET customers</a></li>
        <li><a href="#get-customers-id">GET customers/:id</a></li>
        <li><a href="#post-customers">POST customers</a></li>
        <li><a href="#patch-customers-id">PATCH customers/:id</a></li>
        <li><a href="#delete-customers-id">DELETE customers/:id</a></li>
        <li><a href="#swagger">Swagger</a></li>
      </ul>
    </li>
    <li><a href="#author">Author</a></li>
  </ol>
</details>

## About The Project

This project is part of a technical round. Project demonstrates basic CRUD operations.

### Built with

- Visual Studio Code
- NodeJS v18.16.0
- NestJS 10.2.0
- Docker 25.0.3

### Getting started

#### Prerequisities

- NodeJS v18.16.0
- NestJS 10.2.0
- Docker 25.0.3
- pnpm

#### Init database

1. Create `.env` file and fill it with variables (variable names are included in `.env.example` file ). 
2. Start Docker, if you do not have it started
3. Open terminal
4. Run command `docker compose up --build`

After these steps you should be able to connect to database with created empty table `customers` in Docker container.

#### Run project

1. Install dependencies with `pnpm i`
2. Execute project with `pnpm run start`

#### Run tests
1. Execute tests with `pnpm run test`

### Project routes

#### GET customers

This route will get all customers.

### GET customers/:id

Request will find existing customer. 

#### POST customers

Request will create new customer. `Email` must be unique for each user in the database!

Request body example:

```json
  "email": "JohnDoe@email.com",
  "firstname": "John",
  "lastname": "Doe",
```

#### PATCH customers/:id

Request will patch existing customer. `Email` must be unique for each user in the database!

Request body example:

```json
  "email": "JohnDoe@email.com",
  "firstname": "John",
  "lastname": "Doe",
```

#### DELETE customers/:id

Request will delete existing customer.

#### Swagger

You can use also [Swagger](https://docs.nestjs.com/openapi/introduction) documentation via `http://localhost:{{PORT}}/api`. Default `PORT` number is 3000. Otherwise it depends on value in `.env` file.

### Author

- Name: **Pavel Sedlář**
- <a href="https://www.linkedin.com/in/pavel-sedl%C3%A1%C5%99-574039117/">LinkedIn Profile</a>
- <a href="https://github.com/pauwelcz/nfc_tron_task">Github repository</a>