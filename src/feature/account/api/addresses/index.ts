import { Endpoint } from 'payload'
import { getListAddressEndpoint } from './get-list-address-api'
import { createAddressEndpoint } from './create-address-api'
import { deleteAddressEndpoint } from './delete-address-api'

export const addressEndpoint: Endpoint[] = [
  getListAddressEndpoint,
  createAddressEndpoint,
  deleteAddressEndpoint,
]
