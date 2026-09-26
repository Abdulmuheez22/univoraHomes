import bcrypt from 'bcrypt';



export async function hashPassword  (password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
}

export function confrimHashPassword(myPlaintextPassword: string, hash: string): Promise<boolean> {
   return bcrypt.compare(myPlaintextPassword, hash)
}