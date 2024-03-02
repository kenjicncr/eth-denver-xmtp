import { ResolvedAddress, AvatarUrlProps } from "./types";
import { Avatar } from "../Avatar/Avatar";
import { PlusCircleIcon } from "@heroicons/react/outline";
import { ContactsCombobox } from "./ContactsCombobox";
import { shortAddress } from "../../../helpers";

// Prop drilling, fix later
interface PayDestinatonAddressProps {
  resolvedAddress: ResolvedAddress | undefined;
  avatarUrlProps: AvatarUrlProps | undefined;
}

export const PayDestinatonAddress = ({
  resolvedAddress,
  avatarUrlProps,
}: PayDestinatonAddressProps) => {
  return (
    <div>
      {resolvedAddress?.displayAddress ? (
        <div className="mt-8 flex flex-col items-center">
          {resolvedAddress?.displayAddress && <Avatar {...avatarUrlProps} />}
          {resolvedAddress?.displayAddress && (
            <p className="mt-2 font-medium">
              {resolvedAddress.displayAddress && resolvedAddress.walletAddress
                ? resolvedAddress.displayAddress
                : shortAddress(resolvedAddress.displayAddress)}
            </p>
          )}
        </div>
      ) : (
        <div className="mt-8 flex flex-col items-center">
          <button className="relative hover:bg-gray-700 hover:-bg-opacity-80 rounded-full flex items-center justify-center overflow-hidden">
            <div>
              <Avatar />
            </div>
            <div className="absolute flex items-center justify-center w-full h-full bg-black bg-opacity-40 hover:bg-opacity-80">
              <PlusCircleIcon width={16} height={16} fill="#ffff" />
            </div>
          </button>
        </div>
      )}
    </div>
  );
};
