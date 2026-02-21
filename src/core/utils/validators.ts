/**
 * 验证工具
 */

export const validators = {
  // 邮箱验证
  isEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // 不为空
  isNotEmpty: (value: string): boolean => {
    return value.trim().length > 0;
  },

  // 密码强度（至少8个字符，包含大小写和数字）
  isStrongPassword: (password: string): boolean => {
    const strongRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return strongRegex.test(password);
  },

  // 手机号码
  isPhoneNumber: (phone: string): boolean => {
    const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
    return phoneRegex.test(phone);
  },

  // URL
  isValidUrl: (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },
};
