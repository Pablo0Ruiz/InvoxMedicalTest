import { Link } from 'react-router-dom';
import routes from '@/navigation/routes';

const Landing = () => {
    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <div className="flex flex-col items-center justify-center min-h-screen p-8">
                <div className="text-center max-w-4xl">
                    <h1 className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-linear-to-r from-blue-400 to-purple-500">
                        Vócali Transcripción
                    </h1>
                    <p className="text-xl text-gray-400 mb-12">
                        Transcripción médica inteligente en tiempo real
                    </p>

                    <div className="flex gap-4 justify-center">
                        <Link
                            to={routes.auth.login}
                            className="px-8 py-3 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded-lg border border-blue-500/30 transition-colors font-semibold"
                        >
                            Iniciar Sesión
                        </Link>
                        <Link
                            to={routes.auth.register}
                            className="px-8 py-3 bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 rounded-lg border border-purple-500/30 transition-colors font-semibold"
                        >
                            Registrarse
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Landing;