"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {Select, SelectContent, SelectItem, SelectTrigger,SelectValue,} from "@/components/ui/select";
import { crowdfundingAbi, crowdfundingAddress } from "@/constants";
import { DaysToSeconds } from "@/utils/conversionUtils";
import { toast } from "sonner";
import { useConfig, useAccount, useChainId, useWriteContract } from "wagmi";
import { waitForTransactionReceipt } from "@wagmi/core";

const formSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }),
  description: z.string().min(50, {
    message: "Description must be at least 50 characters.",
  }),
  amountGoal: z.coerce.number().min(1, {
    message: "Goal must be at least greater than $1",
  }),
  duration: z.coerce.number().min(1, {
    message: "Duration must be at least greater than 1day",
  }),
  category: z.enum(
    ["other", "science", "social", "tech", "environment", "education"] as const
  ),
});

export function CreateCampaignForm() {
    const config = useConfig();
    const { data: hash, isPending, error, writeContractAsync } = useWriteContract();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      amountGoal: 0,
      duration: 0,
      category: "other", 
    },
  });

  async function createCampaign(title: string, description: string, amountGoal: number, duration: number) {
    try {
        const response = await writeContractAsync({
            abi: crowdfundingAbi,
            address: crowdfundingAddress as `0x${string}`,
            functionName: "createCampaign",
            args: [title, description, BigInt(amountGoal), BigInt(DaysToSeconds(duration))]
        });

        const approvalReceipt = await waitForTransactionReceipt(config, {
            hash: response,
        });
        
        console.log("Campaign created:", approvalReceipt);
        toast.success("Campaign created Successfully");
    } catch (error) {
        console.error(error);
        toast.error(`Could not create campaign: ${error.message}`);
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await createCampaign(values.title, values.description, values.amountGoal, values.duration);
      console.log("Form values:", values);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Category */}
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="other">Other</SelectItem>
                  <SelectItem value="science">Science</SelectItem>
                  <SelectItem value="social">Social</SelectItem>
                  <SelectItem value="tech">Technology</SelectItem>
                  <SelectItem value="environment">Environment</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>Choose the most relevant category</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Campaign Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter campaign title" {...field} />
              </FormControl>
              <FormDescription>This is your campaign's public title</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us about your campaign..."
                  className="resize-y min-h-[120px] max-h-[300px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>Explain your campaign in detail</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Funding Goal */}
        <FormField
          control={form.control}
          name="amountGoal"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Funding Goal ($)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="10,000" {...field} />
              </FormControl>
              <FormDescription>The amount you're aiming to raise</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Campaign Duration */}
        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Campaign Duration</FormLabel>
              <FormControl>
                <Input type="number" placeholder="How long would this campaign be active" {...field} />
              </FormControl>
              <FormDescription>Duration in days</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Creating..." : "Launch Campaign"}
        </Button>
      </form>
    </Form>
  );
}