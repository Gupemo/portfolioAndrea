import { useEffect, useState } from "react";
import { useTranslations } from "@/hooks/useTranslations";

export function useFetch<T>(url: string) {
  const { translate } = useTranslations();
  const [data, setData] = useState<T | undefined>(undefined);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(url);
        if (!res.ok) {
          //toast.error(translate.general.errors.failed_to_fetch);
          return
        }
        const json = await res.json();
        setData(json);
      } catch {
        //toast.error(translate.general.errors.failed_to_fetch);
      }
    }
    fetchData();
  }, [url, translate]);
  return { data };
}