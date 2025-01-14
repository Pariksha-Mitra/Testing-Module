import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function useAuth() {
  const { data: session } = useSession();

  const [isSignedIn,setIsSignedIn] = useState<boolean>()
  const [role,setRole] = useState()

  useEffect(() => {
    if(!session) setIsSignedIn(false)
    else {
        setRole(session.user.role)
    }
  },[session,setRole])

  return {
    isSignedIn,
    role
  }
  
}
