"use server";
import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();
export async function GET(request: NextRequest){
    revalidatePath("/home");
    try {
        const videos = await prisma.video.findMany({
            orderBy: {
                createdAt: "desc"
            }
        })
        return NextResponse.json({status: true, videos}, {status: 201});
    } catch (error) {
        return NextResponse.json({status: false, error: "Fetching videos failed"}, {status: 500});
    }finally{
       await prisma.$disconnect();
    }
}