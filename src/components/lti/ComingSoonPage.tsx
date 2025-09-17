import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Construction, Lightbulb, Clock, ArrowRight } from "lucide-react";
import comingSoonImage from "@/assets/lti-coming-soon.jpg";

interface ComingSoonPageProps {
  title: string;
  description: string;
  features?: string[];
  icon?: React.ReactNode;
  expectedDate?: string;
}

export const ComingSoonPage = ({ 
  title, 
  description, 
  features = [], 
  icon,
  expectedDate = "Q2 2024"
}: ComingSoonPageProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            {icon}
            <h1 className="text-4xl font-bold text-foreground">{title}</h1>
          </div>
          <Badge variant="secondary" className="mb-4">
            <Construction className="w-4 h-4 mr-2" />
            Coming Soon
          </Badge>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-3 mb-4">
                  <Lightbulb className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h2 className="text-xl font-semibold mb-2">What's Coming</h2>
                    <p className="text-muted-foreground">{description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {features.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Key Features</h3>
                  <ul className="space-y-2">
                    {features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-muted-foreground">
                        <ArrowRight className="w-4 h-4 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Clock className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold">Expected Release</h3>
                </div>
                <p className="text-muted-foreground">{expectedDate}</p>
                <Button className="mt-4" variant="outline">
                  Get Notified
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="lg:order-first">
            <div className="relative">
              <img 
                src={comingSoonImage} 
                alt="Coming Soon" 
                className="w-full h-auto rounded-lg shadow-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent rounded-lg"></div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-2">Need Help Now?</h3>
              <p className="text-muted-foreground mb-4">
                While we're building this feature, our support team is here to help with your current needs.
              </p>
              <Button>
                Contact Support
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};