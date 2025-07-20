
export type User =
    {
        id: number,
        userName: string
    }

    const users:User[] = [
        {id:1, userName:"Bond"}
    ]

export const addUser = (user:User):boolean => {
    if(users.findIndex(elem => elem.id === user.id) === -1)
    {
        users.push(user)
        return true
    }
    return false
}

export const getAllUsers = () => [...users];

export const getUser = (userId: number): User | null => {
    return users.find(user => user.id === userId) || null;
};

export const updateUser = (newUserData:User):boolean => {
    const index = users.findIndex(user => user.id === newUserData.id);
    if (index !== -1) {
        users[index] = newUserData
        return true
    }
    return false
}

export const removeUser = (userId:number) => {
    const index = users.findIndex(user => user.id === userId);
    if (index !== -1) {
            const res = users.splice(index, 1)
            return res[0]
    }
        return null
}
