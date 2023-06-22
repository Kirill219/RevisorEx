import bcrypt from "bcrypt";

export async function hashUserPassword(value) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(value, salt);
    return hashedPassword;
}
