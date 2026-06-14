const API_BASE_URL = 'http://localhost:8080/api';

export const fetchData = async (endpoint: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`Error fetching ${endpoint}: ${response.statusText}`);
    }
    return await response.ok ? response.json() : null;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const postData = async (endpoint: string, data: any) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const deleteData = async (endpoint: string) => {
  try {
    await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
    });
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};
