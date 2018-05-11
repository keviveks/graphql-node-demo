const { GraphQLServer } = require('graphql-yoga');

let links = [{
  id: 'link-0',
  description: 'link demo description',
  url: 'graphql.com'
},
{
  id: 'link-1',
  description: 'link 1 demo description',
  url: 'link1.com'
}];

let idCount = links.length;

const getLinkByID = (id) => {
  let single = links.filter((link) => {
    return (link.id === id);
  });
  return single[0];
}

const getLinkIndexById = (id) => {
  return links.findIndex(link => link.id === id);
}

/**
 * resolvers: is the actual implementation of GraphQL schema
 * it should be indentical structure of type definision in typeDefs
 * 
 * root(parent) is the result for previous resolver execution level
 * 1st level - invokes feed resolver (turns entire links data)
 * 2nd execution level - invokes the resolver of links type schema
 * 
 * args - carries the arguments passed to the resolver
 */
const resolvers = {
  Query: {
    info: () => 'This is the API of Hackernoon clone',
    feed: () => links,
    link: (root, args) => getLinkByID(args.id)
  },

  Mutation: {
    createLink: (root, args) => {
      const link = {
        id: `link-${idCount++}`,
        description: args.description,
        url: args.url,
      }
      links.push(link);
      return link;
    },

    updateLink: (root, args) => {
      let index = getLinkIndexById(args.id);
      if (index > -1) {
        let link = getLinkByID(args.id);
        links[index] = Object.assign(link, args);
        return links[index];
      }
      return null;
    },

    deleteLink: (root, args) => {
      let index = getLinkIndexById(args.id);
      if (index > -1) {
        links.splice(index, 1);
        return links;
      }
      return null;
    }
  },

  Link: {
    id: (root) => root.id,
    description: (root) => root.description,
    url: (root) => root.url
  }
}

/**
 * typeDefs & resolvers are bundled up in GraphQL server
 * this tells the server to accept API operations and how to resolve that
 */
const server = new GraphQLServer({
  typeDefs: 'src/schema.graphql',
  resolvers
});

server.start(() => console.log('Server is running on http://localhost:4000'));