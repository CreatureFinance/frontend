import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import TEST_Toast from "@/components/share/toast-tester";

type Props = {
  params: { locale: string };
};

export default function Home({ params: { locale } }: Props) {
  // Enable static rendering
  setRequestLocale(locale);

  const t = useTranslations("Home");

  return (
    <div>
      <TEST_Toast />
      <p className="">{t("title")}</p>
    </div>
  );
}
