// const fetch = require('node-fetch')
const parse = require('csv-parse/lib/sync')
const gql = require('graphql-tag')
import fs from 'fs'
import path from 'path'

export const getSeedMutations = async () => {
  // 'https://cdn.neo4jlabs.com/data/grandstack_businesses.csv'
  //const res = await fetch(
  // 'https://localhost:3000/localapi/src/seed/grandstack_data.csv'
  //)
  const res = fs.readFileSync(path.join(__dirname, 'grandstack_data.csv'))
  const body = res
  const records = parse(body, { columns: true })
  const mutations = generateMutations(records)

  return mutations
}

const generateMutations = (records) => {
  return records.map((rec) => {
    return {
      mutation: gql`
        mutation mergeAll(
          $domainId: ID!
          $domainName: String
          $frameworkId: ID!
          $frameworkName: String
          $languageId: ID!
          $languageName: String
        ) {
          domain: MergeDomain(domainId: $domainId, name: $domainName) {
            domainId
          }

          framework: MergeFramework(
            frameworkId: $frameworkId
            name: $frameworkName
          ) {
            frameworkId
          }

          language: MergeLanguage(
            languageId: $languageId
            name: $languageName
          ) {
            languageId
          }

          domainFramework: MergeDomainFrameworks(
            from: { frameworkId: $frameworkId }
            to: { domainId: $domainId }
          ) {
            from {
              frameworkId
            }
          }

          frameworkLanguage: MergeFrameworkLanguages(
            from: { languageId: $languageId }
            to: { frameworkId: $frameworkId }
          ) {
            from {
              languageId
            }
          }
        }
      `,
      variables: rec,
    }
  })
}
