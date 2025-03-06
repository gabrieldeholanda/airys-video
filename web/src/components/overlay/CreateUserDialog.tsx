import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import ActivityIndicator from "../indicators/activity-indicator";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useTranslation } from "react-i18next";

type CreateUserOverlayProps = {
  show: boolean;
  onCreate: (user: string, password: string) => void;
  onCancel: () => void;
};

export default function CreateUserDialog({
  show,
  onCreate,
  onCancel,
}: CreateUserOverlayProps) {
  const { t: translate } = useTranslation(['views']);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const formSchema = z.object({
    user: z
      .string()
      .min(1)
      .regex(/^[A-Za-z0-9._]+$/, {
        message: "Username may only include letters, numbers, . or _",
      }),
    password: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      user: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    await onCreate(values.user, values.password);
    form.reset();
    setIsLoading(false);
  };

  return (
    <Dialog open={show} onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{translate('settings.authentication.dialogs.create_user.title')}</DialogTitle>
          <DialogDescription>
            {translate('settings.authentication.dialogs.create_user.description')}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              name="user"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{translate('settings.authentication.dialogs.create_user.form.username.label')}</FormLabel>
                  <FormControl>
                    <Input
                      className="text-md w-full border border-input bg-background p-2 hover:bg-accent hover:text-accent-foreground dark:[color-scheme:dark]"
                      placeholder={translate('settings.authentication.dialogs.create_user.form.username.placeholder')}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{translate('settings.authentication.dialogs.create_user.form.password.label')}</FormLabel>
                  <FormControl>
                    <Input
                      className="text-md w-full border border-input bg-background p-2 hover:bg-accent hover:text-accent-foreground dark:[color-scheme:dark]"
                      type="password"
                      placeholder={translate('settings.authentication.dialogs.create_user.form.password.placeholder')}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <DialogFooter className="mt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={onCancel}
              >
                {translate('settings.authentication.dialogs.create_user.actions.cancel')}
              </Button>
              <Button
                variant="select"
                disabled={isLoading}
              >
                {isLoading && <ActivityIndicator className="mr-2 h-4 w-4" />}
                {translate('settings.authentication.dialogs.create_user.actions.create')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
