import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  Bell,
  LogOut,
  CreditCard,
  Users,
  LifeBuoy,
  Lock,
  Palette,
  Globe,
  Mail,
} from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const [loading, setLoading] = useState(false);

  const handleSaveProfile = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Settings</h1>
          <p className="text-neutral-500 dark:text-neutral-400">
            Manage your account settings and preferences
          </p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <div className="flex flex-col md:flex-row gap-6">
          <Card className="w-full md:w-64 bg-white dark:bg-neutral-800">
            <CardContent className="p-4">
              <div className="space-y-1 py-2">
                <div className="flex items-center justify-center mb-6 mt-2">
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      alt="Alex Morgan"
                    />
                    <AvatarFallback>AM</AvatarFallback>
                  </Avatar>
                </div>
                <div className="text-center mb-4">
                  <p className="text-sm font-medium dark:text-white">Alex Morgan</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">alex@agencycrm.com</p>
                </div>
                <TabsList className="grid grid-cols-1 h-auto">
                  <TabsTrigger value="profile" className="justify-start text-sm px-3 py-2 h-9">
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </TabsTrigger>
                  <TabsTrigger value="agency" className="justify-start text-sm px-3 py-2 h-9">
                    <Users className="h-4 w-4 mr-2" />
                    Agency
                  </TabsTrigger>
                  <TabsTrigger value="billing" className="justify-start text-sm px-3 py-2 h-9">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Billing
                  </TabsTrigger>
                  <TabsTrigger value="notifications" className="justify-start text-sm px-3 py-2 h-9">
                    <Bell className="h-4 w-4 mr-2" />
                    Notifications
                  </TabsTrigger>
                  <TabsTrigger value="appearance" className="justify-start text-sm px-3 py-2 h-9">
                    <Palette className="h-4 w-4 mr-2" />
                    Appearance
                  </TabsTrigger>
                  <TabsTrigger value="security" className="justify-start text-sm px-3 py-2 h-9">
                    <Lock className="h-4 w-4 mr-2" />
                    Security
                  </TabsTrigger>
                </TabsList>
                <Separator className="my-4" />
                <div className="space-y-1">
                  <Button variant="ghost" size="sm" className="justify-start w-full text-sm">
                    <LifeBuoy className="h-4 w-4 mr-2" />
                    Help & Support
                  </Button>
                  <Button variant="ghost" size="sm" className="justify-start w-full text-sm text-destructive">
                    <LogOut className="h-4 w-4 mr-2" />
                    Log Out
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex-1">
            <TabsContent value="profile" className="space-y-6">
              <Card className="bg-white dark:bg-neutral-800">
                <CardHeader>
                  <CardTitle className="dark:text-white">Profile Information</CardTitle>
                  <CardDescription>
                    Update your personal information and public profile
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" defaultValue="Alex" className="w-full" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" defaultValue="Morgan" className="w-full" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue="alex@agencycrm.com" className="w-full" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" type="tel" defaultValue="+1 (555) 123-4567" className="w-full" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      defaultValue="Digital marketing specialist with 8 years of experience in social media management and content strategy."
                      className="w-full min-h-[100px]"
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button onClick={handleSaveProfile} disabled={loading}>
                      {loading ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="agency" className="space-y-6">
              <Card className="bg-white dark:bg-neutral-800">
                <CardHeader>
                  <CardTitle className="dark:text-white">Agency Information</CardTitle>
                  <CardDescription>
                    Update your agency details and branding
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Agency Name</Label>
                    <Input id="companyName" defaultValue="DigiSync Marketing Solutions" className="w-full" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="companyEmail">Business Email</Label>
                      <Input id="companyEmail" type="email" defaultValue="contact@digisync.com" className="w-full" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="companyPhone">Business Phone</Label>
                      <Input id="companyPhone" type="tel" defaultValue="+1 (555) 987-6543" className="w-full" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="companyWebsite">Website</Label>
                    <Input id="companyWebsite" type="url" defaultValue="https://digisync.com" className="w-full" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="companyAddress">Address</Label>
                    <Textarea
                      id="companyAddress"
                      defaultValue="123 Marketing Lane, Suite 401, San Francisco, CA 94107"
                      className="w-full"
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button>Save Agency Info</Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-neutral-800">
                <CardHeader>
                  <CardTitle className="dark:text-white">Team Members</CardTitle>
                  <CardDescription>
                    Manage team access and permissions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-end">
                    <Button variant="outline">Invite Team Member</Button>
                  </div>
                  
                  <div className="border rounded-md dark:border-neutral-700">
                    <div className="p-4 flex justify-between items-center border-b dark:border-neutral-700">
                      <div className="flex items-center">
                        <Avatar className="h-9 w-9 mr-3">
                          <AvatarFallback>AM</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium dark:text-white">Alex Morgan</p>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400">alex@agencycrm.com</p>
                        </div>
                      </div>
                      <div>
                        <Badge className="bg-primary text-white">Admin</Badge>
                      </div>
                    </div>
                    
                    <div className="p-4 flex justify-between items-center border-b dark:border-neutral-700">
                      <div className="flex items-center">
                        <Avatar className="h-9 w-9 mr-3">
                          <AvatarFallback>JS</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium dark:text-white">Jane Smith</p>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400">jane@agencycrm.com</p>
                        </div>
                      </div>
                      <div>
                        <Badge className="bg-secondary text-white">Manager</Badge>
                      </div>
                    </div>
                    
                    <div className="p-4 flex justify-between items-center">
                      <div className="flex items-center">
                        <Avatar className="h-9 w-9 mr-3">
                          <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium dark:text-white">John Doe</p>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400">john@agencycrm.com</p>
                        </div>
                      </div>
                      <div>
                        <Badge className="bg-neutral-200 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300">
                          Staff
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="billing" className="space-y-6">
              <Card className="bg-white dark:bg-neutral-800">
                <CardHeader>
                  <CardTitle className="dark:text-white">Subscription Plan</CardTitle>
                  <CardDescription>
                    Manage your subscription and billing information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-primary/10 rounded-md">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-lg dark:text-white">Professional Plan</p>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">$49/month, billed annually</p>
                      </div>
                      <Badge className="bg-success text-white">Active</Badge>
                    </div>
                    <div className="text-sm text-neutral-600 dark:text-neutral-400 mt-3">
                      <p>Your subscription renews on Oct 15, 2023</p>
                    </div>
                    <div className="mt-4 flex space-x-3">
                      <Button variant="outline">Change Plan</Button>
                      <Button variant="outline" className="text-destructive border-destructive">
                        Cancel Subscription
                      </Button>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4 dark:text-white">Payment Method</h3>
                    <div className="flex items-center p-3 border rounded-md dark:border-neutral-700">
                      <div className="mr-4">
                        <CreditCard className="h-8 w-8 text-neutral-400" />
                      </div>
                      <div>
                        <p className="font-medium dark:text-white">Visa ending in 4242</p>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">Expires 09/2025</p>
                      </div>
                      <div className="ml-auto">
                        <Button variant="ghost" size="sm">Edit</Button>
                      </div>
                    </div>
                    <div className="mt-3">
                      <Button variant="outline">Add Payment Method</Button>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4 dark:text-white">Billing History</h3>
                    <div className="border rounded-md divide-y dark:border-neutral-700 dark:divide-neutral-700">
                      <div className="p-3 flex justify-between items-center">
                        <div>
                          <p className="font-medium dark:text-white">Invoice #1234</p>
                          <p className="text-sm text-neutral-500 dark:text-neutral-400">Sep 1, 2023</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium dark:text-white">$49.00</p>
                          <Button variant="ghost" size="sm" className="text-primary">Download</Button>
                        </div>
                      </div>
                      <div className="p-3 flex justify-between items-center">
                        <div>
                          <p className="font-medium dark:text-white">Invoice #1233</p>
                          <p className="text-sm text-neutral-500 dark:text-neutral-400">Aug 1, 2023</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium dark:text-white">$49.00</p>
                          <Button variant="ghost" size="sm" className="text-primary">Download</Button>
                        </div>
                      </div>
                      <div className="p-3 flex justify-between items-center">
                        <div>
                          <p className="font-medium dark:text-white">Invoice #1232</p>
                          <p className="text-sm text-neutral-500 dark:text-neutral-400">Jul 1, 2023</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium dark:text-white">$49.00</p>
                          <Button variant="ghost" size="sm" className="text-primary">Download</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <Card className="bg-white dark:bg-neutral-800">
                <CardHeader>
                  <CardTitle className="dark:text-white">Notification Preferences</CardTitle>
                  <CardDescription>
                    Choose when and how you want to be notified
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-4 dark:text-white">Email Notifications</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="email-payments" className="font-medium dark:text-white">Payment Updates</Label>
                          <p className="text-sm text-neutral-500 dark:text-neutral-400">Get notified when payments are received or due</p>
                        </div>
                        <Switch id="email-payments" defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="email-clients" className="font-medium dark:text-white">Client Activity</Label>
                          <p className="text-sm text-neutral-500 dark:text-neutral-400">Get notified about new clients and updates</p>
                        </div>
                        <Switch id="email-clients" defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="email-projects" className="font-medium dark:text-white">Project Updates</Label>
                          <p className="text-sm text-neutral-500 dark:text-neutral-400">Get notified about project deadlines and milestones</p>
                        </div>
                        <Switch id="email-projects" defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="email-marketing" className="font-medium dark:text-white">Marketing Communications</Label>
                          <p className="text-sm text-neutral-500 dark:text-neutral-400">Receive product updates and promotional offers</p>
                        </div>
                        <Switch id="email-marketing" />
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4 dark:text-white">In-App Notifications</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="app-payments" className="font-medium dark:text-white">Payment Alerts</Label>
                          <p className="text-sm text-neutral-500 dark:text-neutral-400">Show notifications for payment events</p>
                        </div>
                        <Switch id="app-payments" defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="app-deadlines" className="font-medium dark:text-white">Deadline Reminders</Label>
                          <p className="text-sm text-neutral-500 dark:text-neutral-400">Get reminders about upcoming deadlines</p>
                        </div>
                        <Switch id="app-deadlines" defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="app-messages" className="font-medium dark:text-white">New Messages</Label>
                          <p className="text-sm text-neutral-500 dark:text-neutral-400">Show notifications for new messages</p>
                        </div>
                        <Switch id="app-messages" defaultChecked />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button>Save Preferences</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="appearance" className="space-y-6">
              <Card className="bg-white dark:bg-neutral-800">
                <CardHeader>
                  <CardTitle className="dark:text-white">Appearance</CardTitle>
                  <CardDescription>
                    Customize how the application looks
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-4 dark:text-white">Theme</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div 
                        className={`border rounded-md overflow-hidden cursor-pointer ${theme === 'light' ? 'ring-2 ring-primary' : ''} dark:border-neutral-700`}
                        onClick={() => setTheme('light')}
                      >
                        <div className="h-20 bg-white border-b dark:border-neutral-700"></div>
                        <div className="p-2 text-center font-medium">Light Theme</div>
                      </div>
                      
                      <div 
                        className={`border rounded-md overflow-hidden cursor-pointer ${theme === 'dark' ? 'ring-2 ring-primary' : ''} dark:border-neutral-700`}
                        onClick={() => setTheme('dark')}
                      >
                        <div className="h-20 bg-neutral-900 border-b dark:border-neutral-700"></div>
                        <div className="p-2 text-center font-medium">Dark Theme</div>
                      </div>
                      
                      <div 
                        className={`border rounded-md overflow-hidden cursor-pointer ${theme === 'system' ? 'ring-2 ring-primary' : ''} dark:border-neutral-700`}
                        onClick={() => setTheme('system')}
                      >
                        <div className="h-20 bg-gradient-to-r from-white to-neutral-900 border-b dark:border-neutral-700"></div>
                        <div className="p-2 text-center font-medium">System Default</div>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4 dark:text-white">Language and Region</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="language">Language</Label>
                        <Select defaultValue="en">
                          <SelectTrigger id="language">
                            <SelectValue placeholder="Select a language" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="es">Spanish</SelectItem>
                            <SelectItem value="fr">French</SelectItem>
                            <SelectItem value="de">German</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="timezone">Timezone</Label>
                        <Select defaultValue="america">
                          <SelectTrigger id="timezone">
                            <SelectValue placeholder="Select a timezone" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="america">America/New_York (EDT)</SelectItem>
                            <SelectItem value="pacific">America/Los_Angeles (PDT)</SelectItem>
                            <SelectItem value="europe">Europe/London (GMT)</SelectItem>
                            <SelectItem value="asia">Asia/Tokyo (JST)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mt-4">
                      <Label htmlFor="dateFormat">Date Format</Label>
                      <Select defaultValue="mdy">
                        <SelectTrigger id="dateFormat">
                          <SelectValue placeholder="Select a date format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                          <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                          <SelectItem value="ymd">YYYY-MM-DD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button>Save Preferences</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <Card className="bg-white dark:bg-neutral-800">
                <CardHeader>
                  <CardTitle className="dark:text-white">Security Settings</CardTitle>
                  <CardDescription>
                    Manage your account security preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-4 dark:text-white">Password</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="current-password">Current Password</Label>
                        <Input id="current-password" type="password" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input id="new-password" type="password" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <Input id="confirm-password" type="password" />
                      </div>
                      
                      <Button>Update Password</Button>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4 dark:text-white">Two-Factor Authentication</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium dark:text-white">Enable Two-Factor Authentication</p>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">Add an extra layer of security to your account</p>
                      </div>
                      <Switch id="two-factor" />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4 dark:text-white">Sessions</h3>
                    <div className="space-y-3">
                      <div className="p-3 border rounded-md dark:border-neutral-700">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium dark:text-white">Current Session (Chrome, Mac OS)</p>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400">San Francisco, CA • Started 2 hours ago</p>
                          </div>
                          <Badge className="bg-success text-white">Active</Badge>
                        </div>
                      </div>
                      
                      <div className="p-3 border rounded-md dark:border-neutral-700">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium dark:text-white">Safari, iPhone</p>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400">San Francisco, CA • Last active 1 day ago</p>
                          </div>
                          <Button variant="ghost" size="sm" className="text-destructive">Sign Out</Button>
                        </div>
                      </div>
                    </div>
                    
                    <Button variant="outline" className="mt-4 text-destructive border-destructive">
                      Sign Out of All Devices
                    </Button>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4 text-destructive">Danger Zone</h3>
                    <div className="p-4 border border-destructive rounded-md">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium dark:text-white">Delete Account</p>
                          <p className="text-sm text-neutral-500 dark:text-neutral-400">Permanently delete your account and all data</p>
                        </div>
                        <Button variant="destructive">Delete Account</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </>
  );
}

// Custom Badge component for the settings page
const Badge = ({ children, className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span 
      className={`px-2 py-1 text-xs rounded-full font-medium ${className}`} 
      {...props}
    >
      {children}
    </span>
  );
};
