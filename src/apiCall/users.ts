import { DOMAIN } from "@/utils/consant";
import { getFetchAll, getFetchById } from "@/utils/FetchData";
import { notFound, redirect } from "next/navigation";

export const getUser = async (pageNumber: string | number, search: string = "", sort: string = "", order: string = "asc", filter: string = "") => {

    const response = await getFetchAll("users", pageNumber, search, sort, order, filter)
    if (response.status === 403) redirect("/dashboard/403")

    if (!response?.ok) {
        throw new Error("Failed to fetch articles")
    }
    return response.json();
}

export const getUserCount = async () => {
    const response = await fetch(`${DOMAIN}/api/users/count`)

    if (!response?.ok) {
        throw new Error("Failed to fetch User Count")
    }
    return response.json();

}
export const getSingleUser = async (id: string) => {

    const response = await getFetchById("users", id)
    if (response.status === 403) redirect("/dashboard/403")
    if (!response?.ok) {
        if (response.status !== 404) {

            throw new Error("Failed to fetch single user")
        }
        else {

            notFound()
        }
    }
    return response.json();
}