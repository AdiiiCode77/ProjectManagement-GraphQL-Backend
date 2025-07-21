const Project = require("../models/Project");
const Client = require("../models/Client");
const {
  graphql,
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
  GraphQLEnumType,
} = require("graphql");

const Projecttype = new GraphQLObjectType({
  name: "Project",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    status: { type: GraphQLString },
    client: {
      type: Clienttype,
      resolve(parent, args) {
        return Client.findById(parent.clientId);
      },
    },
  }),
});

const Clienttype = new GraphQLObjectType({
  name: "Client",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    Projects: {
      type: new GraphQLList(Projecttype),
      resolve() {
        return Project.find();
      },
    },
    project: {
      type: Projecttype,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Project.findById(args.id);
      },
    },

    clients: {
      type: new GraphQLList(Clienttype),
      resolve() {
        return Client.find();
      },
    },
    client: {
      type: Clienttype,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Client.findById(args.id);
      },
    },
  },
});

const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addClient: {
      type: Clienttype,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        phone: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        const client = new Client({
          name: args.name,
          email: args.email,
          phone: args.phone,
        });
        return client.save();
      },
    },

    //Delete Client Mutation
    deleteClient: {
      type: Clienttype,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(parent, args) {
        return Client.findByIdAndDelete(args.id);
      },
    },

    //Add A Project Mutation
    addproject: {
      type: Projecttype,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: new GraphQLNonNull(GraphQLString) },
        status: {
          type: new GraphQLEnumType({
            name: "ProjectStatus",
            values: {
              new: { value: "Not Started" },
              progress: { value: "In Progress" },
              completed: { value: "Completed" },
            },
          }),
          defaultValue: "Not Started",
        },
        clientId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        const project = new Project({
          name: args.name,
          description: args.description,
          status: args.status,
          clientId: args.clientId,
        });
        return project.save();
      },
    },
  },

  //Delete Project Mutation
  deleteProject: {
    type: Projecttype,
    args: { id: { type: new GraphQLNonNull(GraphQLID) } },
    resolve(parent, args) {
      return Project.findByIdAndDelete(args.id);
    },
  },

  //Delete Project when Client is deleted
  deleteProjectByClient: {
    type: Projecttype,
    args: { clientId: { type: new GraphQLNonNull(GraphQLID) } },
    resolve(parent, args) {
      return Project.deleteMany({ clientId: args.clientId });
    },
  },

  //Update project Mutation
  updateProject: {
    type: Projecttype,
    args: {
      id: { type: new GraphQLNonNull(GraphQLID) },
      name: { type: GraphQLString },
      description: { type: GraphQLString },
      status: {
        type: new GraphQLEnumType({
          name: "ProjectStatusUpdate",
          values: {
            new: { value: "Not Started" },
            progress: { value: "In Progress" },
            completed: { value: "Completed" },
          },
        }),
      },
    },
    resolve(parent, args) {
      return Project.findByIdAndUpdate(
        args.id,
        {
          $set: {
            name: args.name,
            description: args.description,
            status: args.status,
          },
        },
        { new: true }
      );
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: mutation,
});
