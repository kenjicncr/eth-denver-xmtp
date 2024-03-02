import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useMemo, useState } from "react";
import { useContactList } from "../../../hooks/useContactList";
import {
  CachedConversation,
  CachedConversationWithId,
  ContentTypeMetadata,
} from "@xmtp/react-sdk";
import { Checkbox } from "../../ui/checkbox";
import { Button } from "../../ui/button";
import { classNames } from "../../../helpers";

interface ContactListSelectorProps {
  onContactSelected?: (contact: string) => void;
  onConfirm?: () => void;
  onOpen?: () => void;
  onClose: () => void;
  isOpen?: boolean;
}

export const ContactListSelector = ({
  isOpen,
  onClose,
  onOpen,
  onConfirm,
}: ContactListSelectorProps) => {
  const { contacts: _contacts, isLoaded, isLoading } = useContactList();

  const contacts = useMemo(() => {
    return _contacts;
  }, [_contacts]);

  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);

  const toggleContactSelection = (contactId: string) => {
    setSelectedContacts((prevSelected) => {
      const selectedArray = Array.isArray(prevSelected) ? prevSelected : [];
      if (selectedArray.includes(contactId)) {
        // If the contactId is already in the array, filter it out
        return selectedArray.filter((id) => id !== contactId);
      } else {
        // If the contactId is not in the array, add it
        return [...selectedArray, contactId];
      }
    });
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => onClose()}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95">
              <Dialog.Panel className="py-8 w-full max-w-lg transform overflow-hidden rounded-2xl bg-zinc-900 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg text-center font-medium leading-6">
                  Select a contact address
                </Dialog.Title>
                <div className="w-full py-2 mx-auto ">
                  {contacts.map((contact) => (
                    <div>
                      <Button
                        id={contact.peerAddress}
                        key={contact.peerAddress}
                        className={classNames(
                          `w-full rounded-none  border-[1px] border-b-zinc-900 h-12 text-left`,
                        )}
                        variant="ghost"
                        onClick={() =>
                          toggleContactSelection(contact.peerAddress)
                        }>
                        {contact.peerAddress}
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    className=" inline-flex justify-center rounded-md border-transparent bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2"
                    onClick={onConfirm}>
                    Accept
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border-transparent bg-red-500 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2"
                    onClick={onClose}>
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
