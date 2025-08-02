import { useUser } from '@/context/UserContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const USERS = ['Ian', 'Yhome', 'Luisa'];

const Login = () => {
  const { setCurrentUser } = useUser();
  const navigate = useNavigate();

  const handleUserSelect = (user: string) => {
    setCurrentUser(user);
    navigate('/');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Select User</CardTitle>
          <CardDescription>Choose your profile to continue.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            {USERS.map((user) => (
              <Button key={user} onClick={() => handleUserSelect(user)} size="lg">
                {user}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;