// src/components/fields/FieldTypesGrid.tsx
import { 
    Type, 
    Hash, 
    Calendar, 
    List, 
    ToggleLeft, 
    Mail, 
    MapPin, 
    DollarSign,
    Check,
    X,
    Plus
  } from 'lucide-react';
  
  import { Grid } from '../ui/Grid';
  import { Card } from '../ui/Card';
  import { Button } from '../ui/Button';
  import { FieldTypeInfo, FieldType } from './fieldsData';
  
  interface FieldTypesGridProps {
    fieldTypes: FieldTypeInfo[];
    searchTerm?: string;
    onCreateField?: (fieldType: FieldType) => void;
  }
  
  export function FieldTypesGrid({ 
    fieldTypes, 
    searchTerm = '',
    onCreateField 
  }: FieldTypesGridProps) {
    
    // Icon mapping for field types
    const getIcon = (iconName: string) => {
      const iconClass = "w-8 h-8";
      switch (iconName) {
        case 'Type':
          return <Type className={iconClass} />;
        case 'Hash':
          return <Hash className={iconClass} />;
        case 'Calendar':
          return <Calendar className={iconClass} />;
        case 'List':
          return <List className={iconClass} />;
        case 'ToggleLeft':
          return <ToggleLeft className={iconClass} />;
        case 'Mail':
          return <Mail className={iconClass} />;
        case 'MapPin':
          return <MapPin className={iconClass} />;
        case 'DollarSign':
          return <DollarSign className={iconClass} />;
        default:
          return <Type className={iconClass} />;
      }
    };
  
    // Filter field types based on search
    const filteredFieldTypes = fieldTypes.filter(fieldType => {
      if (!searchTerm) return true;
      
      const searchLower = searchTerm.toLowerCase();
      return (
        fieldType.label.toLowerCase().includes(searchLower) ||
        fieldType.description.toLowerCase().includes(searchLower) ||
        fieldType.type.toLowerCase().includes(searchLower)
      );
    });
  
    // Feature badge component
    const FeatureBadge = ({ 
      supported, 
      label 
    }: { 
      supported: boolean; 
      label: string; 
    }) => (
      <div className={`flex items-center gap-1 text-xs ${
        supported ? 'text-green-600' : 'text-gray-400'
      }`}>
        {supported ? (
          <Check className="w-3 h-3" />
        ) : (
          <X className="w-3 h-3" />
        )}
        <span>{label}</span>
      </div>
    );
  
    // Color mapping for different field types
    const getTypeColor = (type: FieldType): string => {
      switch (type) {
        case FieldType.TEXT:
          return 'text-blue-600 bg-blue-50 border-blue-200';
        case FieldType.NUMBER:
          return 'text-green-600 bg-green-50 border-green-200';
        case FieldType.DATE:
          return 'text-purple-600 bg-purple-50 border-purple-200';
        case FieldType.SELECT:
        case FieldType.MULTI_SELECT:
          return 'text-orange-600 bg-orange-50 border-orange-200';
        case FieldType.BOOLEAN:
          return 'text-indigo-600 bg-indigo-50 border-indigo-200';
        case FieldType.EMAIL:
          return 'text-red-600 bg-red-50 border-red-200';
        case FieldType.LOCATION:
          return 'text-teal-600 bg-teal-50 border-teal-200';
        case FieldType.CURRENCY:
          return 'text-yellow-600 bg-yellow-50 border-yellow-200';
        default:
          return 'text-gray-600 bg-gray-50 border-gray-200';
      }
    };
  
    return (
      <div className="space-y-6">
        {/* Grid of field types */}
        <Grid cols={3} gap={6}>
          {filteredFieldTypes.map((fieldType) => (
            <Card key={fieldType.type} className="p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg border ${getTypeColor(fieldType.type)}`}>
                    {getIcon(fieldType.icon)}
                  </div>
                  {onCreateField && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onCreateField(fieldType.type)}
                      className="h-8 w-8 p-0"
                      title={`Create ${fieldType.label} Field`}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  )}
                </div>
  
                {/* Title and Description */}
                <div className="flex-1 space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {fieldType.label}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {fieldType.description}
                  </p>
                </div>
  
                {/* Validation Options */}
                <div className="mt-4 space-y-2">
                  <div className="text-xs font-medium text-gray-700 uppercase tracking-wide">
                    Validation Options
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {fieldType.validationOptions.map((option) => (
                      <span
                        key={option}
                        className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                      >
                        {option}
                      </span>
                    ))}
                  </div>
                </div>
  
                {/* Features */}
                <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
                  <FeatureBadge
                    supported={fieldType.supportsPermissibleValues}
                    label="Predefined Values"
                  />
                  <FeatureBadge
                    supported={fieldType.supportsParentChild}
                    label="Dependent Fields"
                  />
                </div>
  
                {/* Field Type Identifier */}
                <div className="mt-4 pt-2">
                  <div className="text-xs font-mono text-gray-500 bg-gray-50 px-2 py-1 rounded">
                    {fieldType.type}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </Grid>
  
        {/* Empty State */}
        {filteredFieldTypes.length === 0 && (
          <div className="text-center py-12">
            <Type className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No field types found
            </h3>
            <p className="text-gray-600">
              {searchTerm 
                ? `No field types match "${searchTerm}". Try adjusting your search.`
                : "No field types are available."
              }
            </p>
          </div>
        )}
  
        {/* Field Type Usage Statistics */}
        {filteredFieldTypes.length > 0 && (
          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-900 mb-4">
              Field Type Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Total Types:</span>
                <span className="ml-2 font-medium">{fieldTypes.length}</span>
              </div>
              <div>
                <span className="text-gray-600">Support Validation:</span>
                <span className="ml-2 font-medium">
                  {fieldTypes.filter(ft => ft.validationOptions.length > 1).length}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Support Dependencies:</span>
                <span className="ml-2 font-medium">
                  {fieldTypes.filter(ft => ft.supportsParentChild).length}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }