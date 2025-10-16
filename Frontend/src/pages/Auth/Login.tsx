import { useState } from "react";
import { useNavigate } from "react-router";
import { Input } from "../../components/Inputs/Input";
import { Card } from "../../components/Card";

export function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      email: formData.email.trim() === "" ? "กรุณากรอกอีเมล" : "",
      password: formData.password.trim() === "" ? "กรุณากรอกรหัสผ่าน" : "",
      general: "",
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors(prev => ({ ...prev, general: "" }));

    setTimeout(() => {
      setErrors(()=> ({
        email: "",
        password: "",
        general: ""
      }));
    }, 5000);

    try {
    
      // For now, using dummy authentication
      if (formData.email === "admin@example.com" && formData.password === "password") {
        // Store token or user data in localStorage
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("userRole", "admin");
        localStorage.setItem("email", formData.email);

        // Redirect to admin dashboard
        navigate("/", { replace: true });
      } else {
          setErrors(prev => ({
            ...prev,
            general: "อีเมลหรือรหัสผ่านไม่ถูกต้อง"
          }));
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrors(prev => ({
        ...prev,
        general: "เกิดข้อผิดพลาดในการเข้าสู่ระบบ"
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-primary">เข้าสู่ระบบ</h1>
          <p className="text-base-content/70 mt-2">ระบบจัดการคิว</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.general && (
            <div className="alert alert-error">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{errors.general}</span>
            </div>
          )}

          <div>
            <Input
              label="อีเมล"
              value={formData.email}
              onChange={(value) => handleInputChange("email", value)}
              placeholder="กรอกอีเมล"
              type="email"
              name="email"
              className={errors.email ? "input-error" : ""}
            />
            {errors.email && (
              <p className="text-error text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <Input
              label="รหัสผ่าน"
              value={formData.password}
              onChange={(value) => handleInputChange("password", value)}
              placeholder="กรอกรหัสผ่าน"
              type="password"
              name="password"
              className={errors.password ? "input-error" : ""}
            />
            {errors.password && (
              <p className="text-error text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            className={`btn btn-primary w-full ${isLoading ? "loading" : ""}`}
            disabled={isLoading}
          >
            {isLoading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
          </button>
        </form>

<div className="mt-4 text-center text-sm text-base-content/60">
          <p>Demo Account:</p>
          <p>อีเมลผู้ใช้: <code className="bg-base-300 px-1 rounded">admin@example.com</code></p>
          <p>รหัสผ่าน: <code className="bg-base-300 px-1 rounded">password</code></p>
        </div>

        
      </Card>
    </div>
  );
}