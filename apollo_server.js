const { ApolloServer, gql } = require('apollo-server');
const {
    ApolloServerPluginLandingPageLocalDefault
} = require('apollo-server-core');
const { env } = require('process');
require('dotenv').config()
const { RESTDataSource } = require('apollo-datasource-rest');
// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
  # This "Movie" type defines the queryable fields for every movie in our data source.
  type Movie {
    title: String
    director: String
    posterUrl: String
    genres: [Genre!]
    id: ID!
  }

  type Genre {
    name: String!
  }


  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "movies" query returns an array of zero or more Movies (defined above).
  type Query {
    movies: [Movie]
  }
`;

class MoviesAPI extends RESTDataSource {
    constructor() {
      // Always call super()
      super();
      // Sets the base URL for the REST API
      this.baseURL = `http://localhost:${process.env.API_PORT}/`;
    }
    async getMovies() {
      // Send a GET request to the specified endpoint
      return this.get(`movies`);
    }
    async getMovie(id) {
        // Send a GET request to the specified endpoint
        return this.get(`movies/${id}`);
    }
}

class GenresAPI extends RESTDataSource {
    constructor() {
      // Always call super()
      super();
      // Sets the base URL for the REST API
      this.baseURL = `http://localhost:${process.env.API_PORT}/`;
    }
    async getGenres() {
      // Send a GET request to the specified endpoint
      return this.get(`genres`);
    }
    async getMovie(id) {
        // Send a GET request to the specified endpoint
        return this.get(`genres/${id}`);
    }
}

const resolvers = {
    Query: {
        movies: async (_, { }, { dataSources }) => {
            return dataSources.moviesAPI.getMovies();
        },
    },
    Movie: {
        movies(parent) {
            return books.filter(book => book.branch === parent.branch);
        }
    },
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: true,
    plugins: [
      ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ],
    dataSources: () => {
      return {
        moviesAPI: new MoviesAPI(),
        genresAPI: new GenresAPI()
      };
    },
  });

// The `listen` method launches a web server.
server.listen({port: process.env.APOLLO_PORT}).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
