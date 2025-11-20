import StreamerProfileHeader from '../StreamerProfileHeader';
import gamingThumb from '@assets/generated_images/Gaming_stream_thumbnail_09f29da0.png';

export default function StreamerProfileHeaderExample() {
  return (
    <div className="p-4">
      <StreamerProfileHeader
        streamerId="1"
        name="ProGamer123"
        category="Gaming"
        coverImage={gamingThumb}
        stats={{
          subscribers: 12450,
          totalViews: 1247890,
          avgViewers: 3200,
          rank: 5,
        }}
      />
    </div>
  );
}
