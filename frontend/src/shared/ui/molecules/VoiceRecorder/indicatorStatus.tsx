

export interface IndicatorStatusProps {
    isRecording: boolean;
    isConnected: boolean;
    error?: string | null;
}

export const IndicatorStatus = ({
    isRecording,
    isConnected,
    error
}: IndicatorStatusProps) => {
    
    if(error){
        return (
            <div className="p-3 bg-red-900/50 border border-red-700 rounded text-red-200 text-sm">
                <strong>Error:</strong> {error}
            </div>
        )
    }
    
    return (
        <div className="flex justify-center gap-4 text-sm">
                    <span className={`flex items-center gap-1 ${isRecording ? 'text-red-400' : 'text-gray-500'}`}>
                        <div className={`w-2 h-2 rounded-full ${isRecording ? 'bg-red-400' : 'bg-gray-500'}`} />
                        {isRecording ? 'Grabando' : 'No grabando'}
                    </span>
                    <span className={`flex items-center gap-1 ${isConnected ? 'text-green-400' : 'text-gray-500'}`}>
                        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-gray-500'}`} />
                        {isConnected ? 'Conectado' : 'Desconectado'}
                    </span>
                </div>
    )
}