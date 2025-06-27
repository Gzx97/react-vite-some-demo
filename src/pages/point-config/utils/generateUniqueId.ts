/**
 * 前端用于生成唯一ID
 * @param prefix 前缀
 * @returns {boolean}
 */
export function generateUniqueId(prefix: string): string {
  const timestamp = Date.now().toString(36); // 将当前时间戳转换为 36 进制字符串
  const randomStr = Math.random().toString(36).substring(2, 7); // 生成一个随机的 5 位 36 进制字符串
  const id = `${prefix}_${timestamp}_${randomStr}`; // 将 prefix、timestamp 和 randomStr 拼接在一起
  return id;
}

/**
 * 判断是否为前端临时生成的id
 * @param id
 * @returns {boolean}
 */
export const isTempId = (id: string): boolean => {
  const regex: RegExp = /point/;
  return regex.test(id);
};
