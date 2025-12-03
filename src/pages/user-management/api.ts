const baseUrl = "https://jsonplaceholder.typicode.com/";

export const fetchUserList = async () => {
  const response = await fetch(baseUrl + "users");
  return await response.json();
};

// 使用React Query获取用户列表数据的自定义钩子
// export const useUserList = () => {
//   return useQuery({
//     queryKey: ["user-list"],
//     queryFn: fetchUserList,
//   });
// };
