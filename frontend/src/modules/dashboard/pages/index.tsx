import { UploadFile, VoiceRecorder, TranscriptionList } from "@/shared/ui/molecules";
import { signOut } from 'aws-amplify/auth';
import { useNavigate } from 'react-router-dom';
import { routes } from '@/navigation/routes';

const Dashboard = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut();
            navigate(routes.auth.login);
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <header className="flex justify-between items-center mb-12 max-w-6xl mx-auto">
                <div>
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-400 to-purple-500">
                        Vócali Dashboard
                    </h1>
                    <p className="text-gray-400 mt-2">Transcripción médica inteligente en tiempo real</p>
                </div>
                <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg border border-red-500/30 transition-colors"
                >
                    Cerrar Sesión
                </button>
            </header>

            <main className="max-w-6xl mx-auto space-y-12">
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700 backdrop-blur-sm shadow-xl">
                        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                            <span className="text-2xl">🎙️</span> Nueva Grabación
                        </h2>
                        <VoiceRecorder />
                    </div>

                    <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700 backdrop-blur-sm shadow-xl">
                        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                            <span className="text-2xl">📁</span> Subir Audio
                        </h2>
                        <UploadFile />
                    </div>
                </section>
                <section>
                    <TranscriptionList />
                </section>
            </main>
        </div>
    );
};

export default Dashboard;