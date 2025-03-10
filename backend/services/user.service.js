export function createUser(name, email) {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
        return new Error("Пользователь с таким email уже существует"); //todo CustomErr(400, "...")
    }

    const user = await User.create({ name, email });

    return user;
}