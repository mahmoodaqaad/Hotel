import { varfiyMyAccount } from '@/utils/verfiyToken'
import HeaderClient from './HeaderClient'

const Header = async () => {
    const user = await varfiyMyAccount()

    return (
        <HeaderClient user={user} />
    )
}

export default Header
