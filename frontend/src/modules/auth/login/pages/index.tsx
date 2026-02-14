import routes from "@/navigation/routes";
import { Button } from "@/shared/ui/atoms";
import Input from "@/shared/ui/atoms/Input/Input";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { signIn, signOut } from 'aws-amplify/auth';
import { useEffect } from 'react';


export interface LoginProps {
    username: string;
    password: string;
}



const Login = () => {
    const navigate = useNavigate();
    const { handleSubmit, register, formState: { errors }, reset } = useForm<LoginProps>();

    useEffect(() => {
        signOut();
    }, []);

    const onSubmit = async (data: LoginProps) => {
        try {
            const { isSignedIn, nextStep } = await signIn({
                username: data.username,
                password: data.password,
            });

            if (isSignedIn) {
                console.log('Login successful', { isSignedIn, nextStep });
                navigate(routes.dashboard.root);
                reset();
            } else {
                console.log('Login incomplete', nextStep);
            }
        } catch (error) {
            console.error('Error logging in:', error);
            alert(`Error al iniciar sesión: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }


    return (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-8">
            <div className="w-full max-w-md">
                <div className="bg-gray-800/50 p-8 rounded-2xl border border-gray-700 backdrop-blur-sm shadow-xl">
                    <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-linear-to-r from-blue-400 to-purple-500">
                        Inicia sesión
                    </h1>
                    <p className="text-gray-400 mb-8">Accede a tu cuenta de Vócali</p>

                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                        <Input
                            type="text"
                            placeholder="Usuario"
                            variant="primary"
                            {...register('username', { required: 'Campo obligatorio', minLength: { value: 3, message: 'El usuario debe tener al menos 3 caracteres' } })}
                        />
                        {errors.username && <p className="text-red-400 text-sm -mt-2">{errors.username?.message}</p>}

                        <Input
                            type="password"
                            placeholder="Contraseña"
                            variant="primary"
                            {...register('password', { required: 'Campo obligatorio', minLength: { value: 4, message: 'La contraseña debe tener al menos 4 caracteres' } })}
                        />
                        {errors.password && <p className="text-red-400 text-sm -mt-2">{errors.password?.message}</p>}

                        <Button type="submit" className="mt-4">
                            Iniciar sesión
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <Link
                            to={routes.auth.register}
                            className="text-blue-400 hover:text-blue-300 transition-colors"
                        >
                            ¿No tienes una cuenta? Regístrate
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;

