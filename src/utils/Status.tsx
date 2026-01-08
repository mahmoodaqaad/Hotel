import { BiCheckCircle, BiXCircle } from "react-icons/bi"
import { CiClock2 } from "react-icons/ci"

export const Status = (status: string, no: string, yes: string, bg = true) => {

    return <div className={`text-white rounded flex items-center gap-1  px-2 py-2 capitalize w-fit mx-auto font-semibold ${bg &&(status === no ? "bg-red-500" : status === yes ? "bg-green-500" : "bg-blue-600")}`}>

        <p className='text-xl'>

            {status === no ? <BiXCircle /> : status === yes ? <BiCheckCircle /> : <CiClock2 />
            }
        </p>
        {status}
    </div>
}