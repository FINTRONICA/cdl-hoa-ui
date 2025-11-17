```text
src/
├─ components/
│  └─ NestedCheckboxTree.jsx
app/
└─ examples/
   └─ nested-checkbox/
      └─ page.jsx
```

```jsx
import React, { useEffect, useMemo, useState } from "react";

const getChildren = (childrenMap, id) => childrenMap.get(id) ?? [];

const selectionsMatch = (a, b) => {
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  return keysA.every((key) => {
    const stateA = a[key];
    const stateB = b[key];
    return (
      stateB &&
      stateA.checked === stateB.checked &&
      stateA.indeterminate === stateB.indeterminate
    );
  });
};

const buildIndexes = (nodes) => {
  const parentMap = new Map();
  const childrenMap = new Map();

  const visit = (node, parentId) => {
    parentMap.set(node.id, parentId);
    childrenMap.set(node.id, node.children?.map((child) => child.id) ?? []);
    node.children?.forEach((child) => visit(child, node.id));
  };

  nodes.forEach((node) => visit(node, null));
  return { parentMap, childrenMap };
};

const createSelection = (indexes, initialChecked) => {
  const selection = {};

  const markBranch = (id, checked) => {
    selection[id] = { checked, indeterminate: false };
    getChildren(indexes.childrenMap, id).forEach((childId) =>
      markBranch(childId, checked)
    );
  };

  const syncUpwards = (id) => {
    const parentId = indexes.parentMap.get(id);
    if (!parentId) return;

    const childStates = getChildren(indexes.childrenMap, parentId).map(
      (childId) => selection[childId]
    );
    const checkedCount = childStates.filter((state) => state.checked).length;
    const childCount = childStates.length;

    selection[parentId] = {
      checked: checkedCount === childCount,
      indeterminate: checkedCount > 0 && checkedCount < childCount,
    };

    syncUpwards(parentId);
  };

  indexes.childrenMap.forEach((_, id) => {
    if (!selection[id]) {
      selection[id] = { checked: false, indeterminate: false };
    }
  });

  initialChecked.forEach((id) => {
    if (id in selection) {
      markBranch(id, true);
      syncUpwards(id);
    }
  });

  return selection;
};

export const NestedCheckboxTree = ({ nodes, initialChecked = [], onChange }) => {
  const indexes = useMemo(() => buildIndexes(nodes), [nodes]);

  const [selection, setSelection] = useState(() =>
    createSelection(indexes, initialChecked)
  );

  useEffect(() => {
    setSelection((previous) => {
      const next = createSelection(indexes, initialChecked);
      return selectionsMatch(previous, next) ? previous : next;
    });
  }, [indexes, initialChecked]);

  useEffect(() => {
    if (!onChange) return;
    const checkedIds = Object.entries(selection)
      .filter(([, status]) => status.checked)
      .map(([id]) => id);
    onChange(checkedIds);
  }, [selection, onChange]);

  const toggleBranch = (nodeId) => {
    setSelection((previous) => {
      const next = { ...previous };
      const targetChecked = !previous[nodeId]?.checked;

      const markBranch = (id) => {
        next[id] = { checked: targetChecked, indeterminate: false };
        getChildren(indexes.childrenMap, id).forEach(markBranch);
      };

      const syncUpwards = (id) => {
        const parentId = indexes.parentMap.get(id);
        if (!parentId) return;

        const childStates = getChildren(indexes.childrenMap, parentId).map(
          (childId) => next[childId]
        );
        const checkedCount = childStates.filter((state) => state.checked).length;
        const childCount = childStates.length;

        next[parentId] = {
          checked: checkedCount === childCount,
          indeterminate: checkedCount > 0 && checkedCount < childCount,
        };

        syncUpwards(parentId);
      };

      markBranch(nodeId);
      syncUpwards(nodeId);

      return next;
    });
  };

  const renderTree = (items) => (
    <ul className="space-y-2">
      {items.map((item) => (
        <TreeItem
          key={item.id}
          node={item}
          state={selection[item.id] ?? { checked: false, indeterminate: false }}
          onToggle={() => toggleBranch(item.id)}
        >
          {item.children?.length ? renderTree(item.children) : null}
        </TreeItem>
      ))}
    </ul>
  );

  return <div>{renderTree(nodes)}</div>;
};

const TreeItem = ({ node, state, onToggle, children }) => {
  const checkboxRef = React.useRef(null);

  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = state.indeterminate;
    }
  }, [state.indeterminate]);

  return (
    <li className="space-y-1">
      <label className="flex items-center space-x-2">
        <input
          ref={checkboxRef}
          type="checkbox"
          checked={state.checked}
          onChange={onToggle}
        />
        <span>{node.label}</span>
      </label>
      {children}
    </li>
  );
};
```

```jsx
"use client";

import { useState } from "react";
import { NestedCheckboxTree } from "@/components/NestedCheckboxTree";

const teamStructure = [
  {
    id: "engineering",
    label: "Engineering",
    children: [
      {
        id: "frontend",
        label: "Frontend",
        children: [
          { id: "frontend-alice", label: "Alice" },
          { id: "frontend-bob", label: "Bob" },
        ],
      },
      {
        id: "backend",
        label: "Backend",
        children: [
          { id: "backend-carol", label: "Carol" },
          { id: "backend-dan", label: "Dan" },
        ],
      },
    ],
  },
  {
    id: "design",
    label: "Design",
    children: [
      { id: "ui-ellen", label: "Ellen" },
      { id: "ux-frank", label: "Frank" },
    ],
  },
];

const defaultChecked = ["frontend-alice"];

export default function NestedCheckboxExamplePage() {
  const [selectedIds, setSelectedIds] = useState([]);

  return (
    <main className="mx-auto max-w-2xl space-y-6 p-8">
      <header>
        <h1 className="text-2xl font-semibold">Nested Checkbox Tree</h1>
        <p className="text-sm text-gray-500">
          Toggle a branch to select or deselect its entire subtree.
        </p>
      </header>

      <NestedCheckboxTree
        nodes={teamStructure}
        initialChecked={defaultChecked}
        onChange={setSelectedIds}
      />

      <section>
        <h2 className="text-lg font-medium">Currently Selected IDs</h2>
        <pre className="rounded bg-gray-100 p-3 text-sm">
          {JSON.stringify(selectedIds, null, 2)}
        </pre>
      </section>
    </main>
  );
}
```
