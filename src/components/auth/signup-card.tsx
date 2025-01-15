import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

import SignupForm from "./signup-form";

export default function SignupCard() {
  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>Sign up</CardTitle>
        <CardDescription>
          Create an account to start using Carbook
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SignupForm />
      </CardContent>
    </Card>
  );
}
