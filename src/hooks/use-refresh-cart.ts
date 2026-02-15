import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { revalidateCart } from '@/feature/cart/actions'

export default function useRefreshCart() {
  const pathname = usePathname()

  useEffect(() => {
    if (pathname === '/order/confirmation') {
      revalidateCart()
    }
  }, [pathname])
}
