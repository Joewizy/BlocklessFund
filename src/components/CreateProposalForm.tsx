
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FileText } from 'lucide-react';
import { toast } from 'sonner';

const proposalSchema = z.object({
  title: z.string().min(5, { message: 'Title must be at least 5 characters' }).max(100),
  description: z.string().min(20, { message: 'Description must be at least 20 characters' }),
  votingDays: z.coerce.number().int().min(1).max(30),
});

type ProposalFormValues = z.infer<typeof proposalSchema>;

export default function CreateProposalForm() {
  const form = useForm<ProposalFormValues>({
    resolver: zodResolver(proposalSchema),
    defaultValues: {
      title: '',
      description: '',
      votingDays: 7,
    },
  });

  function onSubmit(data: ProposalFormValues) {
    // In a real app, this would connect to your backend
    console.log('Proposal submitted:', data);
    
    toast.success('Proposal created successfully!', {
      description: 'Your proposal has been submitted for voting.',
    });
    
    form.reset();
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
          name="votingDays"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Voting Period (days)</FormLabel>
              <FormControl>
                <Input type="number" min={1} max={30} {...field} />
              </FormControl>
              <FormDescription>
                Set how long the community can vote on this proposal (1-30 days)
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
