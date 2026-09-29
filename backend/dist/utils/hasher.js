import bcrypt from 'bcrypt';
export async function hashPassword(password) {
    return await bcrypt.hash(password, 10);
}
export function confrimHashPassword(myPlaintextPassword, hash) {
    return bcrypt.compare(myPlaintextPassword, hash);
}
//# sourceMappingURL=hasher.js.map