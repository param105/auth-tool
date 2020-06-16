import ApolloClient from 'apollo-client'
import dotenv from 'dotenv'
import fetch from 'node-fetch'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { getSeedMutations } from './seed-mutations'
import { onError } from 'apollo-link-error'
import { ApolloLink } from 'apollo-link'

dotenv.config()

const {
  GRAPHQL_SERVER_HOST: host,
  GRAPHQL_SERVER_PORT: port,
  GRAPHQL_SERVER_PATH: path,
} = process.env

const uri = `http://${host}:${port}${path}`

const errorLink = onError(({ graphQLErrors, networkError }) => {
  console.log(graphQLErrors)
  console.log(networkError)
})

const client = new ApolloClient({
  link: ApolloLink.from([errorLink, new HttpLink({ uri, fetch })]),
  cache: new InMemoryCache(),
})

const runMutations = async () => {
  const mutations = await getSeedMutations()
  console.log(mutations)
  let i = 0
  return Promise.all(
    mutations.map(({ mutation, variables }) => {
      console.log(++i)
      return client
        .mutate({
          mutation,
          variables,
        })
        .catch((e) => {
          console.log(e)
          throw new Error(e)
        })
    })
  )
}

runMutations()
  .then(() => {
    console.log('Database seeded!')
  })
  .catch((e) => console.error(e))
