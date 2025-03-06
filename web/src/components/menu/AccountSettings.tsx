import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { TooltipPortal } from "@radix-ui/react-tooltip";
import { isDesktop } from "react-device-detect";
import { VscAccount } from "react-icons/vsc";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "../ui/dropdown-menu";
import { Drawer, DrawerContent, DrawerTrigger } from "../ui/drawer";
import { DialogClose } from "../ui/dialog";
import { LuLogOut, LuUser, LuMail, LuKey, LuUserCircle } from "react-icons/lu";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";

type AccountSettingsProps = {
  className?: string;
};

interface UserData {
  displayName: string;
  email: string;
  userType: string;
  personalDetails?: {
    firstName: string;
    lastName: string;
  };
  businessDetails?: {
    companyName: string;
  };
}

export default function AccountSettings({ className }: AccountSettingsProps) {
  const { t: translate } = useTranslation(['ui']);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.uid) {
        const userDocRef = doc(db, 'users', user.uid);
        try {
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            setUserData(userDoc.data() as UserData);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, [user]);

  const displayName = userData?.userType === 'business'
    ? userData?.businessDetails?.companyName
    : userData?.personalDetails
      ? `${userData.personalDetails.firstName} ${userData.personalDetails.lastName}`.trim()
      : user?.email;

  const Container = isDesktop ? DropdownMenu : Drawer;
  const Trigger = isDesktop ? DropdownMenuTrigger : DrawerTrigger;
  const Content = isDesktop ? DropdownMenuContent : DrawerContent;
  const MenuItem = isDesktop ? DropdownMenuItem : DialogClose;

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  return (
    <Container modal={!isDesktop}>
      <Trigger>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className={cn(
                "flex flex-col items-center justify-center",
                isDesktop
                  ? "cursor-pointer rounded-lg bg-secondary text-secondary-foreground hover:bg-muted"
                  : "text-secondary-foreground",
                className,
              )}
            >
              <VscAccount className="size-5 md:m-[6px]" />
            </div>
          </TooltipTrigger>
          <TooltipPortal>
            <TooltipContent side="right">
              <p>{translate('menu.account.tooltip')}</p>
            </TooltipContent>
          </TooltipPortal>
        </Tooltip>
      </Trigger>
      <Content
        className={
          isDesktop ? "mr-5 w-72" : "max-h-[75dvh] overflow-hidden p-2"
        }
      >
        <div className="scrollbar-container w-full flex-col overflow-y-auto overflow-x-hidden">
          <DropdownMenuLabel>
            {translate('menu.account.current_user', { username: displayName || "anonymous" })}
          </DropdownMenuLabel>
          <DropdownMenuSeparator className={isDesktop ? "mt-3" : "mt-1"} />
          
          <DropdownMenuLabel>{translate('menu.account.sections.profile.title', 'Profile')}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <Link to="/account">
              <MenuItem
                className={
                  isDesktop
                    ? "cursor-pointer"
                    : "flex w-full items-center p-2 text-sm"
                }
              >
                <LuUserCircle className="mr-2 size-4" />
                <span>{translate('menu.account.sections.profile.dashboard', 'Dashboard')}</span>
              </MenuItem>
            </Link>
            <Link to="/account/profile">
              <MenuItem
                className={
                  isDesktop
                    ? "cursor-pointer"
                    : "flex w-full items-center p-2 text-sm"
                }
              >
                <LuUser className="mr-2 size-4" />
                <span>{translate('menu.account.sections.profile.settings', 'Profile Settings')}</span>
              </MenuItem>
            </Link>
          </DropdownMenuGroup>

          <DropdownMenuLabel className={isDesktop ? "mt-3" : "mt-1"}>
            {translate('menu.account.sections.account.title', 'Account')}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <MenuItem
              className={
                isDesktop
                  ? "cursor-pointer"
                  : "flex items-center p-2 text-sm"
              }
            >
              <LuMail className="mr-2 size-4" />
              <span>{user?.email}</span>
            </MenuItem>
            <Link to="/forgot-password">
              <MenuItem
                className={
                  isDesktop
                    ? "cursor-pointer"
                    : "flex w-full items-center p-2 text-sm"
                }
              >
                <LuKey className="mr-2 size-4" />
                <span>{translate('menu.account.sections.account.change_password', 'Change Password')}</span>
              </MenuItem>
            </Link>
          </DropdownMenuGroup>

          <DropdownMenuSeparator className={isDesktop ? "mt-3" : "mt-1"} />
          <MenuItem
            className={
              isDesktop ? "cursor-pointer" : "flex items-center p-2 text-sm"
            }
            onClick={handleLogout}
            aria-label={translate('menu.account.logout')}
          >
            <div className="flex">
              <LuLogOut className="mr-2 size-4" />
              <span>{translate('menu.account.logout')}</span>
            </div>
          </MenuItem>
        </div>
      </Content>
    </Container>
  );
}
