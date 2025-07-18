const users = [
    { id: 1, userName: "Bond" }
];
export const addUser = (user) => {
    if (users.findIndex(elem => elem.id === user.id) === -1) {
        users.push(user);
        return true;
    }
    return false;
};
export const getAllUsers = () => [...users];
export const getUser = (userId) => {
    return users.find(user => user.id === userId) || null;
};
export const updateUser = (newUserData) => {
    const index = users.findIndex(user => user.id === newUserData.id);
    if (index !== -1) {
        users[index] = newUserData;
        return true;
    }
    return false;
};
export const removeUser = (userId) => {
    const index = users.findIndex(user => user.id === userId);
    if (index !== -1) {
        const [res] = users.splice(index, 1);
        return res;
    }
    return null;
};
