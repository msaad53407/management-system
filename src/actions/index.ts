"use server";
//This File exports server side functions. Do not export functions from this file just to be able to import them in another file. Any function exported from this file becomes a POST API endpoint;
import { revalidatePath as nextRevalidatePath } from "next/cache";

export async function revalidatePath(path: string) {
  nextRevalidatePath(path);
}
