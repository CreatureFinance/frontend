"use client";

import React, { ChangeEvent, useTransition } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Locale, supportedLangs } from "@/i18n/config";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname, useParams } from "next/navigation";

const LocaleSelector = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("Settings");

  const onSelectChange = (nextLocale: Locale) => {
    startTransition(() => {
      // 將當前路徑中的語言代碼替換為新的語言代碼
      const newPathname = pathname.replace(/^\/[^\/]+/, `/${nextLocale}`);
      router.replace(newPathname, { scroll: false });
    });
  };

  return (
    <Select value={locale} onValueChange={onSelectChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select a language" />
      </SelectTrigger>
      <SelectContent>
        {supportedLangs.map((item) => (
          <SelectItem value={item}>{t(item)}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default LocaleSelector;
