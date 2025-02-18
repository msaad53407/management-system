import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { User } from "@/models/user";
import { connectDB } from "@/lib/db";
import { Member } from "@/models/member";

export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the endpoint
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occurred", {
      status: 400,
    });
  }

  // Do something with the payload
  // For this guide, you simply log the payload to the console
  const { id } = evt.data;
  const eventType = evt.type;

  try {
    await connectDB();
    if (eventType === "user.created") {
      const user = await User.create({
        email: evt.data.email_addresses[0].email_address,
        username: evt.data.username,
        role: evt.data.public_metadata?.role,
        clerkId: evt.data.id,
        avatar: evt.data.image_url || null,
      });
      if (!user) {
        return new Response("Error creating user", { status: 400 });
      }
    }

    if (eventType === "user.deleted") {
      const user = await User.findOneAndDelete({ clerkId: evt.data.id });
      await Member.findOneAndDelete({ userId: evt.data.id });
      if (!user) {
        return new Response("Error deleting user", { status: 400 });
      }
    }

    if (eventType === "user.updated") {
      const user = await User.findOneAndUpdate(
        { clerkId: evt.data.id },
        {
          email: evt.data.email_addresses[0].email_address,
          username: evt.data.username,
          role: evt.data.public_metadata?.role,
          avatar: evt.data.image_url || null,
        }
      );
      if (!user) {
        return new Response("Error updating user", { status: 400 });
      }

      const member = await Member.findOneAndUpdate(
        { userId: evt.data.id },
        {
          email: evt.data.email_addresses[0].email_address,
          role: evt.data.public_metadata?.role,
          photo: evt.data.image_url || null,
          firstName: evt.data.first_name,
          lastName: evt.data.last_name,
        },
        { new: true }
      );
      if (!member) {
        return new Response("Error updating member", { status: 400 });
      }
    }
  } catch (error) {
    return new Response("Error connecting to database" + error, {
      status: 500,
    });
  }

  return new Response("", { status: 200 });
}
