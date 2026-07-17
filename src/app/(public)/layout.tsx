import WatercolorTrail from "@/components/WatercolorTrail/WatercolorTrail";
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <WatercolorTrail />
    </>
  );
}