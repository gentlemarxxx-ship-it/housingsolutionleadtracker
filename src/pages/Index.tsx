import { useSearchParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LeadsPage } from "./LeadsPage"

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "lead1";

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value });
  };

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="lead1">Lead 1</TabsTrigger>
        <TabsTrigger value="lead2">Lead 2</TabsTrigger>
      </TabsList>
      <TabsContent value="lead1">
        <LeadsPage
          remarkFilter="Lead 1"
          title="Lead 1"
          description="Manage all leads in the Lead 1 category."
        />
      </TabsContent>
      <TabsContent value="lead2">
        <LeadsPage
          remarkFilter="Lead 2"
          title="Lead 2"
          description="Manage all leads in the Lead 2 category."
        />
      </TabsContent>
    </Tabs>
  );
};

export default Index;