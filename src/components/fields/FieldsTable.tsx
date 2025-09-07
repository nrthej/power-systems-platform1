// src/components/fields/FieldsTable.tsx
import { 
  Edit, 
  Trash2, 
  Eye, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Type,
  Hash,
  Calendar,
  List,
  ToggleLeft,
  Mail,
  MapPin,
  DollarSign
} from 'lucide-react';

import { DataTable } from '../ui/DataTable';
import Button from '../ui/Button';
import { Field, FieldType, FieldStatus } from './fieldsData';

interface FieldsTableProps {
  fields: Field[];
  selectedFields: string[];
  onSelectionChange: (selectedIds: string[]) => void;
  onFieldEdit: (field: Field) => void;
  onFieldDelete: (fieldId: string) => void;
}

export function FieldsTable({
  fields,
  selectedFields,
  onSelectionChange,
  onFieldEdit,
  onFieldDelete
}: FieldsTableProps) {

  // Field type icons mapping
  const getFieldTypeIcon = (type: FieldType) => {
    const iconClass = "w-4 h-4";
    switch (type) {
      case FieldType.TEXT:
        return <Type className={iconClass} />;
      case FieldType.NUMBER:
        return <Hash className={iconClass} />;
      case FieldType.DATE:
        return <Calendar className={iconClass} />;
      case FieldType.SELECT:
      case FieldType.MULTI_SELECT:
        return <List className={iconClass} />;
      case FieldType.BOOLEAN:
        return <ToggleLeft className={iconClass} />;
      case FieldType.EMAIL:
        return <Mail className={iconClass} />;
      case FieldType.LOCATION:
        return <MapPin className={iconClass} />;
      case FieldType.CURRENCY:
        return <DollarSign className={iconClass} />;
      default:
        return <Type className={iconClass} />;
    }
  };

  // Status badge component
  const StatusBadge = ({ status }: { status: FieldStatus }) => {
    const statusConfig = {
      [FieldStatus.ACTIVE]: {
        icon: <CheckCircle className="w-3 h-3" />,
        className: 'bg-green-100 text-green-700 border-green-200',
        label: 'Active'
      },
      [FieldStatus.INACTIVE]: {
        icon: <XCircle className="w-3 h-3" />,
        className: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        label: 'Inactive'
      },
      [FieldStatus.DEPRECATED]: {
        icon: <AlertTriangle className="w-3 h-3" />,
        className: 'bg-red-100 text-red-700 border-red-200',
        label: 'Deprecated'
      }
    };

    const config = statusConfig[status];
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border ${config.className}`}>
        {config.icon}
        {config.label}
      </span>
    );
  };

  // Category badge component
  const CategoryBadge = ({ category }: { category: string }) => {
    const categoryConfig: Record<string, string> = {
      technical: 'bg-blue-100 text-blue-700 border-blue-200',
      financial: 'bg-green-100 text-green-700 border-green-200',
      administrative: 'bg-purple-100 text-purple-700 border-purple-200',
      regulatory: 'bg-orange-100 text-orange-700 border-orange-200'
    };

    const className = categoryConfig[category] || 'bg-gray-100 text-gray-700 border-gray-200';
    
    return (
      <span className={`inline-flex px-2 py-1 rounded-md text-xs font-medium border ${className}`}>
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </span>
    );
  };

  // Table columns configuration - simplified for your DataTable
  const columns = [
    { key: 'name', label: 'Field Name' },
    { key: 'type', label: 'Type' },
    { key: 'category', label: 'Category' },
    { key: 'entityType', label: 'Entity' },
    { key: 'status', label: 'Status' },
    { key: 'required', label: 'Required' },
    { key: 'updatedAt', label: 'Last Modified' },
    { key: 'actions', label: 'Actions' }
  ];

  // Row renderer - matches your DataTable interface
  const renderRow = (field: Field, index: number) => {
    const isSelected = selectedFields.includes(field.id);
    
    return (
      <tr 
        key={field.id}
        className={`hover:bg-gray-50 transition-colors ${isSelected ? 'bg-blue-50' : ''}`}
      >
        {/* Checkbox */}
        <td className="px-6 py-4 w-4">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => {
              if (e.target.checked) {
                onSelectionChange([...selectedFields, field.id]);
              } else {
                onSelectionChange(selectedFields.filter(id => id !== field.id));
              }
            }}
            className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
          />
        </td>

        {/* Field Name */}
        <td className="px-6 py-4">
          <div className="flex flex-col">
            <div className="text-sm font-medium text-gray-900">
              {field.label}
            </div>
            <div className="text-sm text-gray-500">
              {field.name}
            </div>
            {field.description && (
              <div className="text-xs text-gray-400 mt-1 truncate max-w-xs">
                {field.description}
              </div>
            )}
          </div>
        </td>

        {/* Type */}
        <td className="px-6 py-4">
          <div className="flex items-center gap-2">
            {getFieldTypeIcon(field.type)}
            <span className="text-sm text-gray-900">
              {field.type.charAt(0) + field.type.slice(1).toLowerCase().replace('_', ' ')}
            </span>
          </div>
        </td>

        {/* Category */}
        <td className="px-6 py-4">
          <CategoryBadge category={field.category} />
        </td>

        {/* Entity Type */}
        <td className="px-6 py-4">
          <span className="text-sm text-gray-900">
            {field.entityType.charAt(0) + field.entityType.slice(1).toLowerCase()}
          </span>
        </td>

        {/* Status */}
        <td className="px-6 py-4">
          <StatusBadge status={field.status} />
        </td>

        {/* Required */}
        <td className="px-6 py-4">
          <div className="flex items-center">
            {field.isRequired ? (
              <CheckCircle className="w-4 h-4 text-red-500" />
            ) : (
              <XCircle className="w-4 h-4 text-gray-400" />
            )}
          </div>
        </td>

        {/* Last Modified */}
        <td className="px-6 py-4">
          <div className="text-sm text-gray-900">
            {new Date(field.updatedAt).toLocaleDateString()}
          </div>
          <div className="text-xs text-gray-500">
            {new Date(field.updatedAt).toLocaleTimeString()}
          </div>
        </td>

        {/* Actions */}
        <td className="px-6 py-4">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => console.log('Preview field:', field.id)}
              className="h-8 w-8 p-0"
              title="Preview Field"
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onFieldEdit(field)}
              className="h-8 w-8 p-0"
              title="Edit Field"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onFieldDelete(field.id)}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
              title="Delete Field"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </td>
      </tr>
    );
  };

  // Handle select all
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(fields.map(field => field.id));
    } else {
      onSelectionChange([]);
    }
  };

  // Empty state
  if (fields.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
        <div className="text-gray-400 mb-4">
          <Type className="w-12 h-12 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No fields found
        </h3>
        <p className="text-gray-600">
          Create your first custom field to get started. Fields allow you to capture custom data for projects, users, and assets.
        </p>
      </div>
    );
  }

  return (
    <DataTable
      columns={columns}
      data={fields}
      renderRow={renderRow}
      onSelectAll={handleSelectAll}
      selectedItems={selectedFields}
    />
  );
}