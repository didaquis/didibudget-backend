# 💰 didibudget-backend

This is an app to manage your money.
The proyect is splitted on two repositories: one for the backend and one for the frontend application. 

This repository is for the backend and is made to work with [the frontend](https://github.com/didaquis/didibudget-frontend)


### 🎁 What it's included on the backend?
Technologies used are: Node.js + GraphQL + Apollo + Express + Mongoose + MongoDB.

**✨ These are some of the highlights:** 

✅ A server ready to use!  
✅ Users can login and registrate  
✅ You can add the 'administration' rol to some users  
✅ You can set a limit of users registered  
✅ Users data are stored on a database  
✅ The Auth validations are made with JWT  

### 📝 Backend Requirements
* MongoDB 4.0 or higher service running
* Node.js 10 or higher

### 📚 How to run the application?
* Use the command: `npm install`. If you are deploying the app in production, it's better to use this command: `npm install --production`
* Configure the application:
  * Duplicate the configuration file `_env` and rename as `.env`
  * Edit the file `.env`
* Then use: `npm run start`. 
* That's it! That was fast enough, right? 🚀

**❗️You need help with `.env` file?** 

Do not worry, I have written some information for you. Meanwhile here you have a guide:

| Key | Description |
|-----|-------------|
| PORT | The port for running the backend |
| ENVIROMENT | The mode of execution of Node.js. Choose between: production or development |
| LIMIT_USERS_REGISTERED | Maximum number of users allowed to register. Set the value to 0 to not use the limit |
| MONGO_FORMAT_CONNECTION | The format of connection with MongoDB service. Choose between: standard or DNSseedlist |
| MONGO_HOST | Set this value only if you are using the standard connection format. Host of MongoDB service |
| MONGO_PORT | Set this value only if you are using the standard connection format. Port of MongoDB service |
| MONGO_DB | Set this value only if you are using the standard connection format. The name of database |
| MONGO_USER | Set this value only if you are using the standard connection format. User name |
| MONGO_PASS | Set this value only if you are using the standard connection format. User password |
| MONGO_DNS_SEEDLIST_CONNECTION | Set this value only if you are using the DNSseedlist connection format. Will be something like this: mongodb+srv://user:password@uri-and-options |
| SECRET | JWT secret key. Remember not to share this key for security reasons |
| DURATION | JWT duration of auth token |

**❗️How can I configure a user to be an administrator?** 

To make a user an administrator you must access to the database and search its registry. You will see a Boolean who allows that user to have rol of administrator. Set it to 'true' and in his next authentication that user will have administrator permissions.

### 💻 Tricks for development
* Run app in dev mode: `npm run dev`
* Run the linter: `npm run lint`
* Delete all log files: `npm run purge`

