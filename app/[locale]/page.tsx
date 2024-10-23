import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { LocaleProps } from "@/types/locale";
import Container from "@/components/ui/container";

export default function Home({ params: { locale } }: LocaleProps) {
  // Enable static rendering
  setRequestLocale(locale);

  const t = useTranslations("Home");

  return (
    <Container>
      <p className="">{t("title")}</p>
    </Container>
  );
}
