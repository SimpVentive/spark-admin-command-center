
import { useNavigate } from "react-router-dom";
import OrgStructureBuilder from "@/components/org-structure/OrgStructureBuilder";

const Hierarchy = () => {
  const navigate = useNavigate();
  
  const handleAddPeople = (unitId: string) => {
    // Navigate to Add Employee page with unit context
    navigate(`/users/add?unitId=${unitId}`);
  };

  return <OrgStructureBuilder onAddPeople={handleAddPeople} />;
};

export default Hierarchy;
