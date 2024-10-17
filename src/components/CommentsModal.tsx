"use client";

import { useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { FiSend } from "react-icons/fi";

export default function CommentsModal() {
  const [open, setOpen] = useState(true);

  return (
    <Dialog open={open} onClose={setOpen} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform h-[70vh] p-4 flex flex-col justify-between overflow-hidden rounded-lg bg-gray-200 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div className="h-full overflow-y-auto">Comments area</div>
            <div className="flex items-center justify-between gap-2 bg-gray-300 w-full p-2 rounded-md">
              <input
                className="bg-gray-300 w-full p-1"
                placeholder="Enter new Comment"
              />
              <FiSend  />
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
