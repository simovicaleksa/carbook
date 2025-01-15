import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

import LoginForm from "./login-form";

export default function LoginCard() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Log in</CardTitle>
        <CardDescription>
          Create an account to start using Carbook
        </CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm />
      </CardContent>
    </Card>
  );
}
