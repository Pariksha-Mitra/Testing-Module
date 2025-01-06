import { useCallback, useEffect, useState } from "react";

type School = {
  id: string;
  schoolId: string;
  name: string;
  contact: string;
};

export default function useFetchSchools() {
  const [schools, setSchools] = useState<School[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSchools = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/school/register", {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Something went wrong!");
      const data = await res.json();
      const schoolData = data.schools;
      const filtered: School[] = schoolData.map((school: School) => {
        return {
          id: school.id,
          name: school.name,
          contact: school.contact,
          schoolId: school.schoolId,
        };
      });

      setSchools(filtered);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      } else {
        console.log("Unknown error occured!");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSchools();
  }, [fetchSchools]);

  return {
    schools,
    isLoading,
  };
}
