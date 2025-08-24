
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Edit, LogOut, MapPin, User } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="max-w-4xl mx-auto">
      <header className="flex items-center gap-4 mb-10">
        <Avatar className="h-24 w-24">
          <AvatarImage src="https://placehold.co/100x100.png" alt="User" data-ai-hint="user avatar" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-4xl font-bold font-headline">John Doe</h1>
          <p className="text-muted-foreground">johndoe@example.com</p>
        </div>
      </header>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2">
                        <User className="h-5 w-5"/>
                        Personal Information
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="first-name">First Name</Label>
                            <Input id="first-name" defaultValue="John" />
                        </div>
                        <div>
                            <Label htmlFor="last-name">Last Name</Label>
                            <Input id="last-name" defaultValue="Doe" />
                        </div>
                    </div>
                     <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue="johndoe@example.com" />
                    </div>
                     <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" type="tel" defaultValue="+91 98765 43210" />
                    </div>
                    <Button>Save Changes</Button>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2">
                       <MapPin className="h-5 w-5"/>
                        Shipping Address
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                        123 Main St, Anytown, 12345, India
                    </p>
                    <Button variant="outline">
                        <Edit className="mr-2 h-4 w-4"/>
                        Edit Address
                    </Button>
                </CardContent>
            </Card>
        </div>
        <div className="space-y-4">
            <Button variant="destructive" className="w-full">
                <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
        </div>
      </div>
    </div>
  );
}
