export function secondsToDays(seconds) {
    const secondsInDay = 86400; 
    return seconds / secondsInDay;
}

export function DaysToSeconds(days) {
    const secondsInDay = 86400;
    return secondsInDay * days;
}

export function formatTokenAmount(weiAmount: number, decimals: number): string {
    const tokenAmount = weiAmount / Math.pow(10, decimals)
    return tokenAmount.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })
}

export function calculateDaysLeft(deadline: number): number {
    const currentTime = Math.floor(Date.now() / 1000);
    return Math.max(0, Math.ceil((deadline - currentTime) / 86400));
};