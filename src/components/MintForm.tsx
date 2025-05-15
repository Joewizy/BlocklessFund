import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { DollarSign } from "lucide-react";
import { toast } from "sonner";
import { checkCngnBalance, mintCngn } from "@/utils/contracts/cNGN";
import { useConfig, useAccount, useWaitForTransactionReceipt } from "wagmi";
import { formatUnits } from "viem";

const MintForm = () => {
  const account = useAccount();
  const config = useConfig();
  const [txHash, setTxHash] = useState<`0x${string}` | null>(null); 
  const { data: txReceipt, isLoading: isWaiting, isSuccess, isError } = useWaitForTransactionReceipt({ hash: txHash });
  
  const [amount, setAmount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState<number>();

  async function fetchBalance() {
    if (account.address) {
      const cngnBalance = await checkCngnBalance(config, account.address);
      const formattedBalance = parseFloat(formatUnits(cngnBalance, 18));
      setBalance(formattedBalance);
    }
  }

  useEffect(() => {
    fetchBalance();

  }, [account.address, config]);

  useEffect(() => {
    if (isSuccess) {
      toast.success(`Successfully minted ${amount} cNGN token`);
    }
  }, [isSuccess, amount]);

  async function handleMint() {
    setLoading(true);
    try {
      const tokenAmount = amount * 10 ** 18;
      const tx = await mintCngn(config, tokenAmount, account.address);
      console.log("Successfully minted", tx);
      setTxHash(tx);

      await fetchBalance(); 

    } catch (error) {
      console.log("Error minting tokens", error);
    } finally {
      setLoading(false);
    }
  }

  // Handle slider change
  const handleSliderChange = (value: number[]) => {
    setAmount(value[0]);
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAmount = parseFloat(e.target.value);
    if (!isNaN(newAmount)) {
      setAmount(newAmount);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">
            Amount
          </label>
          <span className="text-xs text-gray-500">
            Balance: {balance} cNGN
          </span>
        </div>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            <DollarSign className="w-5 h-5 text-green-400" />
          </div>
          <Input
            value={amount}
            onChange={handleInputChange}
            className="pl-10 pr-20 bg-white/70 border border-green-100/50 focus:border-green-500"
            placeholder="0.00"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <span className="text-sm text-gray-500">cNGN</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Quick Select
        </label>
        <Slider
          defaultValue={[0]}
          max={1000}
          step={10}
          value={[amount]}
          onValueChange={handleSliderChange}
          className="py-4"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>0 cNGN</span>
          <span>500 cNGN</span>
          <span>1000 cNGN</span>
        </div>
      </div>

      <div className="pt-4">
        <Button 
          onClick={handleMint} 
          className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white shadow-md"
          disabled={isWaiting || parseFloat(amount.toString()) <= 0}
        >
          {isWaiting ? (
            <div className="flex items-center">
              <svg className="animate-spin h-4 w-4 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </div>
          ) : (
            "Mint cNGN Tokens"
          )}
        </Button>
      </div>

      <div className="flex items-center justify-between px-2 py-3 mt-4 text-xs text-gray-500 bg-green-50/50 rounded-lg">
        <span>Estimated Gas Fee:</span>
        <span className="font-medium text-gray-700">0.0042 ETH</span>
      </div>
    </div>
  );
};

export default MintForm;
