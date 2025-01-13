import { useCallback, useEffect, useState } from 'react';

type School = {
  id: unknown;
  _id: string;
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
      const res = await fetch("/api/school/listSchool", {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Something went wrong!");
      const data = await res.json();
      const schoolData = data.schools;
      const filtered: School[] = schoolData.map((school: School) => {
        return {
          id: school._id,
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
        console.log("Unknown error occurred!");
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
