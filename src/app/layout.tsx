import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "Jeferson Taveira | Engenheiro de Software Full Stack & IA",
  description:
    "Portfólio interativo de alta performance. Demos de Visão Computacional (PyTorch/ONNX), SaaS de Arenas em Django e Cluster DevOps com Chaos Engineering. Filosofia 'Show, Don't Tell'.",
  keywords: [
    "Jeferson Taveira",
    "Engenheiro de Software",
    "Python",
    "Django",
    "FastAPI",
    "PyTorch",
    "Inteligência Artificial",
    "ONNX Web",
    "Docker",
    "React",
    "Next.js",
  ],
  authors: [{ name: "Jeferson Taveira" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark scroll-smooth" suppressHydrationWarning>
      <body 
        className="min-h-screen bg-[#080B11] text-[#F8FAFC] antialiased cyber-grid-bg selection:bg-[#00F2FE]/20 selection:text-[#00F2FE]"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
