
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function AdminDashboard() {
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Welcome to your Admin Dashboard</CardTitle>
          <CardDescription>
            This is your central hub for managing your e-commerce store. Use the navigation on the left to manage products, view orders, and more.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>More widgets and analytics will be added here soon!</p>
        </CardContent>
      </Card>
    </div>
  );
}
