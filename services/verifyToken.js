import { jwtDecode } from 'jwt-decode';


const verifyToken = (token) => {
  try {
    console.log("Verifying token:", token);
    if (!token) {
      throw new Error("Token is missing");
    }
    const decoded = jwtDecode(token);
    return decoded;
  } catch (error) {
    console.error("Invalid or expired token:", error);
    return null;
  }
};

export { verifyToken };
