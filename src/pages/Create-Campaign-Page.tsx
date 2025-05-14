import { CreateCampaignForm } from "@/components/Create-Campaign-form";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const CreateCampaignPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container max-w-2xl py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Start a New Campaign</CardTitle>
          </CardHeader>
          <CardContent>
            <CreateCampaignForm />
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default CreateCampaignPage;