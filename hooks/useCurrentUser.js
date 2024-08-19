import { getCurrentUser } from "aws-amplify/auth";
export default function useCurrentUser() {
    async function getUser() {
        const { userId } = await getCurrentUser();
        return userId;
    }
    let userID = getUser();
    return userID;
}