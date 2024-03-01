export interface HarpieAlertProps {
    isFlagged: Boolean
}

export const HarpieAlert = ({ isFlagged }: HarpieAlertProps) => {
    if (!isFlagged) {
        return null
    }
    return (
        <div className="border-red-500 border-4 rounded-lg">
            <div className='flex=1 text-center size-lg'>
                🚨 WARNING! 🚨
            </div>
            <p className="text-center">We've detected that this link may be involved in scams, fraud, or other illicit activity. To learn more about detection, visit the <a href="https://harpie.gitbook.io/welcome-to-the-harpie-docs/tech-and-security/harpies-anti-theft-tech" className="font-medium text-blue-600 underline dark:text-blue-500 hover:no-underline">harpie.io docs</a>
            </p>
        </div>
    )
}