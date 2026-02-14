import { getCategories } from '@/feature/categories/actions'
import { NavbarClient } from './navbar-client'
import { getMeUser } from '@/lib/customer-utils'
import { getCart } from '@/feature/cart/actions'

export async function Navbar() {
  const categories = await getCategories()
  const user = await getMeUser()
  const cart = await getCart()

  return <NavbarClient categories={categories} customer={user.user} cart={cart} />
}
