import React from 'react'
import { Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Title from './Title'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'

const useStyles = makeStyles({
  depositContext: {
    flex: 1,
  },
  navLink: {
    textDecoration: 'none',
  },
})

const GET_BUSINESS_QUERY = gql`
  {
    Business {
      name
    }
  }
`

export default function BusinessCount() {
  const classes = useStyles()

  const { loading, error, data } = useQuery(GET_BUSINESS_QUERY)
  if (error) return <p>Error</p>
  return (
    <React.Fragment>
      <Title>Total Business</Title>
      <Typography component="p" variant="h4">
        {loading ? 'Loading...' : data.Business.length}
      </Typography>
      <Typography color="textSecondary" className={classes.depositContext}>
        Business found
      </Typography>
      <div>
        <Link to="/business" className={classes.navLink}>
          {/* View Business */}
        </Link>
      </div>
    </React.Fragment>
  )
}
