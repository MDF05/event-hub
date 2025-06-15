import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { handleUpdateSettings } from './actions';

interface Settings {
  id: string;
  siteName: string | null;
  siteDescription: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  midtransClientKey: string | null;
  midtransServerKey: string | null;
  facebookUrl: string | null;
  twitterUrl: string | null;
  instagramUrl: string | null;
}

export default async function AdminSettingsPage() {
  let settings: Settings | null = null;
  
  try {
    settings = await prisma.$queryRaw`
      SELECT * FROM "Settings" LIMIT 1
    ` as Settings | null;
  } catch (error) {
    console.error('Error fetching settings:', error);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>
              Configure your application settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={handleUpdateSettings} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="siteName">Site Name</Label>
                <Input
                  id="siteName"
                  name="siteName"
                  defaultValue={settings?.siteName || ''}
                  placeholder="Enter site name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="siteDescription">Site Description</Label>
                <Input
                  id="siteDescription"
                  name="siteDescription"
                  defaultValue={settings?.siteDescription || ''}
                  placeholder="Enter site description"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input
                  id="contactEmail"
                  name="contactEmail"
                  type="email"
                  defaultValue={settings?.contactEmail || ''}
                  placeholder="Enter contact email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPhone">Contact Phone</Label>
                <Input
                  id="contactPhone"
                  name="contactPhone"
                  defaultValue={settings?.contactPhone || ''}
                  placeholder="Enter contact phone"
                />
              </div>
              <Button type="submit">Save Changes</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Settings</CardTitle>
            <CardDescription>
              Configure your payment gateway settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={handleUpdateSettings} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="midtransClientKey">Midtrans Client Key</Label>
                <Input
                  id="midtransClientKey"
                  name="midtransClientKey"
                  defaultValue={settings?.midtransClientKey || ''}
                  placeholder="Enter Midtrans client key"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="midtransServerKey">Midtrans Server Key</Label>
                <Input
                  id="midtransServerKey"
                  name="midtransServerKey"
                  type="password"
                  defaultValue={settings?.midtransServerKey || ''}
                  placeholder="Enter Midtrans server key"
                />
              </div>
              <Button type="submit">Save Changes</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Social Media Settings</CardTitle>
            <CardDescription>
              Configure your social media links
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={handleUpdateSettings} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="facebookUrl">Facebook URL</Label>
                <Input
                  id="facebookUrl"
                  name="facebookUrl"
                  defaultValue={settings?.facebookUrl || ''}
                  placeholder="Enter Facebook URL"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="twitterUrl">Twitter URL</Label>
                <Input
                  id="twitterUrl"
                  name="twitterUrl"
                  defaultValue={settings?.twitterUrl || ''}
                  placeholder="Enter Twitter URL"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instagramUrl">Instagram URL</Label>
                <Input
                  id="instagramUrl"
                  name="instagramUrl"
                  defaultValue={settings?.instagramUrl || ''}
                  placeholder="Enter Instagram URL"
                />
              </div>
              <Button type="submit">Save Changes</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 