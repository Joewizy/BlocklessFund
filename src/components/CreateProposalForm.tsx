
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FileText } from 'lucide-react';
import { toast } from 'sonner';
import { crowdfundingAbi, crowdfundingAddress } from '@/constants';
import { useWriteContract, useConfig } from 'wagmi';
import { waitForTransactionReceipt } from "@wagmi/core";
import { useNavigate } from 'react-router-dom';

const proposalSchema = z.object({
  title: z.string().min(5, { message: 'Title must be at least 5 characters' }).max(100),
  description: z.string().min(20, { message: 'Description must be at least 20 characters' }),
  amountGoal: z.coerce.number().int().min(1),
});

type ProposalFormValues = z.infer<typeof proposalSchema>;

export default function CreateProposalForm() {
  const navigate = useNavigate();
  const config = useConfig();
  const { data: hash, isPending, isSuccess, writeContractAsync } = useWriteContract();

  const form = useForm<ProposalFormValues>({
    resolver: zodResolver(proposalSchema),
    defaultValues: {
      title: '',
      description: '',
      amountGoal: null,
    },
  });

  useEffect(() => {
    if (isSuccess) {
      toast.success("Proposal created Successfully");
      const timer = setTimeout(() => {
        navigate("/proposals");
      }, 2000); 
  
      return () => clearTimeout(timer); 
    }
  }, [isSuccess, navigate]);  

  async function createProposal(title: string, description: string, amountGoal: number) {
      try {
          const response = await writeContractAsync({
              abi: crowdfundingAbi,
              address: crowdfundingAddress as `0x${string}`,
              functionName: "createProposal",
              args: [title, description, BigInt(amountGoal)]
          });
  
          const approvalReceipt = await waitForTransactionReceipt(config, {
              hash: response,
          });
          
          console.log("Proposal created:", approvalReceipt);
      } catch (error) {
          console.error(error);
          toast.error(`Could not create proposal: ${error.message}`);
      }
    }

  async function onSubmit(data: ProposalFormValues) {
    try {
      await createProposal(data.title, data.description, data.amountGoal)
      console.log("Proposal values", data)
    } catch (error) {
      console.error("Error submitting Form")
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center gap-2 mb-6">
          <FileText className="h-5 w-5 text-fundngn-green" />
          <h3 className="text-xl font-semibold">Create New Proposal</h3>
        </div>
        
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Proposal Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter a clear title for your proposal" {...field} />
              </FormControl>
              <FormDescription>
                Choose a title that clearly describes your proposal
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Proposal Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe your proposal in detail..." 
                  className="min-h-32"
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Provide a detailed explanation of your proposal, including goals and implementation details
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="amountGoal"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Funding Goal</FormLabel>
              <FormControl>
                <Input type="number" min={1} {...field} />
              </FormControl>
              <FormDescription>
                Set your goal amount for your campaign
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full">Submit Proposal</Button>
      </form>
    </Form>
  );
}
