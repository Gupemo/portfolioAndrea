import WatercolorTrail from "@/components/WatercolorTrail/WatercolorTrail";
import LanguageSelector from "@/components/Landing/LanguageSelector/LanguageSelector";
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <LanguageSelector />
      {children}
      <WatercolorTrail />
    </>
  );
}
