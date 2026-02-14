import { useState } from 'react';
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { confirmSignUp } from 'aws-amplify/auth';
import { Button } from "@/shared/ui/atoms";
import Input from "@/shared/ui/atoms/Input/Input";
import routes from "@/navigation/routes";

interface VerifyProps {
    email: string;
    code: string;
}

const Verify = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const emailFromState = location.state?.email || '';

    const { handleSubmit, register, formState: { errors } } = useForm<VerifyProps>({
        defaultValues: {
            email: emailFromState
        }
    });

    const [error, setError] = useState<string | null>(null);

    const onSubmit = async (data: VerifyProps) => {
        try {
            setError(null);
            const { isSignUpComplete, nextStep } = await confirmSignUp({
                username: data.email,
                confirmationCode: data.code
            });

            if (isSignUpComplete) {
                console.log('Verification successful');
                navigate(routes.dashboard.root);
            } else {
                console.log('Verification incomplete', nextStep);
            }
        } catch (err) {
            console.error('Error verifying:', err);
            setError(err instanceof Error ? err.message : 'Error de verificación');
        }
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-8">
            <div className="w-full max-w-md">
                <div className="bg-gray-800/50 p-8 rounded-2xl border border-gray-700 backdrop-blur-sm shadow-xl">
                    <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-linear-to-r from-blue-400 to-purple-500">
                        Verificar Email
                    </h1>
                    <p className="text-gray-400 mb-8">
                        Ingresa el código que enviamos a tu correo electrónico.
                    </p>

                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                        <div>
                            <label className="text-sm text-gray-400 mb-1 block">Email:</label>
                            <Input
                                type="email"
                                placeholder="Email"
                                variant="primary"
                                {...register('email', { required: 'Email es requerido' })}
                            />
                        </div>

                        <div>
                            <label className="text-sm text-gray-400 mb-1 block">Código de verificación:</label>
                            <Input
                                type="text"
                                placeholder="123456"
                                variant="primary"
                                {...register('code', { required: 'Código es requerido' })}
                            />
                            {errors.code && <p className="text-red-400 text-sm mt-1">{errors.code.message}</p>}
                        </div>

                        {error && <p className="text-red-400 text-sm text-center">{error}</p>}

                        <Button type="submit" className="mt-4">
                            Verificar Cuenta
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Verify;
