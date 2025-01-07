import React, { Suspense } from 'react'
import NewPassword from './NewPassword'

const NewPass = () => {
  return (
    
      <Suspense fallback={"Loading..."}>
          <NewPassword />
      </Suspense>
    
  )
}

export default NewPass
