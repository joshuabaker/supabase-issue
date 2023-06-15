import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";

export default function Verify({ email }) {
  const router = useRouter();
  const [token, setToken] = useState("");

  const onSubmitEmail = useCallback(
    async (event) => {
      event.preventDefault();

      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token }),
      });

      const { error } = await response.json();

      if (error) {
        alert(error);
      } else {
        void router.push(`/protected`);
      }
    },
    [email, token, router]
  );

  return (
    <form onSubmit={onSubmitEmail}>
      <input
        type={"text"}
        placeholder={"One-time code"}
        required
        value={token}
        onChange={(event) => setToken(event.target.value)}
      />
      <button type={"submit"}>Login</button>
    </form>
  );
}

export async function getServerSideProps(context) {
  const email = context.query.email;

  if (!email) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const supabase = createPagesServerClient(context);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: { email },
  };
}
