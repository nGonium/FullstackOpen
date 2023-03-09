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

const url = process.env.MONGO_URI_DEV;
const PASSWORD = 'password';

mongoose
  .connect(url)
  .then(() => console.log(`Connected to MongoDB`))
  .catch((e) => console.error('failed to connect to MongoDB', e.message));

const typeDefs = `
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

const resolvers = {
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
      }
      const newBook = new Book({ ...args, author: author.id });
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

      return newBook.populate('author');
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
    bookCount: async (root, args) => await Book.count({ author: root.id }),
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req, res }) => {
    const auth = req ? req.headers.authorization : null;
    if (auth && auth.startsWith('Bearer ')) {
      const decodedToken = jwt.verify(
        auth.substring(7),
        process.env.JWT_SECRET
      );
      // console.log(`authenticated user "${decodedToken.username}"`);
      // TODO: Error handling if user removed since jwt
      const currentUser = await User.findById(decodedToken.id);
      return { currentUser };
    }
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
