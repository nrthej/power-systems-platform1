'use client';

import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { Edit, Trash2, MoreHorizontal, GitBranch, X, ArrowRight, Plus } from 'lucide-react';
import { ErrorAlert, SuccessAlert } from '@/components/ui/Alert';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';
import { useFields } from '@/hooks/useFields';
import type { Field } from '@/shared/types';
import type { Rule } from './RuleBuilder';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/ui/Button';

interface RulesTableProps {
  searchTerm?: string;
}

export interface RulesTableRef {
  openAddModal: () => void;
  refreshRules: () => void;
}

interface RuleWithField extends Rule {
  fieldName: string;
  fieldId: string;
}

const RuleModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  rule, 
  availableFields,
  isLoading 
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<boolean>;
  rule?: RuleWithField | null;
  availableFields: Field[];
  isLoading: boolean;
}) => {
  const [formData, setFormData] = useState({
    conditionField: '',
    operator: '=',
    value: '',
    action: 'Clear',
    targetField: '',
    fieldId: ''
  });

  const isEditing = !!rule;

  useEffect(() => {
    if (isOpen) {
      if (rule) {
        setFormData({
          conditionField: rule.conditionField,
          operator: rule.operator,
          value: rule.value,
          action: rule.action,
          targetField: rule.targetField,
          fieldId: rule.fieldId
        });
      } else {
        setFormData({
          conditionField: '',
          operator: '=',
          value: '',
          action: 'Clear',
          targetField: '',
          fieldId: ''
        });
      }
    }
  }, [isOpen, rule]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await onSubmit(formData);
    if (success) onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center">
              <GitBranch className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                {isEditing ? 'Edit Rule' : 'Create New Rule'}
              </h2>
              <p className="text-sm text-slate-600">
                Define conditional logic for field behavior
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Source Field */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Source Field
            </label>
            <select
              value={formData.fieldId}
              onChange={(e) => setFormData(prev => ({ ...prev, fieldId: e.target.value }))}
              className="w-full py-3 px-4 border border-slate-200 rounded-xl bg-slate-50 text-slate-800 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
              required
            >
              <option value="">Select field that owns this rule</option>
              {availableFields.map((field) => (
                <option key={field.id} value={field.id}>
                  {field.name} ({field.type})
                </option>
              ))}
            </select>
          </div>

          {/* IF Condition */}
          <div className="bg-blue-50 rounded-xl p-4">
            <h3 className="font-medium text-slate-900 mb-3 flex items-center">
              <span className="w-6 h-6 bg-blue-100 rounded-md flex items-center justify-center mr-2">
                <span className="text-xs font-bold text-blue-600">IF</span>
              </span>
              Condition
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-2">Field</label>
                <select
                  value={formData.conditionField}
                  onChange={(e) => setFormData(prev => ({ ...prev, conditionField: e.target.value }))}
                  className="w-full p-3 border border-slate-200 rounded-lg text-sm"
                  required
                >
                  <option value="">Select field</option>
                  {availableFields.map((field) => (
                    <option key={field.id} value={field.name}>
                      {field.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-2">Operator</label>
                <select
                  value={formData.operator}
                  onChange={(e) => setFormData(prev => ({ ...prev, operator: e.target.value }))}
                  className="w-full p-3 border border-slate-200 rounded-lg text-sm"
                >
                  <option value="=">equals (=)</option>
                  <option value="!=">not equals (!=)</option>
                  <option value=">">greater than (&gt;)</option>
                  <option value="<">less than (&lt;)</option>
                  <option value="contains">contains</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-2">Value</label>
                <input
                  type="text"
                  value={formData.value}
                  onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                  className="w-full p-3 border border-slate-200 rounded-lg text-sm"
                  placeholder="Enter value"
                  required
                />
              </div>
            </div>
          </div>

          {/* THEN Action */}
          <div className="bg-green-50 rounded-xl p-4">
            <h3 className="font-medium text-slate-900 mb-3 flex items-center">
              <span className="w-6 h-6 bg-green-100 rounded-md flex items-center justify-center mr-2">
                <span className="text-xs font-bold text-green-600">THEN</span>
              </span>
              Action
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-2">Action</label>
                <select
                  value={formData.action}
                  onChange={(e) => setFormData(prev => ({ ...prev, action: e.target.value }))}
                  className="w-full p-3 border border-slate-200 rounded-lg text-sm"
                >
                  <option value="Clear">Clear</option>
                  <option value="Hide">Hide</option>
                  <option value="Disable">Disable</option>
                  <option value="Enable">Enable</option>
                  <option value="Modify">Modify</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-2">Target Field</label>
                <select
                  value={formData.targetField}
                  onChange={(e) => setFormData(prev => ({ ...prev, targetField: e.target.value }))}
                  className="w-full p-3 border border-slate-200 rounded-lg text-sm"
                  required
                >
                  <option value="">Select field</option>
                  {availableFields.map((field) => (
                    <option key={field.id} value={field.name}>
                      {field.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : isEditing ? 'Update Rule' : 'Create Rule'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const RulesTable = forwardRef<RulesTableRef, RulesTableProps>(
  ({ searchTerm = '' }, ref) => {
    const { fields, isLoading, fetchFields } = useFields();
    const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedRule, setSelectedRule] = useState<RuleWithField | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useImperativeHandle(ref, () => ({
      openAddModal: () => {
        setSelectedRule(null);
        setIsRuleModalOpen(true);
      },
      refreshRules: fetchFields,
    }));

    useEffect(() => {
      fetchFields();
    }, [fetchFields]);

    useEffect(() => {
      if (successMessage) {
        const timer = setTimeout(() => setSuccessMessage(null), 3000);
        return () => clearTimeout(timer);
      }
    }, [successMessage]);

    // Flatten all rules with their parent field info
    const allRules: RuleWithField[] = fields.flatMap(field => 
      (field.rules || []).map(rule => ({
        ...rule,
        fieldName: field.name,
        fieldId: field.id
      }))
    );

    const filteredRules = allRules.filter(rule =>
      rule.conditionField.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rule.targetField.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rule.fieldName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rule.action.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEditRule = (rule: RuleWithField) => {
      setSelectedRule(rule);
      setIsRuleModalOpen(true);
    };

    const handleDeleteRule = (rule: RuleWithField) => {
      setSelectedRule(rule);
      setIsDeleteModalOpen(true);
    };

    const handleRuleSubmit = async (data: any) => {
      try {
        // In a real app, this would call an API
        // For now, just simulate success
        setSuccessMessage(
          selectedRule ? 'Rule updated successfully!' : 'Rule created successfully!'
        );
        await fetchFields(); // Refresh the data
        return true;
      } catch (err) {
        setError('Failed to save rule');
        return false;
      }
    };

    const handleDeleteConfirm = async () => {
      try {
        // In a real app, this would call an API
        setSuccessMessage('Rule deleted successfully!');
        setIsDeleteModalOpen(false);
        setSelectedRule(null);
        await fetchFields(); // Refresh the data
      } catch (err) {
        setError('Failed to delete rule');
      }
    };

    if (isLoading && allRules.length === 0) {
      return (
        <div className="flex items-center justify-center py-16">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-slate-600 font-medium">Loading rules...</span>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {successMessage && (
          <SuccessAlert message={successMessage} closable onClose={() => setSuccessMessage(null)} />
        )}
        {error && <ErrorAlert message={error} closable onClose={() => setError(null)} />}

        {filteredRules.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-50 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <GitBranch className="w-10 h-10 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              {searchTerm ? 'No rules match your search' : 'No rules found'}
            </h3>
            <p className="text-slate-600 max-w-md mx-auto leading-relaxed">
              {searchTerm
                ? 'Try adjusting your search criteria or explore all available rules.'
                : 'Create conditional rules to automatically control field behavior based on other field values.'}
            </p>
          </div>
        )}

        {filteredRules.length > 0 && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                      Source Field
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                      Condition
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                      Action
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRules.map((rule, index) => (
                    <motion.tr
                      key={`${rule.fieldId}-${rule.id}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-slate-50 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                            <GitBranch className="w-4 h-4 text-purple-600" />
                          </div>
                          <div>
                            <div className="font-medium text-slate-900">{rule.fieldName}</div>
                            <div className="text-sm text-slate-500">Owns this rule</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2 text-sm">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded font-medium">
                            {rule.conditionField}
                          </span>
                          <span className="text-slate-500">{rule.operator}</span>
                          <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded">
                            "{rule.value}"
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2 text-sm">
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded font-medium">
                            {rule.action}
                          </span>
                          <ArrowRight className="w-4 h-4 text-slate-400" />
                          <span className="px-2 py-1 bg-green-50 text-green-700 rounded">
                            {rule.targetField}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end space-x-1">
                          <button
                            onClick={() => handleEditRule(rule)}
                            className="p-2 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-all opacity-0 group-hover:opacity-100"
                            title="Edit rule"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteRule(rule)}
                            className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                            title="Delete rule"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-all opacity-0 group-hover:opacity-100">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Rule Modal */}
        <RuleModal
          isOpen={isRuleModalOpen}
          onClose={() => {
            setIsRuleModalOpen(false);
            setSelectedRule(null);
          }}
          onSubmit={handleRuleSubmit}
          rule={selectedRule}
          availableFields={fields}
          isLoading={isLoading}
        />

        {/* Delete Confirmation */}
        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedRule(null);
          }}
          onConfirm={handleDeleteConfirm}
          title="Delete Rule"
          message={`Are you sure you want to delete this rule? This action cannot be undone.`}
          confirmLabel="Delete Rule"
          cancelLabel="Cancel"
          isLoading={isLoading}
          error={error}
          variant="danger"
        />
      </div>
    );
  }
);

RulesTable.displayName = 'RulesTable';