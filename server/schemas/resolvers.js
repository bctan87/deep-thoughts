const { signToken } = require('../utils/auth');
const { AuthenticationError } = require('apollo-server-express');
const { User, Thought } = require('../models');

const resolvers = {
    Query: {

        // pass in the parent as more of a placeholder parameter so we can access the username argument from the second parameter
        thoughts: async (parent, { username }) => {

            // a ternary operator to check if username exist
            const params = username ? { username } : {};

            // if it does, set params to an object with a username key set to that value
            return Thought.find(params).sort({ createdAt: -1 });
        },

        // place this inside of the `Query` nested object right after `thoughts` 
        thought: async (parent, { _id }) => {
            return Thought.findOne({ _id });
        },

        // get all users
        users: async () => {
            return User.find()
            .select('-__v -password')
            .populate('friends')
            .populate('thoughts');
        },

        // get a user by username
        user: async (parent, { username }) => {
            return User.findOne({ username })
            .select('-__v -password')
            .populate('friends')
            .populate('thoughts');
        },

    },

    Mutation: {

        // User model creates a new user in the database with whatever is passed in as the args
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);
          
            return { token, user };
        },

        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });
          
            if (!user) {
              throw new AuthenticationError('Incorrect credentials');
            }
          
            const correctPw = await user.isCorrectPassword(password);
          
            if (!correctPw) {
              throw new AuthenticationError('Incorrect credentials');
            }
          
            const token = signToken(user);
            return { token, user };
          }

    }

  };
  
  module.exports = resolvers;