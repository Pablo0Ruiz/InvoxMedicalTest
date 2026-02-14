interface VoiceItemProps {
    transcript: string;
    speaker?: string;
}

const VoiceItem = ({ transcript, speaker }: VoiceItemProps) => {
    return (
        <div className="text-sm text-gray-300 p-2 bg-gray-900/50 rounded">
            {speaker && <span className="text-blue-400 font-semibold">{speaker}: </span>}
            {transcript}
        </div>
    )
}

export default VoiceItem;
