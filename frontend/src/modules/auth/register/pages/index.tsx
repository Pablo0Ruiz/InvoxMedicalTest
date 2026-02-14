import routes from "@/navigation/routes";
import { Button } from "@/shared/ui/atoms";
import Input from "@/shared/ui/atoms/Input/Input";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { signUp } from 'aws-amplify/auth';


interface RegisterProps {
    email: string;
    password: string;
}



const Register = () => {
    const navigate = useNavigate();
    const { handleSubmit, register, formState: { errors }, reset } = useForm<RegisterProps>();

    const onSubmit = async (data: RegisterProps) => {
        try {
            const { isSignUpComplete, userId, nextStep } = await signUp({
                username: data.email,
                password: data.password,
                options: {
                    userAttributes: {
                        email: data.email,
                    },
                },
            });

            console.log('Sign up successful', { isSignUpComplete, userId, nextStep });

            navigate(routes.auth.verify);
            reset();
        } catch (error) {
            console.error('Error signing up:', error);
            alert(`Error al registrarse: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }


    return (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-8">
            <div className="w-full max-w-md">
                <div className="bg-gray-800/50 p-8 rounded-2xl border border-gray-700 backdrop-blur-sm shadow-xl">
                    <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-linear-to-r from-blue-400 to-purple-500">
                        Regístrate
                    </h1>
                    <p className="text-gray-400 mb-8">Crea tu cuenta de Vócali</p>

                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                        <div>
                            <label className="text-sm text-gray-400 mb-1 block">Email:</label>
                            <Input
                                type="email"
                                placeholder="Email@example.com"
                                variant="primary"
                                {...register('email', { required: 'Campo obligatorio' })}
                            />
                            {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email?.message}</p>}
                        </div>

                        <div>
                            <label className="text-sm text-gray-400 mb-1 block">Contraseña:</label>
                            <Input
                                type="password"
                                placeholder="********"
                                variant="primary"
                                {...register('password', { required: 'Campo obligatorio', minLength: { value: 4, message: 'La contraseña debe tener al menos 4 caracteres' } })}
                            />
                            {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password?.message}</p>}
                        </div>

                        <Button type="submit" className="mt-4">
                            Registrarse
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <Link
                            to={routes.auth.login}
                            className="text-blue-400 hover:text-blue-300 transition-colors"
                        >
                            ¿Ya tienes una cuenta? Inicia sesión
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;

