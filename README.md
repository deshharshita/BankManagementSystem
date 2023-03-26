# Bank of IIT Jamdoli
a Bank Management System web app
___

BOIJ is a node application connected to a PostrgreSQL database with Sequelize ORM

## Install
`npm install`
### Configuration
Inside **services/database.js** replace environment variables with appropriate PSQL credentials.
```
require('dotenv').config()

const username = process.env.DB_USERNAME;
const database = process.env.DB_NAME;
const password = process.env.DB_PASSWORD;
```

## Run
`node index.js`


#### License
[MIT](LICENSE)