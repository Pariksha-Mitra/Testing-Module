export async function fetchData<T>(url: string, options?: RequestInit): Promise<T> {
    const response = await fetch(url, { ...options });
    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Fetch failed with status: ${response.status} - ${errorMessage}`);
    }
    return response.json() as Promise<T>;
  }