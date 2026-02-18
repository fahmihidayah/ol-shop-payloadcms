import { Endpoint } from 'payload'
import { getListAddressEndpoint } from './get-list-address'
import { createAddressEndpoint } from './create-address'
import { deleteAddressEndpoint } from './delete-address'

export const addressEndpoint: Endpoint[] = [
  getListAddressEndpoint,
  createAddressEndpoint,
  deleteAddressEndpoint,
]
