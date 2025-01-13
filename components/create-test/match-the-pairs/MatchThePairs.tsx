"use client"
import Field from '@/components/create-test/match-the-pairs/Field';
import React, {  useState } from 'react';

interface MatchThePairsProps {
  editable: boolean;
  initialValues?: {
    fieldA: Record<string, string>;
    fieldB: Record<string, string>;
    connections: Record<string, string>;
  };
  onChange?: (connections: Record<string, string>) => void;
}

const defaultValues = {
  a: "",
  b: "", 
  c: "",
  d: ""
};

const MatchThePairs: React.FC<MatchThePairsProps> = ({ 
  editable,
  initialValues 
}) => {
  const [fieldAValues, setFieldAValues] = useState<Record<string, string>>(
    initialValues?.fieldA || defaultValues
  );

  const [fieldBValues, setFieldBValues] = useState<Record<string, string>>(
    initialValues?.fieldB || defaultValues
  );

  const [connections, setConnections] = useState<Record<string, string>>(
    initialValues?.connections || {}
  );
  
  const [activeA, setActiveA] = useState<string | null>(null);

  const handleFieldAChange = (key: string, value: string) => {
    if (!editable) return; // Prevent changes if not editable

    setFieldAValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleFieldBChange = (key: string, value: string) => {
    if (!editable) return; // Prevent changes if not editable

    setFieldBValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleConnectA = (key: string) => {
    if (!editable) return; // Prevent connecting if not editable

    setActiveA((prev) => (prev === key ? null : key));
  };

  const handleConnectB = (key: string) => {
    if (!editable) return; // Prevent connecting if not editable

    if (activeA) {
      setConnections((prev) => {
        const updated = { ...prev };
        // Remove any existing connection to this Field B item
        Object.keys(updated).forEach((aKey) => {
          if (updated[aKey] === key) {
            delete updated[aKey];
          }
        });
        updated[activeA] = key;
        return updated;
      });
      setActiveA(null);
    }
  };

  const handleClearConnections = () => {
    if (!editable) return; // Prevent clearing if not editable

    setConnections({});
  };

  return (
    <div className="mt-3.5 w-full max-md:max-w-full">
      <div className="flex gap-5 max-md:flex-col">
        <div className="flex flex-col w-6/12 max-md:ml-0 max-md:w-full">
          <Field
            title="Field A"
            values={fieldAValues}
            onValueChange={handleFieldAChange}
            onConnect={handleConnectA}
            activeItem={activeA}
            connections={connections}
            editable={editable} // Pass editable prop
          />
        </div>
        <div className="flex flex-col ml-5 w-6/12 max-md:ml-0 max-md:w-full">
          <Field
            title="Field B"
            isRightSide
            values={fieldBValues}
            onValueChange={handleFieldBChange}
            onConnect={handleConnectB}
            activeItem={null} // Field B doesn't have an active selection
            connections={connections}
            editable={editable} // Pass editable prop
          />
        </div>
      </div>
      <div className="mt-5">
        <h3 className="text-lg font-semibold">Connections</h3>
        {Object.entries(connections).length === 0 && (
          <div>No connections yet.</div>
        )}
        {Object.entries(connections).map(([keyA, keyB]) => (
          <div key={keyA} className="mt-1">
            {`Field A ${keyA.toUpperCase()} -> Field B ${keyB.toUpperCase()}`}
          </div>
        ))}
      </div>
      <div className="mt-5">
        <button
          onClick={handleClearConnections}
          disabled={!editable} // Disable button when not editable
          className={`px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 ${
            !editable ? "opacity-50 cursor-not-allowed" : ""
          }`}
          aria-disabled={!editable} // Accessibility attribute
        >
          Clear All Connections
        </button>
      </div>
    </div>
  );
};

export default MatchThePairs;
