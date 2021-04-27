// three schemas but only two actual models being made, as reactions will be nested inside thoughts
const User = require('./User');
const Thought = require('./Thought');

module.exports = { User, Thought };
