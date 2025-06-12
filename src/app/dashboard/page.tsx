import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrdersTable } from "./components/OrdersTable";
import { UserRole } from "@/lib/roleCheck";
import { ServicesTable } from "./components/ServicesTable";
import { UsersTable } from "./components/UsersTable";
import { PortfolioTable } from "./components/PortfolioTable";

export default async function DashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const allowedRoles = [
    UserRole.User,
    UserRole.Designer,
    UserRole.Worker,
    UserRole.Admin,
  ];
  if (!allowedRoles.includes(session.role as UserRole)) {
    redirect("/unauthorized");
  }

  const renderContent = () => {
    switch (session.role) {
      case "user":
        return (
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>My Orders</CardTitle>
              <CardDescription>
                View and manage your renovation orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <OrdersTable session={session} />
            </CardContent>
          </Card>
        );
      case "designer":
        return (
          <Tabs defaultValue="services">
            <TabsList>
              <TabsTrigger value="services">My Services</TabsTrigger>
              <TabsTrigger value="orders">Related Orders</TabsTrigger>
              <TabsTrigger value="portfolio">My Portfolio</TabsTrigger>
            </TabsList>
            <TabsContent value="services">
              <ServicesTable session={session} />
            </TabsContent>
            <TabsContent value="orders">
              <OrdersTable session={session} />
            </TabsContent>
            <TabsContent value="portfolio">
              <PortfolioTable session={session} />
            </TabsContent>
          </Tabs>
        );
      case "worker":
        return (
          <Tabs defaultValue="tasks">
            <TabsList>
              <TabsTrigger value="tasks">Assigned Tasks</TabsTrigger>
              <TabsTrigger value="portfolio">My Portfolio</TabsTrigger>
            </TabsList>
            <TabsContent value="tasks">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Assigned Tasks</CardTitle>
                  <CardDescription>
                    View and update your work tasks
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <OrdersTable session={session} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="portfolio">
              <PortfolioTable session={session} />
            </TabsContent>
          </Tabs>
        );
      case "admin":
        return (
          <Tabs defaultValue="users">
            <TabsList>
              <TabsTrigger value="users">Manage Users</TabsTrigger>
              <TabsTrigger value="services">Manage Services</TabsTrigger>
              <TabsTrigger value="orders">Manage Orders</TabsTrigger>
              <TabsTrigger value="portfolio">Manage Portfolios</TabsTrigger>
            </TabsList>
            <TabsContent value="users">
              <UsersTable session={session} />
            </TabsContent>
            <TabsContent value="services">
              <ServicesTable session={session} />
            </TabsContent>
            <TabsContent value="orders">
              <OrdersTable session={session} />
            </TabsContent>
            <TabsContent value="portfolio">
              <PortfolioTable session={session} />
            </TabsContent>
          </Tabs>
        );
      default:
        return <p>Unauthorized access</p>;
    }
  };

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-4xl font-bold mb-8 gradient-text">Dashboard</h1>

      <Card className="glass-card mb-6">
        <CardHeader>
          <CardTitle>Your Information</CardTitle>
          <CardDescription>Welcome, {session.name as string}!</CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            <strong>Email:</strong> {session.email}
          </p>
          <p>
            <strong>Role:</strong> {session.role}
          </p>
        </CardContent>
      </Card>

      {renderContent()}
    </div>
  );
}
