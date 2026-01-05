export const IsSuperAdminOrAdminOrManagerPage = (role: string) => {
    const AllRole = [
        "SuperAdmin",
        "Admin",
        "Manager"
    ]

    if (AllRole.includes(role)) {
        return true
    }
    return false
}
