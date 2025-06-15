import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Users, MapPin, Star } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">About Event Hub</h1>
          <p className="text-xl text-muted-foreground">
            Your Ultimate Platform for Event Discovery and Management
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4 mb-4">
                <Calendar className="h-8 w-8 text-primary" />
                <h2 className="text-2xl font-semibold">Our Mission</h2>
              </div>
              <p className="text-muted-foreground">
                Event Hub is dedicated to connecting event organizers with attendees through a seamless, 
                user-friendly platform. We believe in making event discovery and management accessible to everyone.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4 mb-4">
                <Users className="h-8 w-8 text-primary" />
                <h2 className="text-2xl font-semibold">Our Community</h2>
              </div>
              <p className="text-muted-foreground">
                Join thousands of event enthusiasts, organizers, and professionals who use Event Hub 
                to discover, create, and manage events of all sizes and types.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4 mb-4">
                <MapPin className="h-8 w-8 text-primary" />
                <h2 className="text-2xl font-semibold">What We Offer</h2>
              </div>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Easy event creation and management</li>
                <li>Secure ticket booking system</li>
                <li>Real-time event updates</li>
                <li>Comprehensive event analytics</li>
                <li>User-friendly interface</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4 mb-4">
                <Star className="h-8 w-8 text-primary" />
                <h2 className="text-2xl font-semibold">Why Choose Us</h2>
              </div>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Trusted by thousands of users</li>
                <li>24/7 customer support</li>
                <li>Secure payment processing</li>
                <li>Regular platform updates</li>
                <li>Dedicated event management tools</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold">Join Our Growing Community</h2>
          <p className="text-muted-foreground">
            Whether you're an event organizer looking to reach more attendees or an event enthusiast 
            seeking exciting experiences, Event Hub is your perfect platform.
          </p>
        </div>
      </div>
    </div>
  );
} 