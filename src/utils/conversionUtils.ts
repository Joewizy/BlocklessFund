export function secondsToDays(seconds: number): number {
    const secondsInDay = 86400; 
    return seconds / secondsInDay;
}

export function DaysToSeconds(days: number): number {
    const secondsInDay = 86400;
    return secondsInDay * days;
}

// Original function kept for compatibility, but not recommended for large numbers
export function formatTokenAmount(weiAmount: number, decimals: number): string {
    const tokenAmount = weiAmount / Math.pow(10, decimals);
    return tokenAmount.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

// New function to handle bigint safely
export function formatBigIntTokenAmount(weiAmount: bigint, decimals: number): string {
    const tokenAmount = Number(weiAmount) / Math.pow(10, decimals);
    return tokenAmount.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

export function calculateDaysLeft(deadline: number): number {
    const currentTime = Math.floor(Date.now() / 1000);
    return Math.max(0, Math.ceil((deadline - currentTime) / 86400));
}

export function parseTokenAmount(amount: number | string, decimals: number = 18): bigint {
    const [whole, fraction = ""] = amount.toString().split(".");
    const paddedFraction = (fraction + "0".repeat(decimals)).slice(0, decimals);
    const fullAmountStr = whole + paddedFraction;
    return BigInt(fullAmountStr);
}

export function toBigIntTokenAmount(amount: number | string, decimals: number = 18): bigint {
    const [whole, fraction = ""] = amount.toString().split(".");
    const paddedFraction = (fraction + "0".repeat(decimals)).slice(0, decimals); 
    const fullAmountStr = whole + paddedFraction;
    return BigInt(fullAmountStr);
}
