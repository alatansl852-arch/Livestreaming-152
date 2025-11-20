import StreamPlayer from '../StreamPlayer';
import gamingThumb from '@assets/generated_images/Gaming_stream_thumbnail_09f29da0.png';

export default function StreamPlayerExample() {
  return (
    <div className="p-4">
      <StreamPlayer thumbnailUrl={gamingThumb} isLive={true} />
    </div>
  );
}
