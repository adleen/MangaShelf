'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { DialogClose } from '@/components/ui/dialog';
import type { Manga } from '@/lib/types';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  author: z.string().min(1, 'Author is required.'),
  totalVolumes: z.coerce.number().min(1, 'Must have at least one volume.'),
  status: z.enum(['owned', 'wishlist'], {
    required_error: 'You need to select a status.',
  }),
});

interface AddMangaFormProps {
  onAddManga: (newManga: Manga) => void;
}

export function AddMangaForm({ onAddManga }: AddMangaFormProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      author: '',
      totalVolumes: 1,
      status: 'owned',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const newManga: Manga = {
      id: values.title.toLowerCase().replace(/\s+/g, '-'),
      title: values.title,
      author: values.author,
      totalVolumes: values.totalVolumes,
      status: values.status,
      coverImage: 'generic-cover',
      volumes: Array.from({ length: values.totalVolumes }, (_, i) => ({
        id: i + 1,
        isOwned: false,
      })),
    };
    onAddManga(newManga);
    toast({
      title: 'Success!',
      description: `"${values.title}" has been added to your ${values.status === 'owned' ? 'collection' : 'wishlist'}.`,
    });
    // Need to find a way to close the dialog. Using DialogClose for now.
    document.getElementById('close-dialog-button')?.click();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Berserk" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="author"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Author</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Kentaro Miura" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="totalVolumes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total Volumes</FormLabel>
              <FormControl>
                <Input type="number" min="1" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Add to...</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="owned" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      My Collection
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="wishlist" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Wishlist
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit">Add Manga</Button>
        </div>
      </form>
      <DialogClose asChild>
        <button id="close-dialog-button" className="hidden">Close</button>
      </DialogClose>
    </Form>
  );
}
