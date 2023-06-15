import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { useUser } from "@supabase/auth-helpers-react";

export default function Protected({ initialSession }) {
  const user = useUser();

  return (
    <>
      <p>Protected page</p>
      <p>initialSession.user.email: {initialSession?.user?.email}</p>
      <p>useUser().email: {user?.email}</p>
    </>
  );
}

export async function getServerSideProps(context) {
  const supabase = createPagesServerClient(context);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {
      initialSession: session,
    },
  };
}
