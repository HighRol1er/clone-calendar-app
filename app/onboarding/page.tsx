"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormState } from "react-dom";
import { OnboardingAction } from "../actions";
import { useForm } from '@conform-to/react'
import { parseWithZod } from "@conform-to/zod";
import { onboardingSchema } from "../lib/zodSchemas";
import { SubmitButton } from "../components/SubmitButtons";

export default function OnboardingRoute() {
  // get data from server side
  const [lastResult, action] = useFormState(OnboardingAction, undefined); // react^19에선 useActionState라고 이름 바뀜
  
  // validate in client side
  const [form,fields] = useForm({
    lastResult,

    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: onboardingSchema,
      });
    },
    /**
     * shouldValidate : 각 input에 대한 유효성 검사
     * shouldReValidate : 각 input에 대한 유효성 검사, shouldValidate를 기본 값으로
     * onBlur : 사용자가 input 필드에서 focus를 떠날 때(필드에서 벗어날 때) 유효성 검사 시작
     * onInput : 사용자가 필드에 데이터를 입력할 때 실시간으로 유효성 검사 실행
     */
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput"
  });

  return (
    <div className="min-h-screen w-screen flex items-center justify-center">
      <Card className="max-w-[420px]">
        <CardHeader>
          <CardTitle>Welcome to Cal<span className="text-primary">App</span></CardTitle>
          <CardDescription>We need the following information to set up your profile!</CardDescription>
        </CardHeader>
        <form id={form.id} onSubmit={form.onSubmit} action={action} noValidate>
          <CardContent className="grid gap-y-5">
            <div className="grid gap-y-2">
              <Label>Full Name</Label>
              <Input 
                name={fields.fullName.name} 
                defaultValue={fields.fullName.initialValue}
                key={fields.fullName.key}
                placeholder="Hunter joe" 
              />
              <p className="text-red-500 text-sm">{fields.fullName.errors}</p>
            </div>
            <div className="grid-gap-y">
              <Label>Username</Label>
              <div className="flex rounded-md">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-muted bg-muted text-sm text-muted-foreground">
                  CalApp.com/
                </span>
                <Input
                  name={fields.username.name}
                  key={fields.username.key}
                  defaultValue={fields.username.initialValue} 
                  placeholder="example-user-1" 
                  className="rounded-l-none" 
                />
              </div>
              <p className="text-red-500 text-sm">{fields.username.errors}</p>
            </div>
          </CardContent>
          <CardFooter>
            <SubmitButton text="Submit" className="w-full"/>
          </CardFooter>
        </form>
      </Card>  
    </div>
  )
}