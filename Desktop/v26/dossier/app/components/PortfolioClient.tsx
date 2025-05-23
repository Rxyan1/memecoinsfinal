"use client";
import dynamic from "next/dynamic";

const Portfolio = dynamic(() => import("./portfolio"), { ssr: false });

export default function PortfolioClient(props: any) {
  return (
    <>
      <nav
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          padding: "1rem 2rem",
          background: "rgba(0,0,0,0.7)",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 100,
          height: "70px", // Ajoutez une hauteur explicite si besoin
        }}
      >
        <img
          src="/images/logo.png"
          alt="Logo"
          style={{ width: 40, height: "auto" }}
        />
        {/* ...vous pouvez ajouter d'autres éléments de navigation ici... */}
      </nav>
      <div style={{ paddingTop: "90px" }}>
        <Portfolio {...props} />
      </div>
    </>
  );
}
