import StreamCard from '../StreamCard';
import gamingThumb from '@assets/generated_images/Gaming_stream_thumbnail_09f29da0.png';

export default function StreamCardExample() {
  return (
    <div className="p-4 max-w-sm">
      <StreamCard
        id="1"
        thumbnailUrl={gamingThumb}
        isLive={true}
        viewerCount={1247}
        streamerName="ProGamer123"
        streamTitle="Ranked Gameplay - Road to Champion!"
        category="Gaming"
      />
    </div>
  );
}
