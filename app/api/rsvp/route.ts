import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export const runtime = "nodejs"; // PENTING: jangan Edge
export const dynamic = "force-dynamic"; // PENTING: jangan di-prerender

type RSVPItem = {
  _id?: ObjectId;
  nama: string;
  hadir: string;
  jumlah: string;
  pesan: string;
  created_at?: string;
};

const getCollection = async () => {
  const client = await clientPromise;
  const dbName = process.env.MONGODB_DB || "undangan";
  const db = client.db(dbName);
  return db.collection<RSVPItem>("rsvp");
};

export async function GET() {
  try {
    const collection = await getCollection();
    const docs = await collection.find({}).sort({ created_at: 1 }).toArray();

    // convert ObjectId ke string biar aman dikirim ke client
    const cleaned = docs.map((d) => ({
      ...d,
      _id: d._id?.toString(),
    }));

    return NextResponse.json({
      success: true,
      data: cleaned,
    });
  } catch (err) {
    console.error("Error GET /api/rsvp:", err);
    return NextResponse.json(
      { success: false, message: "Gagal mengambil data RSVP" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as RSVPItem;

    if (!body.nama || !body.hadir) {
      return NextResponse.json(
        { success: false, message: "Nama dan status hadir wajib diisi" },
        { status: 400 }
      );
    }

    const newItem: RSVPItem = {
      nama: body.nama,
      hadir: body.hadir,
      jumlah: body.jumlah || "1",
      pesan: body.pesan || "-",
      created_at: new Date().toISOString(),
    };

    const collection = await getCollection();
    const result = await collection.insertOne(newItem);

    const saved = {
      ...newItem,
      _id: result.insertedId.toString(),
    };

    return NextResponse.json({
      success: true,
      message: "RSVP tersimpan di MongoDB",
      data: saved,
    });
  } catch (err) {
    console.error("Error POST /api/rsvp:", err);
    return NextResponse.json(
      { success: false, message: "Gagal menyimpan RSVP" },
      { status: 500 }
    );
  }
}
