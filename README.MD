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
- wip