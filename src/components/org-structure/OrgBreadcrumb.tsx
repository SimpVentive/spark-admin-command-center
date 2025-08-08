import React from 'react';
import { ChevronRight, Building2, Users, UserCheck, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Breadcrumb, 
  BreadcrumbList, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from '@/components/ui/breadcrumb';

export interface BreadcrumbItem {
  id: string;
  name: string;
  level: 'organization' | 'department' | 'sub-department' | 'team';
}

interface OrgBreadcrumbProps {
  items: BreadcrumbItem[];
  onNavigate: (itemId: string) => void;
  onAddNew: () => void;
}

const getLevelIcon = (level: string) => {
  switch (level) {
    case 'organization':
      return <Building2 className="h-4 w-4" />;
    case 'department':
      return <Users className="h-4 w-4" />;
    case 'sub-department':
      return <Users className="h-3 w-3" />;
    case 'team':
      return <UserCheck className="h-3 w-3" />;
    default:
      return <Building2 className="h-4 w-4" />;
  }
};

const OrgBreadcrumb: React.FC<OrgBreadcrumbProps> = ({ items, onNavigate, onAddNew }) => {
  return (
    <div className="flex items-center justify-between bg-muted/50 px-4 py-3 rounded-lg border">
      <Breadcrumb>
        <BreadcrumbList>
          {items.map((item, index) => (
            <React.Fragment key={item.id}>
              <BreadcrumbItem>
                {index === items.length - 1 ? (
                  <BreadcrumbPage className="flex items-center gap-2 font-medium">
                    {getLevelIcon(item.level)}
                    <span className="truncate max-w-[200px]">{item.name}</span>
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink 
                    onClick={() => onNavigate(item.id)}
                    className="flex items-center gap-2 hover:text-primary cursor-pointer transition-colors"
                  >
                    {getLevelIcon(item.level)}
                    <span className="truncate max-w-[150px]">{item.name}</span>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {index < items.length - 1 && (
                <BreadcrumbSeparator>
                  <ChevronRight className="h-4 w-4" />
                </BreadcrumbSeparator>
              )}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>

      <Button 
        variant="outline" 
        size="sm" 
        onClick={onAddNew}
        className="flex items-center gap-2 ml-4"
      >
        <Plus className="h-4 w-4" />
        Add New Level
      </Button>
    </div>
  );
};

export default OrgBreadcrumb;