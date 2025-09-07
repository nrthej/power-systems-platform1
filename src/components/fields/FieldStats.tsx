// src/components/fields/FieldStats.tsx
import { Database, CheckCircle, Type, FolderOpen } from 'lucide-react';
import { Grid } from '../ui/Grid';
import { StatsCard } from '../ui/StatsCard';

interface FieldStatsProps {
  totalFields: number;
  activeFields: number;
  fieldTypes: number;
  fieldCategories: number;
}

export function FieldStats({ 
  totalFields, 
  activeFields, 
  fieldTypes, 
  fieldCategories 
}: FieldStatsProps) {
  return (
    <Grid cols={4} gap={4}>
      <StatsCard
        title="Total Fields"
        value={totalFields}
        icon={<Database className="w-6 h-6" />}
        variant="blue"
        description="All custom fields in system"
      />
      <StatsCard
        title="Active Fields"
        value={activeFields}
        icon={<CheckCircle className="w-6 h-6" />}
        variant="green"
        description="Currently available fields"
      />
      <StatsCard
        title="Field Types"
        value={fieldTypes}
        icon={<Type className="w-6 h-6" />}
        variant="purple"
        description="Different field data types"
      />
      <StatsCard
        title="Categories"
        value={fieldCategories}
        icon={<FolderOpen className="w-6 h-6" />}
        variant="orange"
        description="Field organization groups"
      />
    </Grid>
  );
}