const mongoose = require('mongoose');
require('dotenv').config();
mongoose.set('strictQuery', false);

const Author = require('./models/Author');
const Book = require('./models/Book');
const User = require('./models/User');

const jwt = require('jsonwebtoken');
const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const { GraphQLError } = require('graphql');

const { expressMiddleware } = require('@apollo/server/express4');
const {
  ApolloServerPluginDrainHttpServer,
} = require('@apollo/server/plugin/drainHttpServer');
const { makeExecutableSchema } = require('@graphql-tools/schema');
// Setup express
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');

const url = process.env.MONGO_URI_DEV;
const PASSWORD = 'password';

mongoose
  .connect(url)
  .then(() => console.log(`Connected to MongoDB`))
  .catch((e) => console.error('failed to connect to MongoDB', e.message));
mongoose.set('debug', true);

const typeDefs = `
  type Subscription {
    bookAdded: Book!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(
      author: String
      genres: String
    ): [Book!]!
    allAuthors: [Author!]!
    me: User
  }

  type Mutation {
    addBook(
      title: String!
      published: Int!
      author: String!
      genres: [String!]!
    ): Book!
    editAuthor(name: String!, setBornTo: Int!): Author
    createUser(
      username: String!
      favoriteGenre: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
  }

  type Book {
    title: String!
    published: Int!
    author: Author!
    id: ID!
    genres: [String!]!
  }

  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int
  }

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }
  
  type Token {
    value: String!
  }
`;

const { PubSub } = require('graphql-subscriptions');
const pubsub = new PubSub();

const BOOK_ADDED = 'BOOK_ADDED';

const resolvers = {
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(BOOK_ADDED),
    },
  },

  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      const filter = { ...args };
      if (filter.author)
        filter.author = await Author.find({ name: filter.author });
      return await Book.find(filter);
    },
    allAuthors: async () => Author.find({}),
    me: (root, args, context) => context.currentUser,
  },

  Mutation: {
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser;
      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      let author = await Author.findOne({ name: args.author });
      if (!author) {
        author = new Author({ name: args.author });
      }
      const newBook = new Book({ ...args, author: author.id });
      author.books.push(newBook.id);
      try {
        await author.save();
      } catch (error) {
        throw new GraphQLError('Saving new author failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error,
          },
        });
      }
      try {
        await newBook.save();
      } catch (error) {
        throw new GraphQLError('Saving book failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error,
          },
        });
      }
      const returnedBook = await newBook.populate('author');
      pubsub.publish(BOOK_ADDED, { bookAdded: returnedBook });
      return returnedBook;
    },

    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser;
      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      const authorToEdit = await Author.findOne({ name: args.name });
      if (!authorToEdit) return null;
      authorToEdit.born = args.setBornTo;
      try {
        await authorToEdit.save();
      } catch (error) {
        throw new GraphQLError('Updating author failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error,
          },
        });
      }
      return authorToEdit;
    },

    createUser: async (root, args) => {
      const newUser = new User({ ...args });
      try {
        await newUser.save();
      } catch (error) {
        throw new GraphQLError('Creating new user failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error,
          },
        });
      }
      return newUser;
    },

    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });
      if (!user || args.password !== PASSWORD) {
        throw new GraphQLError('wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      const token = { value: jwt.sign(userForToken, process.env.JWT_SECRET) };
      return token;
    },
  },

  Book: {
    author: async (root, args) => Author.findById(root.author),
  },

  Author: {
    bookCount: async (root, args) =>
      (await Author.findById(root.id)).books.length,
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { WebSocketServer } = require('ws');
const { useServer } = require('graphql-ws/lib/use/ws');

// setup is now within a function
const start = async () => {
  const app = express();
  const httpServer = http.createServer(app);

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/',
  });

  const schema = makeExecutableSchema({ typeDefs, resolvers });
  const serverCleanup = useServer({ schema }, wsServer);

  const server = new ApolloServer({
    schema: makeExecutableSchema({ typeDefs, resolvers }),
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });

  await server.start();

  app.use(
    '/',
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const auth = req ? req.headers.authorization : null;
        if (auth && auth.startsWith('Bearer ')) {
          const decodedToken = jwt.verify(
            auth.substring(7),
            process.env.JWT_SECRET
          );
          const currentUser = await User.findById(decodedToken.id);
          return { currentUser };
        }
      },
    })
  );

  const PORT = 4000;

  httpServer.listen(PORT, () =>
    console.log(`Server is now running on http://localhost:${PORT}`)
  );
};

start();

// startStandaloneServer(server, {
//   listen: { port: 4000 },
//   context: async ({ req, res }) => {
//     const auth = req ? req.headers.authorization : null;
//     if (auth && auth.startsWith('Bearer ')) {
//       const decodedToken = jwt.verify(
//         auth.substring(7),
//         process.env.JWT_SECRET
//       );
//       // console.log(`authenticated user "${decodedToken.username}"`);
//       // TODO: Error handling if user removed since jwt
//       const currentUser = await User.findById(decodedToken.id);
//       return { currentUser };
//     }
//   },
// }).then(({ url }) => {
//   console.log(`Server ready at ${url}`);
// });
