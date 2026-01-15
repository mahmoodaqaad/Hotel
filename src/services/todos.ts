import prisma from "@/utils/db";
import { serializePrisma } from "@/utils/serialize";

export const getMyTodos = async (userId: number) => {
    try {
        const todos = await prisma.todo.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" }
        });
        return serializePrisma(todos);
    } catch (error) {
        console.error("Error fetching todos:", error);
        return [];
    }
}
