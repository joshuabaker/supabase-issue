import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { object, string } from "zod";
import { generateErrorMessage } from "zod-error";

const schema = object({
  email: string().email(),
  token: string(),
});

export default async function handler(req, res) {
  const { data, error } = schema.safeParse(req.body);

  if (error) {
    return res.status(400).json({ error: generateErrorMessage(error) });
  }

  const supabase = createPagesServerClient({ req, res });

  const response = await supabase.auth.verifyOtp({
    type: "magiclink",
    email: data.email,
    token: data.token,
    options: {
      emailRedirectTo: String(
        new URL("/auth/callback", process.env.NEXT_PUBLIC_VERCEL_URL)
      ),
    },
  });

  res.status(response.error ? 401 : 200).json(response);
}
