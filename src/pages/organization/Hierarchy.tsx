
import OrgStructureBuilder from "@/components/org-structure/OrgStructureBuilder";

const Hierarchy = () => {
  const handleAddPeople = (unitId: string) => {
    // This would navigate to people management or open people modal
    console.log('Add people to unit:', unitId);
  };

  return <OrgStructureBuilder onAddPeople={handleAddPeople} />;
};

export default Hierarchy;
