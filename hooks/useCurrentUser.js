export default function useCurrentUser() {
    async function getUser() {
        const { userID } = await getCurrentUser();
        return userID;
    }
    let userID = getUser();
    return userID;
}