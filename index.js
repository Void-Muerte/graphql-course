const {ApolloServer,gql} = require('apollo-server');
const Users = require('./users');

const typeDefs = gql`
type Query{
    greet:String
    users:[User],
    user(id:ID!):User
}
type User{
    id:ID!
    firstName:String!
    lastName:String!
    email:String!
}
`

const resolvers = {
    Query:{
        greet:()=>{
            return 'hello world'
        },
        users:()=>Users,
        user:(parent,{id}, context)=>{
            console.log(id);
            return Users.find(item=>item.id==id)
        }
    }
}


const server = new ApolloServer({typeDefs, resolvers});


// The listen method lauches a web server
server.listen().then(({url})=>{
    console.log(`Server ready at ${url}`);
})