const baseUrl = "https://jsonplaceholder.typicode.com/";

export const fetchUserList = async () => {
  const response = await fetch(baseUrl + "users");
  return await response.json();
};
