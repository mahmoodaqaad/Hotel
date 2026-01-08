import React from 'react'
import AddForm from './AddForm'
import AuthGuardPage from '@/components/Auth/AuthGuard/AuthGuard'

const page = () => {

  return (
    <AuthGuardPage allowedRole={["SuperAdmin", "Admin"]}>

      <section className='vh-dash flex justify-center items-center'  >
        <AddForm />

      </section>
    </AuthGuardPage>
  )
}

export default page
