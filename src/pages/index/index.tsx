import React, { useEffect } from 'react'
import './index.css'
import { useTranslation } from 'react-i18next'
import AccountForm from '@/components/AccountForm'

const Index = () => {
  const { t } = useTranslation()

  useEffect(() => {
    console.log('app created')
  }, [])
  return (
    <>
      <div className="flex items-center justify-center h-20 text-secondary"></div>
      <div className="flex items-center justify-center h-32 text-secondary">
        <AccountForm />
      </div>
    </>
  )
}

export default Index
