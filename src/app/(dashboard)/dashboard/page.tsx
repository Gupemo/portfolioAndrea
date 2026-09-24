import Link from "next/link";

export default function DashboardHome() {
  return <section style={{ maxWidth: 900, margin: "0 auto" }}>
    <p style={{ color: "#98650f", fontWeight: 700 }}>Panel de administración</p>
    <h1 style={{ fontSize: "clamp(3rem, 6vw, 6rem)", marginTop: 0 }}>Hola, Andrea</h1>
    <p>Desde aquí puedes publicar tus ilustraciones y fotografías, y consultar los mensajes recibidos.</p>
    <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginTop: 32 }}>
      <Link href="/dashboard/illustrations">Gestionar ilustraciones</Link>
      <Link href="/dashboard/pictures">Gestionar fotografías</Link>
      <Link href="/dashboard/contact">Ver mensajes</Link>
      <Link href="/dashboard/about">Editar «Sobre mí»</Link>
      <Link href="/dashboard/privacy">Editar política de privacidad</Link>
    </div>
  </section>;
}
