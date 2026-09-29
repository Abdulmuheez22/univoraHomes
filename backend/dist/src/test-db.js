import env from '../config/env';
import { drizzle } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { usersTable } from './db/schema';
export const db = drizzle(env.dbURL);
async function main() {
    const user = {
        fullName: 'Abdulmuheez Kannike',
        role: 'landlord', // Must be 'landlord', 'tenant', or 'agent'
        email: 'abdulmuheezkannike@gmail',
        phoneNumber: '08012345678',
        state: 'Lagos',
        city: 'Ikeja',
        password: 'secure_password_123', // In a real app, hash this before saving!
    };
    await db.insert(usersTable).values(user);
    console.log('New user created!');
    const users = await db.select().from(usersTable);
    console.log('Getting all users from the database: ', users);
    /*
    const users: {
      id: number;
      name: string;
      age: number;
      email: string;
    }[]
    */
    await db
        .update(usersTable)
        .set({
        city: 'Victoria Island',
    })
        .where(eq(usersTable.email, user.email));
    console.log('User info updated!');
    await db.delete(usersTable).where(eq(usersTable.email, user.email));
    console.log('User deleted!');
}
// main();
//# sourceMappingURL=test-db.js.map