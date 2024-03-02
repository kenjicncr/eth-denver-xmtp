export type ResolvedAddress = {
    displayAddress: string;
    walletAddress?: string;
}

export type AvatarUrlProps = {
    // What is the avatar url?
    url?: string;
    // Is the avatar url loading?
    isLoading?: boolean;
    // What's the address of this wallet?
    address?: string;
}