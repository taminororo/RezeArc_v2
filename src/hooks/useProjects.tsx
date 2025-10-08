"use client";

import { useEffect, useState } from "react";

export type Project = {
  id: number | string;
  title: string;
};

export function useProjects() {
  const [all, setAll] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    let aborted = false;

    (async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/projects/list", { cache: "no-store" });
        if (!res.ok) throw new Error(`GET /api/projects/list failed: ${res.status}`);

        const json = await res.json();
        const data = Array.isArray(json.data) ? json.data : [];
        if (!aborted) setAll(data);
      } catch (err) {
        if (!aborted) setError(err);
      } finally {
        if (!aborted) setLoading(false);
      }
    })();

    return () => {
      aborted = true;
    };
  }, []);

  return { all, loading, error };
}
