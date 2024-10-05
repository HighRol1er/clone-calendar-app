// this file will store all of server actions
"use server";

import prisma from "./lib/db";
import { requireUser } from "./lib/hooks";
import { parseWithZod } from '@conform-to/zod';
import { onboardingSchema, onboardingSchemaValidation, settingsSchema } from "./lib/zodSchemas";
import { redirect } from "next/navigation";

export async function OnboardingAction(prevState: any,formData: FormData) {
  const session = await requireUser();

  // validate in server side
  const submission = await parseWithZod(formData, {
    schema: onboardingSchemaValidation({
      async isUsernameUnique() {
        const existingUsername = await prisma.user.findUnique({
          where: {
            username: formData.get("username") as string,
          },
        });

        return !existingUsername;
      },
    }),
    async: true,
  });

  if(submission.status !== "success") {
    return submission.reply();
  }

  const data = await prisma.user.update({
    where: {
      id: session.user?.id,
    },
    data: {
      username: submission.value.username,
      name: submission.value.fullName,
    },
  });

  // fullName & username set redirect to dashboard page
  return redirect("/onboarding/grant-id");
}

export async function SettingsAction(prevState:any, formData: FormData) {
  const session = await requireUser();

  const submission = parseWithZod(formData, {
    schema: settingsSchema,
  });

  if(submission.status !== "success") {
    return submission.reply();
  }

  const user = await prisma.user.update({
    where: {
      id: session.user?.id,
    },
    data: {
      name: submission.value.fullName,
      image: submission.value.profileImage,
    },
  });

  return redirect("/dashboard");
}