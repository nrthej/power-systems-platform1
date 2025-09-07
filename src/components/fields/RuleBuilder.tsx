'use client';

import React from 'react';
import { Plus, Trash2, GitBranch, AlertCircle, ArrowRight, Zap, Lock } from 'lucide-react';
import Button from '@/components/ui/Button';
import type { Field } from '@/shared/types';

export interface Rule {
  id: string;
  conditionField: string;
  operator: string;
  value: string;
  action: string;
  targetField: string;
}

interface RuleBuilderProps {
  rules: Rule[];
  onChange: (rules: Rule[]) => void;
  availableFields?: Field[];
  currentFieldName?: string; // When set, locks conditionField to this field
  isInsideModal?: boolean; // To show different UI when inside field modal vs standalone
}

const operators = [
  { value: '=', label: 'equals', description: 'Exact match' },
  { value: '!=', label: 'not equals', description: 'Does not match' },
  { value: '>', label: 'greater than', description: 'Numeric comparison' },
  { value: '<', label: 'less than', description: 'Numeric comparison' },
  { value: 'contains', label: 'contains', description: 'Text includes' }
];

const actions = [
  { value: 'Clear', label: 'Clear', description: 'Remove field value', color: 'bg-slate-100 text-slate-700' },
  { value: 'Hide', label: 'Hide', description: 'Hide from view', color: 'bg-red-100 text-red-700' },
  { value: 'Disable', label: 'Disable', description: 'Make read-only', color: 'bg-orange-100 text-orange-700' },
  { value: 'Enable', label: 'Enable', description: 'Make editable', color: 'bg-green-100 text-green-700' },
  { value: 'Modify', label: 'Modify', description: 'Change field value', color: 'bg-blue-100 text-blue-700' }
];

