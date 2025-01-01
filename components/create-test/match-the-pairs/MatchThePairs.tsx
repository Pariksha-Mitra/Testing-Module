import React from "react";
import Field from "@/components/create-test/match-the-pairs/Field";

const MatchThePairs: React.FC = () => {
  const [fieldAValues, setFieldAValues] = React.useState<Record<string, string>>({
    a: "",
    b: "",
    c: "",
    d: "",
  });

  const [fieldBValues, setFieldBValues] = React.useState<Record<string, string>>({
    a: "",
    b: "",
    c: "",
    d: "",
  });

  const [connections, setConnections] = React.useState<Record<string, string>>(
    {}
  );
  const [activeA, setActiveA] = React.useState<string | null>(null);

  const handleFieldAChange = (key: string, value: string) => {
    setFieldAValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleFieldBChange = (key: string, value: string) => {
    setFieldBValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleConnectA = (key: string) => {
    setActiveA((prev) => (prev === key ? null : key));
  };

  const handleConnectB = (key: string) => {
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
            {`Field A ${keyA} -> Field B ${keyB}`}
          </div>
        ))}
      </div>
      <div className="mt-5">
        <button
          onClick={() => setConnections({})}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Clear All Connections
        </button>
      </div>
    </div>
  );
};

export default MatchThePairs;
