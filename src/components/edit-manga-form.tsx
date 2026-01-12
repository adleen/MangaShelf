'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { ChangeEvent } from 'react';

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
import type { Manga } from '@/lib/types';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  author: z.string().min(1, 'Author is required.'),
  totalVolumes: z.coerce.number().min(1, 'Must have at least one volume.'),
  status: z.enum(['owned', 'wishlist'], {
    required_error: 'You need to select a status.',
  }),
  coverImage: z.string().min(1, 'Cover image is required.'),
});

interface EditMangaFormProps {
  manga: Manga;
  onUpdateManga: (updatedManga: Manga) => void;
}

export function EditMangaForm({ manga, onUpdateManga }: EditMangaFormProps) {
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: manga.title,
      author: manga.author,
      totalVolumes: manga.totalVolumes,
      status: manga.status,
      coverImage: manga.coverImage,
    },
  });

  const handleCoverImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        form.setValue('coverImage', dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    const currentVolumes = manga.volumes;
    const totalVolumes = values.totalVolumes;
    let updatedVolumes = [...currentVolumes];

    if (totalVolumes > currentVolumes.length) {
      // Add new volumes
      const newVolumes = Array.from({ length: totalVolumes - currentVolumes.length }, (_, i) => ({
        id: currentVolumes.length + i + 1,
        isOwned: false,
      }));
      updatedVolumes = [...updatedVolumes, ...newVolumes];
    } else if (totalVolumes < currentVolumes.length) {
      // Remove excess volumes
      updatedVolumes = updatedVolumes.slice(0, totalVolumes);
    }

    const updatedManga: Manga = {
      ...manga,
      ...values,
      volumes: updatedVolumes,
    };
    onUpdateManga(updatedManga);
    toast({
      title: 'Success!',
      description: `"${values.title}" has been updated.`,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
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
        </div>
        <FormItem>
          <FormLabel>Cover Image</FormLabel>
          <FormControl>
             <Input type="file" accept="image/*" onChange={handleCoverImageChange} />
          </FormControl>
          <FormMessage />
        </FormItem>
         <div className="grid grid-cols-2 gap-4">
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
                <FormItem className="space-y-2">
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-4 pt-2"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="owned" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Collection
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
        </div>

        <div className="flex justify-end">
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </Form>
  );
}
