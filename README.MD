# 1TOOL1 - Chatting tool

---

## What is this?

A user-friendly messaging service.

The name 1tool1 is a wordplay that reflects its purpose: "1 tool" for secure communication and enabling "1 to 1" private conversations.

## Features

- Send messages to your friends
- Create or edit your account with ease

## Installation

Follow these steps to set up Cookingz locally:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/tristanvong/1tool1.git
   ```
   
2. **cd into the project:**

    ```bash
    cd 1tool1
    ```
    
3. **download all the packages:**

    ```bash
    npm i
    ```
4. **Create .env file in root of project:**

    ```bash
    touch .env
    ```
    **Paste the following text in the .env file:**
    ```bash
    # ----------------------------------|
    # Database Creds                    |
    # ----------------------------------|
    DB_HOST=
    DB_PORT=
    DB_USER=
    DB_PASSWORD=
    DB_NAME=

    # ----------------------------------|
    # Server Creds                      |
    # ----------------------------------|
    SERVER_PORT=
    BCRYPT_ROUNDS= # [integer, I recommend 12]
    SESSION_SECRET= # [example: SecretKey123!]
    ```

5. **Run migrations:**

    ```bash
    node migrate.js
    ```
    
6. **Start the project with npm script:**

    ```bash
    npm run start
    ```
   
## Information (ER-Diagram, Kanban Trello and source credits)

### 1. ER-Diagram
![ER-Diagram - 1tool1](https://i.imgur.com/pK9DIHY.png)

### 2. Kanban Trello
- [Trello](https://trello.com/b/mv3yQH5H/kanban-backend-web-1tool1)

### 3. Source Credits
- [ExpressJS Documentation page](https://expressjs.com/)

### 4. Additional Information
- There is a command to clean the database re-run all the migrations.
    ```bash
    node migrate.js --fresh | -f
    ``` 
    This sometimes causes a deadlock, please wait a couple seconds before retrying this command.
- Messages (chats) are stored in plaintext ! Don't send sensitive information such as passwords, addresses et cetera.
- Technologies: NodeJS, ExpressJS, Pug for frontend rendering, MySQL
