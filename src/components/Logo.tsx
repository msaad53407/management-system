"use client";

import upload from "@/actions/upload";
import useFormAction from "@/hooks/useFormAction";
import Image from "next/image";
import { useState } from "react";
import InfoMessageCard from "./InfoMessageCard";
import SubmitButton from "./SubmitButton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { useCheckRole } from "@/hooks/useCheckRole";

const Logo = () => {
  const imagePath = `/upload/logo.png`;
  const [imageSrc, setImageSrc] = useState(imagePath);

  const checkRoleClient = useCheckRole();

  const { formAction, setInfoMessage, infoMessage } = useFormAction(upload);

  return (
    <>
      {checkRoleClient("grand-administrator") ? (
        <Dialog>
          <DialogTrigger>
            <Image
              src="/upload/logo.png"
              width={100}
              height={100}
              quality={100}
              alt="logo"
              priority
              className="object-cover w-32 rounded-xl"
            />
          </DialogTrigger>
          <DialogContent className="min-h-20" aria-describedby="dialog">
            {infoMessage.message && (
              <InfoMessageCard
                message={infoMessage.message}
                clearMessage={setInfoMessage}
                variant={infoMessage.variant}
              />
            )}
            <DialogTitle className="sr-only">
              A Dialog from where Grand Administrator can change logo
            </DialogTitle>
            <DialogDescription className="sr-only">
              A Dialog from where Grand Administrator can change logo
            </DialogDescription>
            <form
              className="flex flex-col gap-5 items-center"
              action={formAction}
            >
              <Image
                src={imageSrc}
                width={100}
                height={100}
                quality={100}
                alt="logo"
                className="object-cover w-32 rounded-xl"
              />
              <p className="text-xs text-slate-600">Max Size 5MB</p>
              <div className="flex gap-2">
                <Input
                  type="file"
                  name="file"
                  required
                  onChange={(e) =>
                    setImageSrc(URL.createObjectURL(e.target.files![0]))
                  }
                />
                <SubmitButton>Change logo</SubmitButton>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      ) : (
        <Image
          src="/upload/logo.png"
          width={100}
          height={100}
          quality={100}
          alt="logo"
          priority
          className="object-cover w-32 rounded-xl"
        />
      )}
    </>
  );
};

export default Logo;
