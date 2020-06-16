import React, { useEffect } from 'react'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import CytoscapeComponent from 'react-cytoscapejs'

const GET_LANG_DATA_QUERY = gql`
  {
    Domain {
      domainId
      name
      frameworks {
        frameworkId
        name
        languages {
          languageId
          name
        }
      }
    }
  }
`

export default function Graphs() {
  const { loading, error, data } = useQuery(GET_LANG_DATA_QUERY)
  let cyComp
  const setNodeClickListener = () => {
    if (cyComp !== undefined) {
      cyComp.removeListener('click')
      cyComp.on('click', 'node', () => {
        //alert( event.target.id() + ' clicked')
      })
    }
  }

  useEffect(() => {
    setNodeClickListener()
  })

  if (error) return <p>Error</p>
  if (loading) return <p>Loading</p>

  function getNode(id, label, color) {
    return {
      data: { id: id, label: label, color: color },
      position: {
        x: Math.floor(Math.random() * 900) + 50,
        y: Math.floor(Math.random() * 400) + 50,
      },
    }
  }

  function getElements() {
    const elements = []
    data.Domain.map((domain) => {
      elements.push(getNode(domain.domainId, domain.name, '#FF5733'))

      domain.frameworks.map((framework) => {
        elements.push(getNode(framework.frameworkId, framework.name, '#33FF49'))
        elements.push({
          data: { source: framework.frameworkId, target: domain.domainId },
        })

        framework.languages.map((language) => {
          elements.push(getNode(language.languageId, language.name, '#3342FF'))
          elements.push({
            data: {
              source: language.languageId,
              target: framework.frameworkId,
            },
          })
        })
      })
    })
    return elements
  }

  return (
    <div>
      <div>
        {' '}
        <h3>
          {' '}
          Graph designed using Cytoscape-reactjs. Data being fetched from neo4j
          database hosted on neo4j local desktop apollo graphql server{' '}
        </h3>{' '}
      </div>
      <div>
        <div>
          <button
            style={{
              color: '#FFFFFF',
              backgroundColor: '#3342FF',
              padding: '0.2rem',
              margin: '0.2rem',
            }}
          >
            {' '}
            LANGUAGE{' '}
          </button>
          <button
            style={{
              backgroundColor: '#33FF49',
              padding: '0.2rem',
              margin: '0.2rem',
            }}
          >
            {' '}
            FRAMEWORK{' '}
          </button>
          <button
            style={{
              backgroundColor: '#FF5733',
              padding: '0.2rem',
              margin: '0.2rem',
            }}
          >
            {' '}
            DOMAIN{' '}
          </button>
        </div>
        <CytoscapeComponent
          cy={(cy) => {
            cyComp = cy
          }}
          elements={getElements()}
          layout={{ name: 'circle', padding: 10 }}
          style={{ width: '1300px', height: '550px' }}
          stylesheet={[
            {
              selector: 'node',
              style: {
                height: 80,
                width: 80,
                backgroundFit: 'cover',
                borderColor: 'data(color)',
                borderWidth: 10,
                borderOpacity: 0.8,
                label: 'data(label)',
              },
            },
            {
              selector: 'edge',
              style: {
                width: 4,
              },
            },
          ]}
        />
        ;
      </div>
    </div>
  )
}
