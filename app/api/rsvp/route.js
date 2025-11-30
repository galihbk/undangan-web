import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export const runtime = "nodejs";

const filePath = path.join(process.cwd(), "data", "rsvp.json");

async function readRSVPFile() {
  try {
    const fileData = await fs.readFile(filePath, "utf8");
    return fileData ? JSON.parse(fileData) : [];
  } catch (err) {
    // jika file belum ada, balikin array kosong
    return [];
  }
}

export async function GET() {
  try {
    const existing = await readRSVPFile();
    return NextResponse.json({ success: true, data: existing });
  } catch (error) {
    console.error("Error baca RSVP:", error);
    return NextResponse.json(
      { success: false, message: "Gagal membaca RSVP" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const existing = await readRSVPFile();

    const newEntry = {
      ...body,
      created_at: new Date().toISOString(),
    };

    existing.push(newEntry);

    await fs.writeFile(filePath, JSON.stringify(existing, null, 2), "utf8");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error simpan RSVP:", error);
    return NextResponse.json(
      { success: false, message: "Gagal menyimpan RSVP" },
      { status: 500 }
    );
  }
}
