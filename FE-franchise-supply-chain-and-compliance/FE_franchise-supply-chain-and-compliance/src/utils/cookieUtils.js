export function setCookie(name, value, days = 7) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  // Thêm SameSite=Lax và Secure để tăng tính bảo mật (Secure chỉ chạy trên HTTPS)
  const isSecure = window.location.protocol === 'https:';
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax${isSecure ? '; Secure' : ''}`;
}

export function getCookie(name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

export function removeCookie(name) {
  // Đảm bảo xóa đúng path và domain
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`;
}

// ===== Role Management =====
export function setUserRoles(roles) {
  const roleCodes = roles.map(r => r.code || r);
  setCookie('user_roles', JSON.stringify(roleCodes), 7);
}

export function getUserRoles() {
  const rolesStr = getCookie('user_roles');
  if (!rolesStr) return [];
  try {
    return JSON.parse(rolesStr);
  } catch {
    return [];
  }
}

export function removeUserRoles() {
  removeCookie('user_roles');
}
