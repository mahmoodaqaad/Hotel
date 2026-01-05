import { DOMAIN } from "./consant"

export const getFetchAll = async (key: string, page: string | number = "1", search: string = "", sort: string = "", order: string = "asc", filter: string = "") => {
    let token = "";
    try {
        const { cookies } = await import("next/headers");
        const cookieStore = await cookies();
        token = cookieStore.get("jwt")?.value || "";
    } catch (e) {
        // Ignore error if not in App Router context
    }

    const response = await fetch(`${DOMAIN}/api/${key}?pageNumber=${page}&search=${search}&sort=${sort}&order=${order}&filter=${filter}`, {
        credentials: "include",
        headers: {
            Cookie: `jwt=${token}`
        }
    })
    return response
}

export const getFetchById = async (key: string, id: string | number) => {
    let token = "";
    try {
        const { cookies } = await import("next/headers");
        const cookieStore = await cookies();
        token = cookieStore.get("jwt")?.value || "";
    } catch (e) {
        // Ignore error if not in App Router context
    }

    const response = await fetch(`${DOMAIN}/api/${key}/${id}`, {
        credentials: "include",
        headers: {
            Cookie: `jwt=${token}`
        }
    })
    return response
}
