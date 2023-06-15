import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import Link from "next/link";
import { useState } from "react";
import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  const [supabaseClient] = useState(createPagesBrowserClient());
  const { initialSession } = pageProps;

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={initialSession}
    >
      <p style={{ display: "flex", gap: "1em" }}>
        <Link href={"/"}>Home</Link>
        <Link href={"/protected"}>Protected</Link>
        {initialSession ? <Link href={"/api/logout"}>Logout</Link> : null}
      </p>
      <Component {...pageProps} />
    </SessionContextProvider>
  );
}
