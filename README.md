# Fullstack test

## BE

### Starting

To start just run `docker-compose up -d` in the root folder

### Tests

To run tests go to userService folder and do such operations:
 - `npm i`
 - `npm test`

The API consists of 2 services:
 - user service;
 - transaction service.

### User service

This service is responsible for user interactions like retrieving
data, getting specific user info and adding user accounts.

#### Get all users info

GET http://localhost:3000/users/info

Returns basic info about all users in the system (only id, first and last name).
Possible usage - overview of all users in system without specific info.

Response: <br>
200 OK
```json
[
  {
    "id" : "a319c719-bd49-49a8-8ece-c9a5b047fa77",
    "firstName" : "John",
    "lastName" : "Doe"
  },
  ...
]
```

#### Get specific users info

GET http://localhost:3000/users/:userId/info

Returns full information about user. <br>
Possible usage - overview of user details.

Response: <br>
200 OK
```json
{
  "id" : "a319c719-bd49-49a8-8ece-c9a5b047fa77",
  "firstName" : "John",
  "lastName" : "Doe",
  "balance" : 1000,
  "transactions" : [],
  "accounts" : []
}
```

404 NOT FOUND
```json
{
  "status": "fail",
  "message": "User with such id not found"
}
```

#### Create new account

POST http://localhost:3000/users/:userId/account

Request body:
```json
{
  "initialCredit": 100
}
```

Creates a new account for specific user and tops that account from user balance. <br>

Response: <br>
200 OK
```json
{}
```

404 NOT FOUND
```json
{
  "status": "fail",
  "message": "User with such id not found"
}
```

400 BAD REQUEST
```json
{
  "status": "fail",
  "message": "User has insufficient balance for this operation"
}
```

### Transaction service

This service is responsible for transaction imitation and is for
internal usage of user service. 