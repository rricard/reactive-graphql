/* @flow */

import {
  GraphQLDirective,
  DirectiveLocation,
} from 'graphql'

export const LiveDirective = new GraphQLDirective({
  name: 'live',
  description:
    'Tells to observe that field for future updates via the reactive websocket',
  locations: [
    DirectiveLocation.FIELD,
  ],
})
