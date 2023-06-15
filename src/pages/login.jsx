import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";

export default function Login() {
  const supabase = useSupabaseClient();
  const router = useRouter();
  const [email, setEmail] = useState("");

  const onSubmitEmail = useCallback(
    async (event) => {
      event.preventDefault();

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: false },
      });

      if (error) {
        alert(error);
      } else {
        void router.push(`/verify?email=${email}`);
      }
    },
    [email, router, supabase.auth]
  );

  return (
    <form onSubmit={onSubmitEmail}>
      <input
        type={"email"}
        name={"email"}
        placeholder={"user@example.com"}
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <button type={"submit"}>Login</button>
    </form>
  );
}

export async function getServerSideProps(context) {
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
    props: {},
  };
}
