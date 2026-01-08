import { getRoomsCount } from "@/services/rooms"
import BookRoomTime from "@/components/WebSite/Home/BookRoomTime/BookRoomTime"
import Header from "@/components/WebSite/header/Header"
import Hero from "@/components/WebSite/Home/Hero/Hero"
import Rooms from "@/components/WebSite/Rooms/Rooms"

const HomePage = async () => {
    const count: number = await getRoomsCount()
    return (
        <div className="dark:bg-gray-700">
            <Header />
            <Hero />
            <div className="my-[-10px]  lg:w-2/3 w-11/12 mx-auto ">

                <BookRoomTime />
            </div>
            <div className="mt-8">

                <Rooms count={count} />
            </div>
        </div>
    )
}

export default HomePage
