'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@/providers/UserContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileSettingsSchema, ProfileSettingsValues } from '@/lib/validators/profile';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import axios from '@/utils/axiosInstance';
import {uploadToImgbb} from "@/lib/utils";

export default function ProfileSettingsPage() {
    const { user, refreshUser } = useUser();
    const [loading, setLoading] = useState(false);

    const form = useForm<ProfileSettingsValues>({
        resolver: zodResolver(profileSettingsSchema),
        defaultValues: {
            name: '',
            imageUrl: '',
            imageFile: undefined,
        },
    });

    useEffect(() => {
        if (user) {
            form.reset({
                name: user.name,
                imageUrl: user.imageUrl || '',
                imageFile: undefined,
            });
        }
    }, [user, form]);

    const onSubmit = async (data: ProfileSettingsValues) => {
        setLoading(true);
        try {
            let finalImageUrl = data.imageUrl;

            if (data.imageFile && data.imageFile.length > 0) {
                finalImageUrl = await uploadToImgbb(data.imageFile[0]);
            }

            await axios.put('/api/v1/users/me', {
                name: data.name,
                imageUrl: finalImageUrl,
            });

            toast.success('Profile updated');
            await refreshUser();
        } catch (err) {
            console.error(err);
            toast.error('Update failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-fit flex flex-col items-center justify-center h-fit p-6 bg-white text-black rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-6">Profile Settings</h2>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="imageUrl"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Image URL</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="https://..." />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="imageFile"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Or Upload Image</FormLabel>
                                <FormControl>
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => field.onChange(e.target.files)}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" disabled={loading}>
                        {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                </form>
            </Form>
        </div>
    );
}
