const {ApolloServer,gql} = require('apollo-server');
const Users = require('./users');
const Todos = require("./todos");
const {randomUUID} = require("crypto");

const typeDefs = gql`
type Query{
    greet:String
    users:[User],
    user(id:ID!):User
}
input InputUser{
    firstName:String!
    lastName:String!
    email:String!
    password:String!
}
type Todo{
    title:String!
    by:ID!
}
type User{
    id:ID!
    firstName:String!
    lastName:String!
    email:String!
    todos:[Todo]
}
type Mutation{
    createUser(newUser:InputUser!):User
}
`

const resolvers = {
    Query:{
        greet:()=>{
            return 'hello world'
        },
        users:()=>Users,
        user:(parent,{id}, {userLoggedIn})=>{
            if(!userLoggedIn){
                throw new Error("User needs to log in!");
            }
            return Users.find(item=>item.id==id)
        }
    },
    User:{
        todos:(parent)=>{
            return Todos.filter(todo=>todo.by==parent.id);
        }
    },
    Mutation:{
        createUser:(_, {newUser})=>{
            const createdUser = {id:randomUUID(), ...newUser};
            Users.push({...createdUser});
            return createdUser;
        }
    }
}


const server = new ApolloServer({typeDefs, resolvers,context:{userLoggedIn:true}});


// The listen method lauches a web server
server.listen().then(({url})=>{
    console.log(`Server ready at ${url}`);
})