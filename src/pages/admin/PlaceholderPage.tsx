import { Card, CardContent } from "@/components/ui/card";
import { Construction } from "lucide-react";

interface Props {
  title: string;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
}

const PlaceholderPage = ({ title, description, icon: Icon = Construction }: Props) => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="text-muted-foreground">{description}</p>
    </div>
    <Card>
      <CardContent className="p-12 text-center">
        <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Icon className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-lg font-semibold mb-2">Module en préparation</h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Cette section sera activée prochainement avec toutes les fonctionnalités de gestion associées.
          Les données seront reliées à votre base Peintyhome.
        </p>
      </CardContent>
    </Card>
  </div>
);

export default PlaceholderPage;
