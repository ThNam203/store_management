"use client";

import Preloader from "@/components/ui/preloader";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { cn } from "@/lib/utils";
import { setProfile } from "@/reducers/profileReducer";
import { setRoles } from "@/reducers/roleReducer";
import { setStoreInformation } from "@/reducers/storeReducer";
import { axiosUIErrorHandler } from "@/services/axiosUtils";
import ProfileService from "@/services/profileService";
import RoleService from "@/services/role_service";
import StoreService from "@/services/storeService";
import store from "@/store";
import { convertStaffReceived } from "@/utils/staffApiUtils";
import { Open_Sans } from "next/font/google";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { Provider } from "react-redux";
import "../globals.css";
const font = Open_Sans({ subsets: ["latin"] });

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SManager",
  description: "Generated by Next.js",
  icons: ["/web_avatar.png"],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <html lang="en">
        <body className={cn(font.className)}>
          <GlobalState>{children}</GlobalState>
          <Toaster />
        </body>
      </html>
    </Provider>
  );
}

const GlobalState = ({ children }: { children: React.ReactNode }) => {
  const [gotUserInfo, setGotUserInfo] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const dispatch = useAppDispatch();
  useEffect(() => {
    const getGlobalData = async () => {
      const profile = await ProfileService.getProfile();
      const convertedProfile = convertStaffReceived(profile.data);
      dispatch(setProfile(convertedProfile));

      const storeInfo = await StoreService.getStoreInformation();
      dispatch(setStoreInformation(storeInfo.data));

      const resRole = await RoleService.getAllRoles();
      dispatch(setRoles(resRole.data));
    };

    getGlobalData()
      .then(() => setGotUserInfo(true))
      .catch((e) => axiosUIErrorHandler(e, toast, router));
  }, []);

  if (!gotUserInfo) return <GlobalPreloader />;
  return (
    <>
      <GlobalPreloader />
      {children}
    </>
  );
};

const GlobalPreloader = () => {
  const preloaderVisibility = useAppSelector((state) => state.preloader.value);
  return preloaderVisibility ? <Preloader /> : null;
};
