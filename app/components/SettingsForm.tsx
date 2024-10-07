"use client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "./SubmitButtons";
import { useFormState } from "react-dom";
import { SettingsAction } from "../actions";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { settingsSchema } from "../lib/zodSchemas";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { UploadDropzone } from "../lib/uploadthing";
import { toast } from "sonner";

interface iAppProps {
  fullName : string; 
  email : string; 
  profileImage : string;
}

export function SettingsForm({email, fullName, profileImage}:iAppProps) {
  const [lastResult, action] = useFormState(SettingsAction, undefined);
  const [currentProfileImage, setCurrentProfileImage] = useState(profileImage);
  const [form, fields] = useForm({
    lastResult, 

    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: settingsSchema,
      });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  const handleDeleteImage = () => {
    setCurrentProfileImage("");
  }

  return(
    <Card>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
        <CardDescription>Manage your account settings</CardDescription>
      </CardHeader>
      
      <form id={form.id} onSubmit={form.onSubmit} action={action}>
        <CardContent className="flex flex-col gap-y-4">
          <div className="flex flex-col gap-y-2">
            <Label className="text-lg">Full Name</Label>
            <Input name={fields.fullName.name} key={fields.fullName.key} defaultValue={fullName} placeholder="Hunter joe"/>
            <p className="text-red-500 text-sm">{fields.fullName.errors}</p>
          </div>
          <div className="flex flex-col gap-y-2">
            <Label className="text-lg">Email</Label>
            <Input disabled defaultValue={email} placeholder="example@gmail.com" />
          </div>
          <div className="grid gap-y-5">
            <Label className="text-lg">Profile Image</Label>
            <input 
              type="hidden" 
              name={fields.profileImage.name} 
              key={fields.profileImage.key}
              value={currentProfileImage}
            />
            {currentProfileImage ? (
              <div className="relative size-16">
                <img src={currentProfileImage} alt="Profile Image" className="size-16 rounded-full mt-2" />
                <Button onClick={handleDeleteImage} type="button" variant="destructive" size="icon" className="absolute -top-3 -right-3">
                  <X className="size-4"/>
                </Button>
              </div>
            ) : (
              <UploadDropzone 
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                  setCurrentProfileImage(res[0].url);
                  toast.success("Profile Image has been uploaded");
                }}
                onUploadError={(error) => {
                  console.log("Something went worng", error);
                  toast.error(error.message);
                }}  
              />
            )}
            <p className="text-red-500 text-sm">{fields.profileImage.errors}</p>
          </div>
        </CardContent>
        <CardFooter>
          <SubmitButton text="Save Changes" className="font-semibold"/>
        </CardFooter>
      </form>
    </Card>
  )
}
