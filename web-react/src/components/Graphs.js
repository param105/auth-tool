import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import CytoscapeComponent from 'react-cytoscapejs'

const GET_RECENT_REVIEWS_QUERY = gql`
  {
    Review(first: 10, orderBy: date_desc) {
      user {
        _id
        name
      }
      business {
        _id
        name
      }
      date {
        formatted
      }
      _id
      text
      stars
    }
  }
`

export default function Graphs() {
  const { loading, error, data } = useQuery(GET_RECENT_REVIEWS_QUERY)
  if (error) return <p>Error</p>
  if (loading) return <p>Loading</p>

  function getNode(id, label) {
    return {
      data: { id: id, label: label },
      position: {
        x: Math.floor(Math.random() * 900) + 50,
        y: Math.floor(Math.random() * 400) + 50,
      },
    }
  }

  function getElements() {
    const elements = []
    data.Review.map((review) => {
      elements.push(getNode(review._id, review._id))
      elements.push(getNode(review.business._id, review.business.name))
      elements.push(getNode(review.user._id, review.user.name))
      elements.push({
        data: { source: review._id, target: review.business._id },
      })
      elements.push({ data: { source: review._id, target: review.user._id } })
    })

    return elements
  }
  return (
    <div>
      <CytoscapeComponent
        elements={getElements()}
        style={{ width: '1000px', height: '600px' }}
      />
      ;
    </div>
  )
}
