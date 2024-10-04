import { conformZodMessage } from '@conform-to/zod';
import {z} from 'zod';

export const onboardingSchema = z.object({
  fullName: z.string().min(3).max(150),
  username: z.string().min(3).max(150).regex(/^[a-zA-Z0-9-]+$/, {
    message: "Username can only contain letters, number and -",
  }),
});

export function onboardingSchemaValidation(options?: {
  isUsernameUnique: () => Promise<boolean>;
}) {
  return z.object({
    // fullName: z.string().min(3).max(150),
    username: z.string().min(3).max(150).regex(/^[a-zA-Z0-9-]+$/, {
      message: "Username can only contain letters, number and -",
    })
     /**
      * pipe: Schemas can be chained into validation "pipelines"
      * 데이터 검증 & 변환을 연속적으로 수행 가능하게 하는 메서드
      * */ 
    .pipe(
      z.string().superRefine((_, ctx) => {
        if(typeof options?.isUsernameUnique !== "function") {
          ctx.addIssue({
            code: "custom",
            message: conformZodMessage.VALIDATION_UNDEFINED,
            fatal: true,
          });
          return;
        }

        return options.isUsernameUnique().then((isUnique) => {
          if (!isUnique) {
            ctx.addIssue({
              code: "custom",
              message: "Username is already used",
            });
          }
        });
      })
    ),
    fullName: z.string().min(3).max(150),
  });
}
