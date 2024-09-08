import jwt from 'jsonwebtoken';

export async function verify(token) {
  try {
    if (token) {
      const decoded = await jwt.verify(token, "MyKey");
      return { success: true, id: decoded.userId };
    } else {
      return { success: false, message: "Login again please" };
    }
  } catch (err) {
    return { success: false, message: "Sorry, you can't access this page" };
  }
}