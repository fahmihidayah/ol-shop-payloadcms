import { Endpoint } from 'payload'
import { productEndpoints } from '../../products/api'
import { checkoutEndpoints } from '../../checkout/api'
import { homeEndpoints } from '../../home/api'
import { addressEndpoint } from '../../account/api/addresses'

export const endpointsV1: Endpoint[] = [
  ...productEndpoints,
  ...checkoutEndpoints,
  ...homeEndpoints,
  ...addressEndpoint,
]
