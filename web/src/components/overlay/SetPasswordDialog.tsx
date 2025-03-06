import { Button } from "../ui/button";
import { Input } from "../ui/input";
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

type SetPasswordProps = {
  show: boolean;
  onSave: (password: string) => void;
  onCancel: () => void;
};

export default function SetPasswordDialog({
  show,
  onSave,
  onCancel,
}: SetPasswordProps) {
  const { t: translate } = useTranslation(['views']);
  const [password, setPassword] = useState<string>();

  return (
    <Dialog open={show} onOpenChange={onCancel}>
      <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>{translate('settings.authentication.dialogs.update_password.title')}</DialogTitle>
          <DialogDescription>
            {translate('settings.authentication.dialogs.update_password.description')}
          </DialogDescription>
        </DialogHeader>
        <Input
          className="text-md w-full border border-input bg-background p-2 hover:bg-accent hover:text-accent-foreground dark:[color-scheme:dark]"
          type="password"
          placeholder={translate('settings.authentication.dialogs.update_password.form.password.placeholder')}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <DialogFooter>
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
          >
            {translate('settings.authentication.dialogs.update_password.actions.cancel')}
          </Button>
          <Button
            className="flex items-center gap-1"
            variant="select"
            onClick={() => {
              onSave(password!);
            }}
          >
            {translate('settings.authentication.dialogs.update_password.actions.update')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
