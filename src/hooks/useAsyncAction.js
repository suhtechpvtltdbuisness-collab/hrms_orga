import { useCallback, useRef, useState } from "react";

const useAsyncAction = () => {
  const inFlightRef = useRef(false);
  const [activeKey, setActiveKey] = useState(null);

  const run = useCallback(async (action, key = "global") => {
    if (inFlightRef.current) {
      return null;
    }

    inFlightRef.current = true;
    setActiveKey(key);

    try {
      return await action();
    } finally {
      inFlightRef.current = false;
      setActiveKey(null);
    }
  }, []);

  return {
    activeKey,
    isLoading: activeKey !== null,
    isActive: (key) => activeKey === key,
    run,
  };
};

export default useAsyncAction;
