"use client";
import Image from "next/image";
import { ChangeEvent, useState } from "react";
import { Label } from "../label";
import { nanoid } from "nanoid";
import { XCircle } from "lucide-react";

export const ChooseImageButton = ({
  fileUrl,
  onImageChanged,
}: {
  fileUrl: string | null;
  onImageChanged: (file: File | null) => void;
}) => {
  const id = nanoid();
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0)
      onImageChanged(e.target.files[0]);
  }

  return (
    <div className="w-[100px] h-[80px] relative">
      <Image
        width={0}
        height={0}
        sizes="100vw"
        src={fileUrl || "/default-product-img.jpg"}
        alt="image"
        className="w-full h-full border rounded-sm"
      />
      {!fileUrl || fileUrl.length === 0 ? (
        <>
          <Label
            htmlFor={id}
            className="absolute top-0 left-0 flex items-center justify-center w-full h-full hover:cursor-pointer text-gray-600"
          >
            + Image
          </Label>
          <input
            id={id}
            type="file"
            onChange={handleChange}
            className="hidden"
            accept="image/*"
          />
        </>
      ) : (
        <XCircle
          size={16}
          fill="red"
          color="white"
          className="absolute top-[-8px] right-[-8px] hover:cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            onImageChanged(null);
          }}
        />
      )}
    </div>
  );
};
