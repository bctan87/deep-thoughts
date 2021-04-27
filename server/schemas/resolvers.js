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
        
    }
  };
  
  module.exports = resolvers;