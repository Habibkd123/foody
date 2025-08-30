import { useRouter } from 'next/router'
import { useAuthStorage } from '@/hooks/useAuth'
import { useEffect } from 'react'

const useCheckAuth = () => {
  const router = useRouter()
  const { user } = useAuthStorage()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!user) {
      router.push('/login')
    }
  }, [])
}

export default useCheckAuth
