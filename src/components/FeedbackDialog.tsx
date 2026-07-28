import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Star, MessageSquare, Send } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";

const feedbackSchema = z.object({
    rating: z.number().min(1, "Please select a rating").max(5),
    comment: z.string().min(5, "Comment must be at least 5 characters"),
    email: z.string().email("Invalid email address").optional().or(z.string().length(0)),
});

type FeedbackFormValues = z.infer<typeof feedbackSchema>;

export function FeedbackDialog() {
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user } = useAuth();

    const form = useForm<FeedbackFormValues>({
        resolver: zodResolver(feedbackSchema),
        defaultValues: {
            rating: 0,
            comment: "",
            email: user?.email || "",
        },
    });

    const onSubmit = async (data: FeedbackFormValues) => {
        setIsSubmitting(true);
        try {
            const response = await axios.post("/api/feedback", {
                ...data,
                userId: user?.id,
            });

            if (response.data.success) {
                toast.success("Thank you for your feedback!");
                form.reset();
                setIsOpen(false);
            }
        } catch (error) {
            toast.error("Failed to submit feedback. Please try again.");
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const rating = form.watch("rating");

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="fixed bottom-6 right-6 rounded-full shadow-lg h-12 px-6 gap-2 bg-background border-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 z-50 group"
                >
                    <MessageSquare className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    <span className="font-semibold">Feedback</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                        Give Feedback
                    </DialogTitle>
                    <DialogDescription>
                        Help us improve Deal Discover! Tell us what you think.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
                        <FormField
                            control={form.control}
                            name="rating"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                    <FormLabel className="text-base">Rating</FormLabel>
                                    <FormControl>
                                        <div className="flex justify-between items-center bg-muted/50 p-4 rounded-xl">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    className="focus:outline-none transition-transform hover:scale-125"
                                                    onClick={() => field.onChange(star)}
                                                >
                                                    <Star
                                                        className={`h-8 w-8 transition-colors ${star <= rating
                                                                ? "fill-yellow-400 text-yellow-400"
                                                                : "text-muted-foreground hover:text-yellow-400/50"
                                                            }`}
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="comment"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Your Experience</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="What did you like or dislike?"
                                            className="min-h-[120px] resize-none focus-visible:ring-primary"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email (Optional)</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="your@email.com"
                                            className="focus-visible:ring-primary"
                                            {...field}
                                        />
                                    </FormControl>
                                    <p className="text-[10px] text-muted-foreground mt-1">
                                        We'll only use this to follow up if needed.
                                    </p>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter className="sm:justify-end gap-2">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setIsOpen(false)}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting} className="gap-2 px-8">
                                {isSubmitting ? (
                                    "Submitting..."
                                ) : (
                                    <>
                                        <Send className="h-4 w-4" />
                                        Submit
                                    </>
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
