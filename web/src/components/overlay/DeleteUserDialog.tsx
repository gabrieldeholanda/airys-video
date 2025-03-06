import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useTranslation } from "react-i18next";

type DeleteUserProps = {
  show: boolean;
  onDelete: () => void;
  onCancel: () => void;
};

export default function DeleteUserDialog({
  show,
  onDelete,
  onCancel,
}: DeleteUserProps) {
  const { t: translate } = useTranslation(['views']);

  return (
    <Dialog open={show} onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{translate('settings.authentication.dialogs.delete_user.title')}</DialogTitle>
          <DialogDescription>
            {translate('settings.authentication.dialogs.delete_user.description')}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
          >
            {translate('settings.authentication.dialogs.delete_user.actions.cancel')}
          </Button>
          <Button
            className="flex items-center gap-1"
            variant="destructive"
            onClick={onDelete}
          >
            {translate('settings.authentication.dialogs.delete_user.actions.confirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
