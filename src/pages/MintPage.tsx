import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import MintForm from "@/components/MintForm";

const MintPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900/5 via-background to-green-900/10">
      <div className="container px-4 py-12 mx-auto max-w-md">
        <Card className="border border-green-200/20 shadow-lg backdrop-blur-sm bg-white/80 overflow-hidden">
          <CardHeader className="border-b border-green-100/20 pb-6">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-green-700 to-green-500 bg-clip-text text-transparent">
              Mint cNGN Tokens
            </CardTitle>
            <CardDescription className="text-gray-600">
              Enter the amount of cNGN tokens you wish to mint
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <MintForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MintPage;