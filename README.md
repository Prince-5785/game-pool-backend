# API
## Project Structure

```
project-root/
├── config/
│   ├── database.js
│   ├── passport.js
│   ├── config.js
│   ├── logger.js
│   ├── morgan.js
│   └── rabbitmq.js
├── controllers/
│   ├── identity.controller.js
│   └── accessLevel.controller.js
├── docs/
│   ├── components.yml
│   └── swaggerDef.js
├── middlewares/
│   ├── auth.js
│   ├── error.js
│   └── rateLimiter.js
├── models/
│   ├── identity.model.js
│   ├── accessLevel.model.js
│   └── permission.model.js
├── routes/
│   ├── auth.routes.js
│   ├── accessLevel.route.js
│   └── docs.route.js
├── seeders/
│   └── 20250210061754-event-config-seeder.js
├── services/
│   ├── auth.service.js
│   └── event.service.js
├── utils/
│   ├── ApiError.js
│   └── ApiResponse.js
├── validations/
│   └── accessLevel.validation.js
├── .env.local
├── .env.dev
├── .gitignore
├── .sequelizerc
├── app.js
├── server.js
├── package.json
├── package-lock.json
└── README.md
```

## Naming Conventions

- **Folders:** Lowercase, use plural nouns (e.g., `controllers/`, `models/`).
- **Configuration Files:** Lowercase, camel-case (e.g., `database.js`).
- **Model Files:** Lowercase, words separated by dots, use singular nouns (e.g., `identity.model.js`).
- **Controller Files:** Lowercase, words separated by dots, use singular nouns (e.g., `identity.controller.js`).
- **Services Files:** Lowercase, words separated by dots, use singular nouns (e.g., `auth.service.js`).
- **Route Files:** Lowercase, camel-case, use singular nouns (e.g., `identityRoute.js`).
- **Middleware Files:** Lowercase, camel-case (e.g., `rateLimiter.js`).


## Description of Directories

- **config/**: Contains configuration files, such as database configurations.
- **controllers/**: Houses functions that handle incoming requests and responses.
- **models/**: Defines data schemas and interacts with the database.
- **routes/**: Defines application routes and associates them with controller functions.
- **middlewares/**: Contains middleware functions for tasks like authentication.
- **services/**: Encapsulates business logic and external service interactions.
- **utils/**: Includes utility functions and helpers used across the application.
- **tests/**: Contains unit and integration tests, organized respectively.

## Add your files

```
cd existing_repo
git add .
git commit -m "Commit message"
git remote add origin https://git.onetalkhub.com/care/api.git
git branch -M main
git push -uf origin main
```

## Development Setup and Run

- Basic setup and installation
```
npm install
npm run dev
```
- Create enviorment file with name `.env` and put environment variables:
```
NODE_ENV
PORT
DB_URL
JWT_SECRET
```

## API Docs URL by Swagger

[http://localhost:3001/docs](http://localhost:3001/docs)

## Prompt for generating APIs using Github Copiolet

```
Create a Person Of Interrest controller for the below table. 
API to validate mandatory fields upon Add / Create
Makesure Firstname is a required field upon add/update
Endpoints for GET/GETALL/POST/PUT/DELETE to be added 
add the swagger documentation for every Endpoint created in routes
add history in models
make use of Master data
remove the Enums and make use of master data from Facility
```
## Command for starting the API project on server using PM2 service
```pm2 start server.js --node-args="--env-file=.env.dev" --name="caremate_backend"```

## For syncing the database
```npm run db```

## For syncing the database with particular enviorment
```npm run db -- --env-file .env.dev```

## For refreshing the database (remove all tables and then re-create)
```npm run db:refresh```

## For refreshing the database with particular enviorment (remove all tables and then re-create)
```npm run db:refresh -- --env-file .env.dev```

## For refreshing the particular model 
```npm run db:refresh -- --model=Facility```

## For seeding all seeder 
```npx sequelize-cli db:seed:all```

## For reverting the seeded data from a particular seeder 
```npx sequelize-cli db:seed:undo:all```

## For seeding a particular seeder 
```npx sequelize-cli db:seed --seed 20230409123456-seed-users.js```

## For reverting the seeded data from a particular seeder 
```npx sequelize-cli db:seed:undo --seed 20230409123456-seed-users.js```

## For seeding the data with particular enviorment (default 'local')
```npx sequelize-cli db:seed:all --env-file .env.development```