export default function RuleBuilder({
  rules,
  onChange,
  availableFields = [],
  currentFieldName,
  isInsideModal = false
}: RuleBuilderProps) {
  const handleAddRule = () => {
    const newRule: Rule = {
      id: crypto.randomUUID(),
      conditionField: currentFieldName || '', // Auto-set to current field if provided
      operator: '=',
      value: '',
      action: 'Clear',
      targetField: ''
    };
    onChange([...rules, newRule]);
  };

  const handleRemoveRule = (id: string) => {
    onChange(rules.filter((r) => r.id !== id));
  };

  const handleRuleChange = (id: string, field: keyof Rule, value: string) => {
    onChange(rules.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  };

  if (rules.length === 0) {
    return (
      <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <GitBranch className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-medium text-slate-900 mb-2">No Rules Defined</h3>
        <p className="text-slate-600 mb-4 max-w-md mx-auto">
          {currentFieldName 
            ? `Create conditional rules for the "${currentFieldName}" field to automatically control other field behavior.`
            : 'Create conditional rules to automatically control field behavior based on other field values.'
          }
        </p>
        <Button onClick={handleAddRule} className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add Your First Rule</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {currentFieldName && isInsideModal && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <div className="flex items-center space-x-2">
            <Lock className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">
              Rules for "{currentFieldName}" field
            </span>
          </div>
          <p className="text-xs text-blue-600 mt-1">
            These rules will trigger when this field's value changes.
          </p>
        </div>
      )}

      {rules.map((rule, idx) => {
        const incomplete = !rule.conditionField || !rule.targetField;
        const selectedAction = actions.find(a => a.value === rule.action);
        const isConditionFieldLocked = !!currentFieldName;
        
        return (
          <div
            key={rule.id}
            className="relative bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200 rounded-xl p-6 shadow-sm"
          >
            {/* Rule Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <GitBranch className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">Rule {idx + 1}</h4>
                  <p className="text-sm text-slate-600">
                    {currentFieldName ? `For ${currentFieldName}` : 'Conditional logic'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-all"
                onClick={() => handleRemoveRule(rule.id)}
                title="Remove rule"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Rule Logic Visual */}
            <div className="space-y-4">
              {/* IF Condition */}
              <div className="bg-white rounded-lg p-4 border border-slate-200">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-md flex items-center justify-center">
                    <span className="text-xs font-bold text-blue-600">IF</span>
                  </div>
                  <span className="text-sm font-medium text-slate-700">When this condition is met</span>
                  {isConditionFieldLocked && (
                    <Lock className="w-4 h-4 text-blue-500" title="Source field is locked" />
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-2">
                      Field {isConditionFieldLocked && '(Locked)'}
                    </label>
                    {isConditionFieldLocked ? (
                      <div className="w-full p-3 border border-blue-200 rounded-lg text-sm bg-blue-50 text-blue-800 font-medium flex items-center">
                        <Lock className="w-4 h-4 mr-2" />
                        {currentFieldName}
                      </div>
                    ) : (
                      <select
                        value={rule.conditionField}
                        onChange={(e) =>
                          handleRuleChange(rule.id, 'conditionField', e.target.value)
                        }
                        className="w-full p-3 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      >
                        <option value="">Select field</option>
                        {availableFields.map((f) => (
                          <option key={f.id} value={f.name}>
                            {f.name}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-2">
                      Operator
                    </label>
                    <select
                      value={rule.operator}
                      onChange={(e) =>
                        handleRuleChange(rule.id, 'operator', e.target.value)
                      }
                      className="w-full p-3 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    >
                      {operators.map((op) => (
                        <option key={op.value} value={op.value}>
                          {op.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-2">
                      Value
                    </label>
                    <input
                      type="text"
                      value={rule.value}
                      onChange={(e) =>
                        handleRuleChange(rule.id, 'value', e.target.value)
                      }
                      className="w-full p-3 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="Enter value"
                    />
                  </div>
                </div>
              </div>

              {/* Arrow */}
              <div className="flex justify-center">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <ArrowRight className="w-4 h-4 text-white" />
                </div>
              </div>

              {/* THEN Action */}
              <div className="bg-white rounded-lg p-4 border border-slate-200">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-6 h-6 bg-green-100 rounded-md flex items-center justify-center">
                    <Zap className="text-xs text-green-600" />
                  </div>
                  <span className="text-sm font-medium text-slate-700">Then perform this action</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-2">
                      Action
                    </label>
                    <select
                      value={rule.action}
                      onChange={(e) =>
                        handleRuleChange(rule.id, 'action', e.target.value)
                      }
                      className="w-full p-3 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    >
                      {actions.map((a) => (
                        <option key={a.value} value={a.value}>
                          {a.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-2">
                      Target Field
                    </label>
                    <select
                      value={rule.targetField}
                      onChange={(e) =>
                        handleRuleChange(rule.id, 'targetField', e.target.value)
                      }
                      className="w-full p-3 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    >
                      <option value="">Select field</option>
                      {availableFields
                        .filter(f => f.name !== currentFieldName) // Don't allow targeting self
                        .map((f) => (
                          <option key={f.id} value={f.name}>
                            {f.name}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                {selectedAction && (
                  <div className="mt-3">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${selectedAction.color}`}>
                      {selectedAction.description}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Validation */}
            {incomplete && (
              <div className="mt-4 flex items-center space-x-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <p className="text-sm text-amber-700">
                  Please select both a condition field and a target field to complete this rule.
                </p>
              </div>
            )}

            {/* Rule Summary */}
            {!incomplete && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Rule Summary:</strong> When{' '}
                  <span className="font-medium">{rule.conditionField}</span> {rule.operator}{' '}
                  <span className="font-medium">"{rule.value}"</span>, then{' '}
                  <span className="font-medium">{rule.action.toLowerCase()}</span>{' '}
                  <span className="font-medium">{rule.targetField}</span>.
                </p>
              </div>
            )}
          </div>
        );
      })}

      {/* Add Rule Button */}
      <div className="flex justify-center pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={handleAddRule}
          className="flex items-center space-x-2 px-6 py-3"
        >
          <Plus className="w-4 h-4" />
          <span>Add Another Rule</span>
        </Button>
      </div>
    </div>
  );
}