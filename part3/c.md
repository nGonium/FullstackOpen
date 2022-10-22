# Debugging

There are multiple ways to debug code. The first is to simply insert `console.log` calls and remove them when you're done. 

VS code provides a debugger, accessed via *Run > Start Debugging (F5)*. You may first need to configure it *Run > Add / Open Configuration ( > Node.js )*, then click `Add configuration...` select `Run "npm start" in a debug terminal`. This results in a launch.json file in the .vscode directory, where VS Code is currently opened. 

We can also use dev tools by running the following command. Then open devtools and select the green node icon.
```bash
node --inspect <filename>
```

# Databases with MongoDB

MongoDB is a document database, but most databases are relational. Document databases query data differently than relational dbs, and are often considered NoSQL. You can use MongoDB locally, or run a free db on MongoDB Atlas

## Atlas

Create a cluster on Atlas, then under *Security > Quickstart* add a user (e.g. admin). Allow your IP address to access the database under *Security > Network Access*, or select allow access from anywhere. Navigate to *Deployment > Database* and click *Connect > Connect your application > DEFAULTS* and take note of the database URI (e.g. `mongodb+srv://admin:<password>@cluster0.abcdef.mongodb.net/?retryWrites=true&w=majority`). In order to access a database, you need:
- URI
- Password
- An IP address that's allowed under *Network Access*

## Connect to Atlas DB with Mongoose

Mongoose is a library which helps us access the database, install with `npm install mongoose`. Although Mongo itself is schemaless (it does not check if documents in collections have the same fields), conventionally Mongoose defines a schema at the application level. 

## Mongoose

Schema
Model.find(queryObject)
{ queryField: queryValue }

