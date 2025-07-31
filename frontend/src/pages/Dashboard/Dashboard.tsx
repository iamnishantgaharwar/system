import { useState } from "react"
import { Button } from "../../components/ui/button"
import { useAppSelector } from "../../store/hooks"


interface Data {
    message: string
    user: {
        sub: string,
        email: string,
        role: string[],
        fullname: string,
        iat: number,
        exp: number
    }
}

const Dashboard = () => {
    const [data, setData] = useState<Data | null>(null)

    const userData = useAppSelector(state => state.user.user)
  return (
    <div>
        Dashboard Page
        <Button ></Button>
        {userData?.role}
        {userData?.fullname}
    </div>
  )
}

export default Dashboard