"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { readText } from "@/utils";

export interface ProfileState {
   ok: boolean;
   errors?: { name?: string; phone?: string; address?: string; form?: string };
}

export async function updateProfile(_prevState: ProfileState, formData: FormData): Promise<ProfileState> {
   const user = await getCurrentUser();
   if (!user) return { ok: false, errors: { form: "Sign in to edit your profile." } };

   const name = readText(formData, "name");
   const phone = readText(formData, "phone");
   const address = readText(formData, "address");

   const errors: NonNullable<ProfileState["errors"]> = {};
   if (name.length < 2) errors.name = "Enter your name.";
   if (phone && phone.replace(/\D/g, "").length < 7) errors.phone = "Enter a valid phone number or leave it empty.";
   if (address.length > 300) errors.address = "Keep the address under 300 characters.";
   if (Object.keys(errors).length > 0) return { ok: false, errors };

   await prisma.user.update({
      where: { id: user.id },
      data: { name, phone: phone || null, address: address || null },
   });

   revalidatePath("/account");
   return { ok: true };
}
