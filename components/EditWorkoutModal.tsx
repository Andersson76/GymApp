"use client";

import { Dialog, Transition } from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";
import { FormData } from "@/types/FormData";
import { Fragment, useState } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (form: FormData) => void;
  initialData: FormData;
};

export default function EditModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: Props) {
  const [form, setForm] = useState<FormData>(initialData);
  return (
    <AnimatePresence>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={onClose} static>
          <div className="fixed inset-0 bg-black/30" />

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-md rounded-xl bg-white border border-gray-200 p-6 shadow-lg"
            >
              <Dialog.Title className="text-center text-xl font-medium mb-4">
                Redigera träningspass
              </Dialog.Title>

              <form
                className="space-y-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  onSave(form);
                }}
              >
                <input
                  type="text"
                  placeholder="Titel"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
                <input
                  type="number"
                  placeholder="Minuter"
                  value={form.duration}
                  onChange={(e) =>
                    setForm({ ...form, duration: Number(e.target.value) })
                  }
                  className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
                <textarea
                  placeholder="Beskrivning (valfritt)"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />

                <div className="flex justify-between mt-6">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded border text-gray-700 hover:bg-gray-100 transition"
                  >
                    Avbryt
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 transition"
                  >
                    Spara
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </Dialog>
      </Transition>
    </AnimatePresence>
  );
}
