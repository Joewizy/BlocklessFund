import { CreateCampaignForm } from "@/components/Create-Campaign-form";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

const CreateCampaignPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
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
    </div>
  );
};

export default CreateCampaignPage;