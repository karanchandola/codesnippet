import { user } from "@/models/user.js";
import connection from "@/lib/dbconnect";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request){
    try {
        connection();
        const {username, email, password} = await request.json();
        const existingUser = await user.findOne({ email });
            if (existingUser) {
                return NextResponse.json({ message: 'User already exists'});
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            // Create new user
            if (!username || !email || !password) {
                return NextResponse.json({ error: 'All fields are required', status: 400 });
            }
            const User = new user({
                username,
                email,
                password: hashedPassword,
            });
            await User.save();

            return NextResponse.json({ message: 'User created successfully', user: User ,status: '201' });
        
    } catch (e) {
        console.error(e);
        return NextResponse.json({error: 'error in server', status: 500});
    }
}