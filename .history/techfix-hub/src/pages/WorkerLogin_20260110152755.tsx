import { useState, useEffect } from "react";
import { Shield, LogIn, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";

interface WorkerLoginProps {
  onLogin: (workerData: any) => void;
}

const WorkerLogin = ({ onLogin }: WorkerLoginProps) => {
  const [workerId, setWorkerId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Get workers from localStorage (managed by admin)
    const workers = JSON.parse(localStorage.getItem('workers') || '[]');
    const worker = workers.find((w: any) => w.workerId === workerId && w.password === password);
    
    if (worker) {
      if (!worker.active) {
        setError("Your account has been deactivated. Contact admin.");
        return;
      }
      
      localStorage.setItem('currentWorker', JSON.stringify(worker));
      onLogin(worker);
      navigate('/worker/dashboard');
    } else {
      setError("Invalid Worker ID or Password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-hero p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4 text-center">
          <div className="w-16 h-16 mx-auto rounded-xl gradient-hero flex items-center justify-center">
            <Shield className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-display">Worker Login</CardTitle>
          <CardDescription>
            Enter your credentials to access worker portal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="workerId">Worker ID</Label>
              <Input
                id="workerId"
                type="text"
                placeholder="Enter your worker ID"
                value={workerId}
                onChange={(e) => setWorkerId(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
            <Button type="submit" className="w-full gradient-hero">
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              Contact admin if you forgot your credentials
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkerLogin;
